#!/bin/bash

# HeiHealth Deployment Script
# This script helps deploy the backend to Fly.io and provides instructions for Vercel

set -e

echo "🚀 HeiHealth Deployment Helper"
echo "================================"
echo ""

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ Fly CLI not found. Install it with: brew install flyctl"
    exit 1
fi

# Check if logged in to Fly.io
if ! flyctl auth whoami &> /dev/null; then
    echo "⚠️  Not logged in to Fly.io. Please run: flyctl auth login"
    exit 1
fi

echo "✅ Fly CLI is installed and you're logged in"
echo ""

# Check if app exists, create if not
APP_NAME=$(grep '^app =' fly.toml | sed 's/app = "\(.*\)"/\1/')
if ! flyctl apps list | grep -q "$APP_NAME"; then
    echo "📝 App '$APP_NAME' not found. Creating it..."
    flyctl apps create "$APP_NAME"
    echo ""
fi

# Deploy backend
echo "📦 Deploying backend to Fly.io..."
echo ""

flyctl deploy

echo ""
echo "✅ Backend deployed!"
echo ""

# Get the app URL
APP_NAME=$(grep '^app =' fly.toml | sed 's/app = "\(.*\)"/\1/')
BACKEND_URL="https://${APP_NAME}.fly.dev"

echo "🌐 Backend URL: ${BACKEND_URL}"
echo ""

# Test the backend
echo "🧪 Testing backend health endpoint..."
if curl -f "${BACKEND_URL}/health" &> /dev/null; then
    echo "✅ Backend is responding!"
else
    echo "⚠️  Backend health check failed. Check logs with: flyctl logs"
fi

echo ""
echo "📝 Next steps for frontend deployment:"
echo "====================================="
echo ""
echo "1. Go to https://vercel.com/new"
echo "2. Import your GitHub repository"
echo "3. Configure:"
echo "   - Root Directory: frontend"
echo "   - Framework Preset: Vite"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist"
echo ""
echo "4. Add Environment Variable:"
echo "   - Name: VITE_API_URL"
echo "   - Value: ${BACKEND_URL}"
echo ""
echo "5. After Vercel deployment, update backend CORS:"
echo "   flyctl secrets set FRONTEND_URL=https://your-frontend-app.vercel.app"
echo "   flyctl apps restart ${APP_NAME}"
echo ""
echo "✨ Done! Check DEPLOYMENT.md for detailed instructions."
