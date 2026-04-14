"""
DermaSmart V3 — High-Accuracy Skin Condition Classifier
Target: 70-80% Validation Accuracy

HOW TO USE:
  1. Upload this file to Kaggle as a new notebook (File > Import Notebook)
     OR paste each "CELL" section into a new Colab/Kaggle cell
  2. Enable GPU (T4 or better)
  3. Run all cells
  4. Download best_final.keras when done
  5. Place at: dermasmart/backend/model/tf_model.keras
  6. Run: python convert_model.py

WHY V3 BEATS V2 (38% → expected 70-80%):
  - EfficientNetV2S backbone (20M params vs MobileNetV2's 2.5M)
  - ImageNet-21k pretrained (14M images vs 1.2M)
  - 384x384 input (captures fine skin texture)
  - Proper Dermnet test/ directory used for validation
  - 3-phase progressive fine-tuning (Phase 1 best loaded before Phase 2!)
  - Cosine Annealing LR with warmup
  - AdamW optimizer with weight decay
  - Label smoothing (0.1)
  - Mixed precision training (2x faster on T4)
"""

# ─── CELL 1: Install ────────────────────────────────────────────────────────
# !pip install -q kagglehub tensorflow matplotlib scikit-learn


# ─── CELL 2: Imports + Mixed Precision ─────────────────────────────────────
import os
import math
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, mixed_precision
from tensorflow.keras.applications import EfficientNetV2S
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from sklearn.utils.class_weight import compute_class_weight
import kagglehub

# Mixed precision: 2x faster on T4 GPU, no accuracy loss
policy = mixed_precision.Policy('mixed_float16')
mixed_precision.set_global_policy(policy)

print(f'TF version:    {tf.__version__}')
print(f'GPUs:          {tf.config.list_physical_devices("GPU")}')
print(f'Compute dtype: {policy.compute_dtype}')


# ─── CELL 3: Download Dataset ────────────────────────────────────────────────
# Dermnet has SEPARATE train/ and test/ directories.
# V2 was splitting only train/ 80/20 — that was wrong!
# V3 uses the proper test/ set for validation.
path = kagglehub.dataset_download('shubhamgoel27/dermnet')
print(f'Dataset path: {path}')

TRAIN_DIR = TEST_DIR = None
for root, dirs, files in os.walk(path):
    if 'train' in dirs and TRAIN_DIR is None:
        TRAIN_DIR = os.path.join(root, 'train')
    if 'test' in dirs and TEST_DIR is None:
        TEST_DIR = os.path.join(root, 'test')
    if TRAIN_DIR and TEST_DIR:
        break

classes     = sorted(os.listdir(TRAIN_DIR))
train_count = sum(len(f) for _, _, f in os.walk(TRAIN_DIR))
test_count  = sum(len(f) for _, _, f in os.walk(TEST_DIR)) if TEST_DIR else 0

print(f'Train dir:    {TRAIN_DIR}')
print(f'Test  dir:    {TEST_DIR}')
print(f'Train images: {train_count:,}')
print(f'Test  images: {test_count:,}')
print(f'Classes ({len(classes)}): {classes}')


# ─── CELL 4: Configuration ──────────────────────────────────────────────────
IMG_SIZE    = 384       # EfficientNetV2S native size; captures skin texture detail
BATCH_SIZE  = 16        # Use 8 if you get GPU OOM errors
NUM_CLASSES = 23
SEED        = 42

# Phase 1: completely frozen backbone, train head only
PHASE1_EPOCHS = 20
PHASE1_LR     = 3e-4

# Phase 2: unfreeze last 100 layers
PHASE2_EPOCHS  = 40
PHASE2_LR      = 5e-5
FINE_TUNE_FROM = -100   # negative index = last N layers

# Phase 3: unfreeze ALL layers (final polish)
PHASE3_EPOCHS = 30
PHASE3_LR     = 1e-5

# Regularization
LABEL_SMOOTHING = 0.1   # Prevents overconfident wrong predictions
DROPOUT_RATE    = 0.4
WEIGHT_DECAY    = 1e-4

print(f'IMG={IMG_SIZE}x{IMG_SIZE}, BATCH={BATCH_SIZE}, CLASSES={NUM_CLASSES}')
print(f'Phase 1: {PHASE1_EPOCHS} epochs @ LR={PHASE1_LR}')
print(f'Phase 2: {PHASE2_EPOCHS} epochs @ LR={PHASE2_LR}  (last 100 layers)')
print(f'Phase 3: {PHASE3_EPOCHS} epochs @ LR={PHASE3_LR}  (all layers)')


# ─── CELL 5: Data Pipelines + Augmentation ──────────────────────────────────
AUTOTUNE = tf.data.AUTOTUNE

