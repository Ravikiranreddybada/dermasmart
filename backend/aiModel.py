import tensorflow as tf
from PIL import Image
import os
import cv2
import numpy as np
import io

# Load Haarcascade for Face Detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

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


def skin_analysis(image_bytes: bytes) -> dict:
    """
    Run skin condition classification on uploaded image bytes.
    Returns {"condition": "<label>"} or {"error": "<message>"}
    """
    if tf_model is None:
        return {"error": "Model not loaded. Place tf_model.keras in backend/model/"}

    try:
        # Load image from bytes
        pil_image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        img = pil_image.resize((224, 224))
        img_numpy = np.array(img)
        
        # 1. Blank / Dark Photo check
        if np.var(img_numpy) < 150:
            return {"error": "The captured image appears to be blank or too dark. Please take a well-lit photo of your face."}

        # 2. Face Detection & Skin Color Segmentation
        frame = cv2.cvtColor(img_numpy, cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3, minSize=(30, 30))
        
        if len(faces) == 0:
            # Fallback to Skin Color Segmentation (HSV space)
            hsv = cv2.cvtColor(img_numpy, cv2.COLOR_RGB2HSV)
            # Define range for human skin tone
            lower_skin = np.array([0, 20, 70], dtype=np.uint8)
            upper_skin = np.array([20, 255, 255], dtype=np.uint8)
            mask = cv2.inRange(hsv, lower_skin, upper_skin)
            skin_percentage = (np.count_nonzero(mask) / mask.size) * 100
            
            if skin_percentage < 30.0:
                return {"error": "No face detected, and the image does not contain enough recognizable human skin. Please ensure your skin is clearly visible in the camera frame."}

        # 3. TensorFlow Classification & Confidence Thresholding
        img_array = tf.expand_dims(tf.keras.utils.img_to_array(img) / 255.0, axis=0)
        prediction = tf_model.predict(img_array)
        
        confidence = np.max(prediction[0])
        if confidence < 0.50:
            return {"error": f"Inconclusive result (Confidence: {confidence:.0%}). Unable to clearly identify a skin condition. Please take a clearer, closer photo of the skin."}
            
        condition = LABELS[np.argmax(prediction[0])]
        return {"condition": condition}

    except Exception as e:
        return {"error": str(e)}
