# Deployment Guide

## Backend (Fly.io)

```bash
# Login
flyctl auth login

# Create app (if first time)
flyctl apps create heihealth-backend

# Deploy
flyctl deploy

# Set CORS (after frontend is deployed)
flyctl secrets set FRONTEND_URL=https://your-app.vercel.app
```

Backend URL: `https://heihealth-backend.fly.dev`

## Frontend (Vercel)

1. Go to https://vercel.com/new
2. Import GitHub repository
3. Settings:
   - Root Directory: `frontend`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variable:
   - Name: `VITE_API_URL`
   - Value: `https://heihealth-backend.fly.dev`
5. Deploy

## Updates

- Backend: `flyctl deploy`
- Frontend: Auto-deploys on git push, or `vercel --prod` in `frontend/`
  directory
