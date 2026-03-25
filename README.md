# DermaSmart

> AI-powered skin analysis and personalised skincare recommendation platform.

DermaSmart lets users capture a photo of their skin through a webcam or mobile camera, analyses it using a custom-trained TensorFlow model and Google Gemini, and returns a detailed dermatological report — including a morning/evening skincare routine, diet recommendations, and curated product suggestions.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [AI Model](#ai-model)
- [API Reference](#api-reference)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

---

## Overview

DermaSmart is a full-stack desktop and web application that bridges the gap between AI diagnostics and personalised skincare. Users fill in a brief form (name, age, skin type), capture a live photo, and receive an instant AI-generated skin report powered by:

- A **custom TensorFlow CNN** trained on 23 dermatological condition classes
- **Google Gemini 1.5 Flash** for natural-language skincare advice, routine building, and product recommendations

The frontend is built as both a **web app** and an **Electron desktop app** using the same React codebase.

---

## Features

- 📸 **Live camera capture** — real-time webcam integration via `react-webcam`
- 🧠 **CNN skin condition classification** — 23 dermatological categories (acne, eczema, melanoma, psoriasis, and more)
- 💬 **Gemini-powered skincare advice** — personalised morning/evening routine, diet tips, and product suggestions returned as structured JSON
- 🔐 **Auth0 authentication** — secure user login and session management
- 🗄️ **Persistent user history** — skin analyses stored per user in a MySQL database
- 🖥️ **Dual deployment** — runs as a browser web app or a native Electron desktop app
- 📊 **Skincare dashboard** — tabbed report UI with overview, routine, diet, and product tabs
- 🎨 **Premium UI** — animated gradients, Framer Motion transitions, Radix UI primitives, and Tailwind CSS

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [Electron](https://www.electronjs.org/) | Desktop app wrapper |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://www.framer-motion.com/) | Animations and transitions |
| [Radix UI](https://www.radix-ui.com/) | Accessible headless UI primitives (Tabs, ScrollArea) |
| [shadcn/ui](https://ui.shadcn.com/) | Pre-built component layer on Radix |
| [Auth0](https://auth0.com/) | Authentication and authorisation |
| [React Router v6](https://reactrouter.com/) | Client-side routing |
| [Axios](https://axios-http.com/) | HTTP client |
| [react-webcam](https://github.com/mozmorris/react-webcam) | Camera capture |
| [Lucide React](https://lucide.dev/) | Icon library |

### Backend

| Technology | Purpose |
|---|---|
| [FastAPI](https://fastapi.tiangolo.com/) | REST API framework |
| [Python 3.9+](https://www.python.org/) | Runtime |
| [TensorFlow / Keras](https://www.tensorflow.org/) | Skin condition classification model |
| [Google Gemini 1.5 Flash](https://ai.google.dev/) | LLM for skincare advice generation |
| [SQLAlchemy](https://www.sqlalchemy.org/) | ORM |
| [MySQL / PyMySQL](https://pymysql.readthedocs.io/) | Relational database |
| [Pillow](https://pillow.readthedocs.io/) | Image processing |
| [Pydantic](https://docs.pydantic.dev/) | Request/response validation |
| [python-dotenv](https://pypi.org/project/python-dotenv/) | Environment variable management |
| [Uvicorn](https://www.uvicorn.org/) | ASGI server |

### AI / ML

| Component | Detail |
|---|---|
| **Classification Model** | Custom CNN trained on 23 skin condition classes from the ISIC dataset |
| **LLM** | Google Gemini 1.5 Flash via `google-generativeai` SDK |
| **Training Notebook** | `model/DermaSmart_Model.ipynb` |

---

## Project Structure

```
dermasmart/
├── frontend/                   # React + Electron application
│   ├── electron/               # Electron main process and preload scripts
│   │   ├── main.ts
│   │   └── preload.ts
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── auth/               # Auth0 provider wrapper
│   │   ├── assets/             # JSON data, SVGs
│   │   ├── Components/         # All UI components
│   │   │   ├── ui/             # Base UI primitives (shadcn/ui)
│   │   │   ├── CameraPage.tsx
│   │   │   ├── FormPage.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── SkincareAnalysisDashboard.tsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   └── utils.ts        # Tailwind class merging utility
│   │   ├── types/              # TypeScript type declarations
│   │   ├── App.tsx             # Root app and routing
│   │   ├── config.ts           # API base URL config
│   │   └── environment.ts      # Electron/web environment detection
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.example
│
├── backend/                    # FastAPI Python backend
│   ├── routes/
│   │   ├── user.py             # User CRUD endpoints
│   │   └── skin_analysis.py    # Skin analysis CRUD endpoints
│   ├── uploads/                # Uploaded images (git-ignored)
│   ├── model/                  # TF model weights (git-ignored)
│   ├── main.py                 # App entrypoint, route registration
│   ├── database.py             # SQLAlchemy engine and session
│   ├── models.py               # ORM table definitions
│   ├── schemas.py              # Pydantic schemas
│   ├── aiModel.py              # TensorFlow inference logic
│   ├── gemini.py               # Gemini API integration
│   ├── requirements.txt
│   └── .env.example
│
├── model/                      # AI model training artifacts
│   └── DermaSmart_Model.ipynb  # Training notebook
│
├── Dermafyr.png                # App logo
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.9+
- **MySQL** database (local or cloud — [Aiven](https://aiven.io/) recommended)
- **Google Gemini API key** — [Get one here](https://ai.google.dev/)
- **Auth0 account** — [Sign up here](https://auth0.com/)

---

### Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your DB credentials and Gemini API key

# Place your trained model weights
# Path expected: backend/model/tf_model.keras

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.  
Interactive docs: `http://localhost:8000/docs`

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your Auth0 credentials

# Run as a web app
npm run dev:web

# OR run as an Electron desktop app
npm run dev:electron
```

The web app runs at `http://localhost:5173` by default.

---

## Environment Variables

### `frontend/.env`

| Variable | Description |
|---|---|
| `VITE_AUTH0_CLIENT_ID` | Auth0 application client ID |
| `VITE_AUTH0_DOMAIN` | Auth0 tenant domain (e.g. `dev-xxx.us.auth0.com`) |
| `AUTH0_SECRET` | 32-byte random secret for session encryption |
| `AUTH0_BASE_URL` | Base URL of the frontend app |
| `AUTH0_ISSUER_BASE_URL` | Full Auth0 issuer URL |
| `AUTH0_CLIENT_SECRET` | Auth0 application client secret |

### `backend/.env`

| Variable | Description |
|---|---|
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port (default `3306`) |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name |
| `GEMINI_API_KEY` | Google Gemini API key |

---

## AI Model

The skin condition classifier is a convolutional neural network trained to classify images into **23 dermatological categories**:

| Category |
|---|
| Acne and Rosacea |
| Actinic Keratosis / Basal Cell Carcinoma |
| Atopic Dermatitis |
| Bullous Disease |
| Cellulitis / Impetigo / Bacterial Infections |
| Eczema |
| Exanthems and Drug Eruptions |
| Hair Loss / Alopecia |
| Herpes / HPV / STDs |
| Light Diseases / Pigmentation Disorders |
| Lupus / Connective Tissue Diseases |
| Melanoma / Nevi / Moles |
| Nail Fungus / Nail Disease |
| Poison Ivy / Contact Dermatitis |
| Psoriasis / Lichen Planus |
| Scabies / Lyme Disease / Infestations |
| Seborrheic Keratoses / Benign Tumors |
| Systemic Disease |
| Tinea / Candidiasis / Fungal Infections |
| Urticaria / Hives |
| Vascular Tumors |
| Vasculitis |
| Warts / Molluscum / Viral Infections |

Training code and architecture details are in `model/DermaSmart_Model.ipynb`.

The trained model weights (`tf_model.keras`) should be placed at `backend/model/tf_model.keras`.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/userInfo` | Upload image + user data, run skin analysis |
| `POST` | `/api/users/` | Create a new user |
| `GET` | `/api/users/{user_id}` | Get user by ID |
| `GET` | `/api/users/email/{email}` | Get user by email |
| `POST` | `/api/skin_analysis/` | Save a skin analysis record |
| `GET` | `/api/skin_analysis/{analysis_id}` | Get skin analysis by ID |

Full interactive API documentation is available at `/docs` when the backend is running.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please make sure to copy `.env.example` to `.env` and never commit real credentials.

---

> Built with ❤️ for smarter skincare.
