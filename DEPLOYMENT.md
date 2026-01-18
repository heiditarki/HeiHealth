# Deployment Guide

This guide covers deploying HeiHealth to Fly.io (backend) and Vercel (frontend).

## Prerequisites

1. **Fly.io Account**: Sign up at https://fly.io
2. **Vercel Account**: Sign up at https://vercel.com
3. **Fly CLI**: Install with `brew install flyctl` (macOS) or see https://fly.io/docs/hands-on/install-flyctl/
4. **Vercel CLI** (optional): `npm i -g vercel`

## Backend Deployment (Fly.io)

### 1. Login to Fly.io

```bash
flyctl auth login
```

### 2. Create the Fly.io App

First, create the app (this will register it with Fly.io):

```bash
flyctl apps create heihealth-backend
```

If the name `heihealth-backend` is already taken, choose a different name:
```bash
flyctl apps create your-unique-app-name
```
Then update `fly.toml` to match:
```toml
app = "your-unique-app-name"
```

### 3. Deploy the App

```bash
flyctl deploy
```

This will:
- Build your Docker image
- Deploy to Fly.io
- Use the configuration from `fly.toml`

### 3. Set Environment Variables

After deployment, set the frontend URL (you'll get this after deploying the frontend):

```bash
flyctl secrets set FRONTEND_URL=https://your-frontend-app.vercel.app
```

Or if you want to allow all origins during testing:

```bash
flyctl secrets set FRONTEND_URL="*"
```

### 4. Get Your Backend URL

After deployment, your backend will be available at:
```
https://heihealth-backend.fly.dev
```

(Replace `heihealth-backend` with your actual app name)

### 5. Verify Deployment

```bash
curl https://heihealth-backend.fly.dev/health
```

You should see: `{"status":"ok"}`

### 6. View Logs

```bash
flyctl logs
```

## Frontend Deployment (Vercel)

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure the project:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://heihealth-backend.fly.dev` (your Fly.io backend URL)

5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login:
```bash
vercel login
```

3. Navigate to frontend directory:
```bash
cd frontend
```

4. Deploy:
```bash
vercel
```

5. Set environment variable:
```bash
vercel env add VITE_API_URL
# Enter: https://heihealth-backend.fly.dev
```

6. Redeploy with the new environment variable:
```bash
vercel --prod
```

## Post-Deployment

### Update Backend CORS

After you have your Vercel frontend URL, update the backend CORS:

```bash
flyctl secrets set FRONTEND_URL=https://your-app.vercel.app
```

Then restart the backend:

```bash
flyctl apps restart heihealth-backend
```

### Update Frontend API URL

If you need to change the backend URL, update the environment variable in Vercel dashboard:
- Go to your project → Settings → Environment Variables
- Update `VITE_API_URL` to your new backend URL
- Redeploy

## Troubleshooting

### Backend Issues

**Port binding error**: Make sure `uvicorn` is listening on `0.0.0.0:8000` (already configured in `run.py`)

**CORS errors**: Check that `FRONTEND_URL` secret is set correctly in Fly.io

**View logs**: `flyctl logs`

### Frontend Issues

**API connection errors**: 
- Verify `VITE_API_URL` is set correctly in Vercel
- Check that the backend URL is accessible
- Ensure CORS is configured on the backend

**Build errors**: Check Vercel build logs in the dashboard

## Updating Deployments

### Backend Updates

```bash
flyctl deploy
```

### Frontend Updates

Vercel automatically deploys on git push to main branch, or manually:

```bash
cd frontend
vercel --prod
```

## Cost Considerations

- **Fly.io**: Free tier includes 3 shared-cpu-1x VMs with 256MB RAM (suitable for this app)
- **Vercel**: Free tier includes generous bandwidth and build minutes

Both platforms offer free tiers that should be sufficient for development and testing.
