# DermaSmart Backend

FastAPI backend serving the skin analysis API.

## Quick Start

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # fill in your credentials
uvicorn main:app --reload
```

## Model Setup

Place the trained Keras model at:
```
backend/model/tf_model.keras
```

The model file is not included in the repo due to size. Download it separately or train using `model/DermaSmart_Model.ipynb`.
