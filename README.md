# DermaSmart

> AI-powered skin analysis and personalised skincare recommendation platform.

DermaSmart captures a photo of your skin, classifies the condition using a custom TensorFlow model trained on 23 dermatological categories, and returns a full report — morning/evening routine, diet recommendations, and curated product suggestions — powered by Google Gemini.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool / dev server |
| Electron | Optional desktop app wrapper |
| Tailwind CSS + Framer Motion | Styling and animations |
| Radix UI / shadcn/ui | Accessible UI components |
| Auth0 | Authentication (optional) |
| React Router v6 | Client-side routing |
| react-webcam | Camera capture |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI + Python 3.9+ | REST API |
| TensorFlow / Keras | Skin condition classifier (23 classes) |
| Google Gemini 1.5 Flash | Personalised skincare advice (LLM) |
| MongoDB Atlas + Motor | Async cloud database |
| Pillow | Image processing |
| Uvicorn | ASGI server |


---

## Quick Start

### 1. Backend

```bash
# Option A — use the start script
./start-backend.sh

# Option B — manual
cd backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env — fill in MONGO_URI and GEMINI_API_KEY

uvicorn main:app --reload --port 8000
```

Check it's running: open **http://localhost:8000** — should show `{"message": "DermaSmart API is running 🚀"}`

### 2. Frontend

```bash
# Option A — use the start script
./start-frontend.sh

# Option B — manual
cd frontend
npm install
cp .env.example .env
# Edit .env — add Auth0 credentials (or leave blank to skip login)

npm run dev:web
```

Open **http://localhost:5173**

---

## Environment Variables

### `backend/.env`
```env
MONGO_URI=mongodb+srv://ravi:<password>@cluster0.fcukcnh.mongodb.net/?appName=Cluster0
MONGO_DB_NAME=dermasmart
GEMINI_API_KEY=your_gemini_api_key
```

### `frontend/.env`
```env
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id
```
> Leave Auth0 vars blank to skip login and go straight to the camera.

---

## AI Model

Place your trained Keras model at:
```
backend/model/tf_model.keras
```

The model classifies skin images into 23 categories including Acne, Eczema, Melanoma, Psoriasis, and more. Training notebook is in `model/DermaSmart_Model.ipynb`.

> Without the model file, the backend still runs — skin_condition will return `"Unknown"` and Gemini will still generate a general skincare report.

---

## API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/userInfo` | Main endpoint — upload image, get full report |
| `POST` | `/api/users/` | Create user |
| `GET` | `/api/users/email/{email}` | Get user by email |
| `GET` | `/api/analyses/user/{email}` | Get analysis history |

Interactive docs: **http://localhost:8000/docs**

---

## How It Works

```
User captures photo
        ↓
FormPage collects skin type answers
        ↓
POST /userInfo (image + skin_type + age)
        ↓
TensorFlow model → skin condition label
        ↓
Gemini 1.5 Flash → full skincare report (JSON)
        ↓
Saved to MongoDB
        ↓
SkincareAnalysisDashboard renders report
```

---

> Built by [Ravi Kiran Reddy Bada](https://github.com/Ravikiranreddybada)
