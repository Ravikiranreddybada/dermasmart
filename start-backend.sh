#!/bin/bash
echo "🚀 Starting DermaSmart Backend..."
cd backend

if [ ! -d "venv" ]; then
  echo "📦 Creating virtual environment..."
  python3 -m venv venv
fi

source venv/bin/activate

echo "📦 Installing dependencies..."
pip install -r requirements.txt -q

if [ ! -f ".env" ]; then
  echo "⚠️  No .env file found! Copying from .env.example..."
  cp .env.example .env
  echo "👉 Please edit backend/.env with your MongoDB URI and Gemini API key, then run again."
  exit 1
fi

echo "✅ Starting FastAPI on http://localhost:8000"
uvicorn main:app --reload --host 0.0.0.0 --port 8000