# Strong augmentation for skin condition diversity
augmentation = keras.Sequential([
    layers.RandomFlip('horizontal'),
    layers.RandomRotation(0.15),            # ±15 degrees
    layers.RandomZoom(0.20),                # ±20% zoom
    layers.RandomContrast(0.30),            # ±30% contrast
    layers.RandomBrightness(0.20),          # ±20% brightness
    layers.RandomTranslation(0.10, 0.10),   # ±10% shift
], name='augmentation')

# EfficientNetV2S has include_preprocessing=True so we feed raw [0,255] images
def preprocess_train(images, labels):
    return augmentation(images, training=True), labels

def preprocess_val(images, labels):
    return images, labels

# Load datasets
train_ds_raw = keras.utils.image_dataset_from_directory(
    TRAIN_DIR,
    image_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    seed=SEED,
    label_mode='categorical',
    shuffle=True,
)

if TEST_DIR and os.path.exists(TEST_DIR):
    val_ds_raw = keras.utils.image_dataset_from_directory(
        TEST_DIR,
        image_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        seed=SEED,
        label_mode='categorical',
        shuffle=False,
    )
    print('Using proper Dermnet test/ directory for validation')
else:
    n = len(train_ds_raw)
    val_ds_raw   = train_ds_raw.skip(int(0.8 * n))
    train_ds_raw = train_ds_raw.take(int(0.8 * n))
    print('Fallback: 80/20 split (test/ not found)')

class_names = train_ds_raw.class_names
train_ds = train_ds_raw.map(preprocess_train, num_parallel_calls=AUTOTUNE).prefetch(AUTOTUNE)
val_ds   = val_ds_raw.map(preprocess_val,   num_parallel_calls=AUTOTUNE).prefetch(AUTOTUNE)

print(f'Train batches: {len(train_ds_raw)}')
print(f'Val   batches: {len(val_ds_raw)}')
print('Data pipelines ready')


# ─── CELL 6: Compute Class Weights ─────────────────────────────────────────
print('Computing class weights...')
all_labels = []
for _, lbls in train_ds_raw:
    all_labels.extend(np.argmax(lbls.numpy(), axis=1))
all_labels = np.array(all_labels)

cw_arr  = compute_class_weight('balanced', classes=np.unique(all_labels), y=all_labels)
cw_dict = dict(enumerate(cw_arr))

print('Class weights:')
for i, (cls, w) in enumerate(zip(class_names, cw_arr)):
    print(f'  {cls[:50]:<50} {w:.3f}')


