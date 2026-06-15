# Vault Express — Deployment Guide

## Prerequisites
- Node.js 20+
- npm 10+
- Git

## Step 1: Set up Supabase (Free)
1. Go to https://supabase.com → Create account → New Project
2. Copy your Project URL and anon key from Settings → API
3. Go to SQL Editor → paste contents of `lib/supabase-schema.sql` → Run
4. Enable Supabase Auth: Authentication → Settings → Enable email auth

## Step 2: Set up Cloudinary (Free) for image uploads
1. Go to https://cloudinary.com → Create account
2. Copy Cloud Name, API Key, API Secret from Dashboard

## Step 3: Configure environment variables
Edit `.env.local` with your real values:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourStrongPassword2026!
JWT_SECRET=YourSuperSecretJWTKey32CharsMinimum!
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## Step 4: Install & test locally
```bash
cd vault-express
npm install
npm run dev
# Visit http://localhost:3000
```

## Step 5: Deploy to Vercel (Free)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# Go to: vercel.com → your project → Settings → Environment Variables
# Add all variables from .env.local
```

## Admin Access
- URL: https://your-domain.vercel.app/admin/login
- This page is NEVER linked from the public site
- NO client can find it unless they know the URL
- Protected by JWT middleware on every admin route

## Custom Domain
```bash
vercel domains add yourdomain.com
```
Then update DNS at your domain registrar.

## Security Notes
- Admin panel is completely separate from client routes
- JWT token is httpOnly cookie (no JavaScript access)
- Middleware blocks ALL /admin/* routes without valid token
- Brute force delay on failed login attempts
- No admin link anywhere in the public site
