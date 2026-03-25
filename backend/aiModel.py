import tensorflow as tf
from PIL import Image
import os

LABELS = [
    'Acne and Rosacea',
    'Actinic Keratosis Basal Cell Carcinoma and other Malignant Lesions',
    'Atopic Dermatitis',
    'Bullous Disease',
    'Cellulitis Impetigo and other Bacterial Infections',
    'Eczema',
    'Exanthems and Drug Eruptions',
    'Hair Loss Alopecia and other Hair Diseases',
    'Herpes HPV and other STDs',
    'Light Diseases and Disorders of Pigmentation',
    'Lupus and other Connective Tissue Diseases',
    'Melanoma Skin Cancer Nevi and Moles',
    'Nail Fungus and other Nail Disease',
    'Poison Ivy and other Contact Dermatitis',
    'Psoriasis Lichen Planus and related diseases',
    'Scabies Lyme Disease and other Infestations and Bites',
    'Seborrheic Keratoses and other Benign Tumors',
    'Systemic Disease',
    'Tinea Ringworm Candidiasis and other Fungal Infections',
    'Urticaria Hives',
    'Vascular Tumors',
    'Vasculitis',
    'Warts Molluscum and other Viral Infections'
]

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "tf_model.keras")

# Load model once at startup
try:
    tf_model = tf.keras.models.load_model(MODEL_PATH)
    print("✅ TensorFlow model loaded successfully.")
except Exception as e:
    tf_model = None
    print(f"⚠️  Could not load TF model: {e}")


def skin_analysis(filename: str) -> dict:
    """
    Run skin condition classification on an uploaded image.
    Returns {"condition": "<label>"} or {"error": "<message>"}
    """
    if tf_model is None:
        return {"error": "Model not loaded. Place tf_model.keras in backend/model/"}

    image_path = os.path.join("uploads", filename)

    try:
        img = Image.open(image_path).convert("RGB").resize((224, 224))
        img_array = tf.expand_dims(tf.keras.utils.img_to_array(img) / 255.0, axis=0)
        prediction = tf_model.predict(img_array)
        condition = LABELS[prediction.argmax()]
        return {"condition": condition}

    except FileNotFoundError:
        return {"error": f"Image not found: {image_path}"}
    except Exception as e:
        return {"error": str(e)}
