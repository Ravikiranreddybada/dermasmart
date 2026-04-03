#!/bin/bash
echo "🚀 Starting DermaSmart Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
  echo "📦 Installing npm packages..."
  npm install
fi

if [ ! -f ".env" ]; then
  echo "⚠️  No .env file found creating empty one"
  touch .env
fi

echo "✅ Starting Vite dev server on http://localhost:5173"
npm run dev