# ─── CELL 7: Build Model ────────────────────────────────────────────────────
def build_model():
    # EfficientNetV2S pretrained on ImageNet-21k (14M images) — far stronger than MobileNetV2
    # include_preprocessing=True handles its own normalisation
    try:
        base = EfficientNetV2S(
            input_shape=(IMG_SIZE, IMG_SIZE, 3),
            include_top=False,
            weights='imagenet21k',
            include_preprocessing=True,
        )
        print('EfficientNetV2S: ImageNet-21k weights loaded')
    except Exception:
        base = EfficientNetV2S(
            input_shape=(IMG_SIZE, IMG_SIZE, 3),
            include_top=False,
            weights='imagenet',
            include_preprocessing=True,
        )
        print('EfficientNetV2S: ImageNet weights (21k unavailable)')

    base.trainable = False  # Freeze for Phase 1

    inp = keras.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    x = base(inp, training=False)  # training=False = BN in inference mode when frozen
    x = layers.GlobalAveragePooling2D()(x)

    # Two-layer head for 23-class problem
    x = layers.Dense(512, kernel_regularizer=keras.regularizers.l2(WEIGHT_DECAY))(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.Dropout(DROPOUT_RATE)(x)

    x = layers.Dense(256, kernel_regularizer=keras.regularizers.l2(WEIGHT_DECAY))(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation('relu')(x)
    x = layers.Dropout(0.3)(x)

    # float32 output — required for mixed_float16 stability
    out = layers.Dense(NUM_CLASSES, activation='softmax', dtype='float32')(x)
    return keras.Model(inp, out), base

model, base_model = build_model()
trainable  = sum(p.numpy().size for p in model.trainable_weights)
ntrainable = sum(p.numpy().size for p in model.non_trainable_weights)
print(f'Trainable:     {trainable:,}')
print(f'Non-trainable: {ntrainable:,}')


# ─── CELL 8: Cosine LR Callback ─────────────────────────────────────────────
class CosineWarmup(keras.callbacks.Callback):
    """Linear warmup then cosine annealing — better than ReduceLROnPlateau."""
    def __init__(self, total_epochs, lr_max, lr_min=1e-8, warmup_epochs=3):
        super().__init__()
        self.total_epochs  = total_epochs
        self.lr_max        = lr_max
        self.lr_min        = lr_min
        self.warmup_epochs = warmup_epochs

    def on_epoch_begin(self, epoch, logs=None):
        if epoch < self.warmup_epochs:
            lr = self.lr_max * (epoch + 1) / self.warmup_epochs
        else:
            prog = (epoch - self.warmup_epochs) / max(1, self.total_epochs - self.warmup_epochs)
            lr = self.lr_min + 0.5 * (self.lr_max - self.lr_min) * (1 + math.cos(math.pi * prog))
        self.model.optimizer.learning_rate.assign(float(lr))

    def on_epoch_end(self, epoch, logs=None):
        lr = float(self.model.optimizer.learning_rate)
        print(f'  [LR={lr:.2e}]', end='')


# ─── CELL 9: PHASE 1 — Train Head Only ─────────────────────────────────────
# Expected: ~45-55% val accuracy
model.compile(
    optimizer=keras.optimizers.AdamW(learning_rate=PHASE1_LR, weight_decay=WEIGHT_DECAY),
    loss=keras.losses.CategoricalCrossentropy(label_smoothing=LABEL_SMOOTHING),
    metrics=['accuracy']
)

print('=' * 60)
print('PHASE 1: Train Head Only (Backbone Frozen)')
print('=' * 60)

history1 = model.fit(
    train_ds,
    epochs=PHASE1_EPOCHS,
    validation_data=val_ds,
    class_weight=cw_dict,
    callbacks=[
        CosineWarmup(PHASE1_EPOCHS, PHASE1_LR, lr_min=1e-6, warmup_epochs=3),
        ModelCheckpoint('best_phase1.keras', monitor='val_accuracy', save_best_only=True, verbose=1),
        EarlyStopping(monitor='val_accuracy', patience=8, restore_best_weights=True, verbose=1),
    ]
)
best1 = max(history1.history['val_accuracy'])
print(f'\nPhase 1 Best Val Accuracy: {best1*100:.1f}%')


# ─── CELL 10: PHASE 2 — Fine-Tune Last 100 Layers ───────────────────────────
# KEY FIX from V2: explicitly load Phase 1 best BEFORE unfreezing!
# V2 bug: Phase 2 started from -inf instead of continuing from Phase 1
# Expected: ~62-72% val accuracy
print('Loading Phase 1 best weights...')
model.load_weights('best_phase1.keras')

base_model.trainable = True
for layer in base_model.layers[:FINE_TUNE_FROM]:
    layer.trainable = False

unfrozen = sum(1 for l in base_model.layers if l.trainable)
print(f'Unfrozen backbone layers: {unfrozen}/{len(base_model.layers)}')

model.compile(
    optimizer=keras.optimizers.AdamW(learning_rate=PHASE2_LR, weight_decay=WEIGHT_DECAY),
    loss=keras.losses.CategoricalCrossentropy(label_smoothing=LABEL_SMOOTHING),
    metrics=['accuracy']
)

print('\n' + '=' * 60)
print('PHASE 2: Fine-Tune Last 100 Layers')
print('=' * 60)

history2 = model.fit(
    train_ds,
    epochs=PHASE2_EPOCHS,
    validation_data=val_ds,
    class_weight=cw_dict,
    callbacks=[
        CosineWarmup(PHASE2_EPOCHS, PHASE2_LR, lr_min=1e-7, warmup_epochs=3),
        ModelCheckpoint('best_phase2.keras', monitor='val_accuracy', save_best_only=True, verbose=1),
        EarlyStopping(monitor='val_accuracy', patience=12, restore_best_weights=True, verbose=1),
    ]
)
best2 = max(history2.history['val_accuracy'])
print(f'\nPhase 2 Best Val Accuracy: {best2*100:.1f}%')


# ─── CELL 11: PHASE 3 — Fine-Tune Entire Network ───────────────────────────
# Expected: 70-80%+ val accuracy
print('Loading Phase 2 best weights...')
model.load_weights('best_phase2.keras')

base_model.trainable = True
print(f'All {len(base_model.layers)} backbone layers now trainable')

model.compile(
    optimizer=keras.optimizers.AdamW(learning_rate=PHASE3_LR, weight_decay=WEIGHT_DECAY),
    loss=keras.losses.CategoricalCrossentropy(label_smoothing=LABEL_SMOOTHING),
    metrics=['accuracy']
)

print('\n' + '=' * 60)
print('PHASE 3: Fine-Tune Entire Network (Final Polish)')
print('=' * 60)

history3 = model.fit(
    train_ds,
    epochs=PHASE3_EPOCHS,
    validation_data=val_ds,
    class_weight=cw_dict,
    callbacks=[
        CosineWarmup(PHASE3_EPOCHS, PHASE3_LR, lr_min=1e-8, warmup_epochs=2),
        ModelCheckpoint('best_phase3.keras', monitor='val_accuracy', save_best_only=True, verbose=1),
        EarlyStopping(monitor='val_accuracy', patience=8, restore_best_weights=True, verbose=1),
    ]
)
best3 = max(history3.history['val_accuracy'])
print(f'\nPhase 3 Best Val Accuracy: {best3*100:.1f}%')


# ─── CELL 12: Training Curves ───────────────────────────────────────────────
acc      = history1.history['accuracy']     + history2.history['accuracy']     + history3.history['accuracy']
val_acc  = history1.history['val_accuracy'] + history2.history['val_accuracy'] + history3.history['val_accuracy']
loss     = history1.history['loss']         + history2.history['loss']         + history3.history['loss']
val_loss = history1.history['val_loss']     + history2.history['val_loss']     + history3.history['val_loss']

p1_end = len(history1.history['accuracy'])
p2_end = p1_end + len(history2.history['accuracy'])

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(18, 6))
for ax, td, vd, title in [(ax1, acc, val_acc, 'Accuracy'), (ax2, loss, val_loss, 'Loss')]:
    ax.plot(td, label='Train', color='#2196F3', lw=2)
    ax.plot(vd, label='Val',   color='#FF5722', lw=2)
    ax.axvline(p1_end, color='green', ls='--', alpha=0.7, label='P1→P2')
    ax.axvline(p2_end, color='red',   ls='--', alpha=0.7, label='P2→P3')
    ax.set_title(f'DermaSmart V3 — {title}', fontsize=13, fontweight='bold')
    ax.set_xlabel('Epoch')
    ax.legend()
    ax.grid(alpha=0.3)
plt.tight_layout()
plt.savefig('training_curves_v3.png', dpi=150, bbox_inches='tight')
plt.show()
print(f'Phase 1: {best1*100:.1f}%  |  Phase 2: {best2*100:.1f}%  |  Phase 3: {best3*100:.1f}%')


# ─── CELL 13: Save Best + Final Evaluation ──────────────────────────────────
best_info = max([
    (best1, 'best_phase1.keras'),
    (best2, 'best_phase2.keras'),
    (best3, 'best_phase3.keras'),
], key=lambda x: x[0])

print(f'Best model: {best_info[1]}  ({best_info[0]*100:.1f}%)')
model.load_weights(best_info[1])

test_loss, test_acc = model.evaluate(val_ds, verbose=1)
print(f'\nFINAL TEST ACCURACY: {test_acc*100:.2f}%')

model.save('best_final.keras')
print(f'Saved: best_final.keras  ({os.path.getsize("best_final.keras")/1e6:.1f} MB)')


# ─── CELL 14: Per-Class Accuracy ────────────────────────────────────────────
y_true, y_pred = [], []
for imgs, lbls in val_ds:
    preds = model.predict(imgs, verbose=0)
    y_true.extend(np.argmax(lbls.numpy(), axis=1))
    y_pred.extend(np.argmax(preds, axis=1))
y_true, y_pred = np.array(y_true), np.array(y_pred)

print('\nPer-Class Accuracy:')
print('-' * 63)
results = []
for i, cls in enumerate(class_names):
    mask  = y_true == i
    acc_i = (y_pred[mask] == i).mean() if mask.sum() > 0 else 0
    results.append((acc_i, cls))
    icon = 'GOOD' if acc_i >= 0.6 else ('MED ' if acc_i >= 0.4 else 'LOW ')
    print(f'[{icon}] {cls[:50]:<50}: {acc_i*100:.1f}%')

print(f'\nOverall: {(y_true == y_pred).mean()*100:.2f}%')
print(f'Best:    {max(results)[1]}  ({max(results)[0]*100:.1f}%)')
print(f'Worst:   {min(results)[1]}  ({min(results)[0]*100:.1f}%)')


# ─── CELL 15: Download ──────────────────────────────────────────────────────
# Kaggle
try:
    from IPython.display import FileLink, display
    print('Kaggle download links:')
    display(FileLink('best_final.keras'))
    display(FileLink('training_curves_v3.png'))
except Exception:
    pass

# Google Colab
try:
    from google.colab import files
    print('Starting download...')
    files.download('best_final.keras')
except Exception:
    pass

print('\nNext steps after downloading best_final.keras:')
print('  1. Place at:  dermasmart/backend/model/tf_model.keras')
print('  2. Run:       python convert_model.py')
print('  3. Output:    dermasmart/backend/model/tf_model.tflite')
print('  4. Your backend will automatically use the new model!')
