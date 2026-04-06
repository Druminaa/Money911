# Google OAuth Setup Guide

## Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://localhost:5173`
   - Add Authorized redirect URIs:
     - `http://localhost:3000`
     - `http://localhost:5173`
   - Click "Create"
   - Copy your **Client ID** and **Client Secret**

## Step 2: Configure Backend

1. Open `backend/.env`
2. Replace the placeholder values:

```env
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback
```

## Step 3: Configure Frontend

1. Open `frontend/.env.local`
2. Replace the placeholder value:

```env
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
```

## Step 4: Install Dependencies

### Backend:
```bash
cd backend
source venv/bin/activate
pip install httpx authlib
```

### Frontend:
```bash
cd frontend
npm install
```

## Step 5: Run the Application

### Start Backend:
```bash
cd backend
source venv/bin/activate
python main.py
```

### Start Frontend:
```bash
cd frontend
npm run dev
```

## Step 6: Test Google Login

1. Go to `http://localhost:3000/auth`
2. Click the "Google" button
3. Sign in with your Google account
4. You should be redirected to the dashboard

## How It Works

1. **User clicks "Google" button** → Frontend initiates Google OAuth flow
2. **User signs in with Google** → Google returns an access token
3. **Frontend sends token to backend** → Backend verifies token with Google
4. **Backend creates/finds user** → Returns JWT token
5. **User is logged in** → Redirected to dashboard

## Features

- ✅ Sign in with Google
- ✅ Auto-create account if user doesn't exist
- ✅ No password required for Google users
- ✅ Secure token verification
- ✅ Same JWT authentication as regular login

## Troubleshooting

### "Invalid Google token" error:
- Make sure your Google Client ID matches in both frontend and backend
- Check that the token hasn't expired

### "Invalid token audience" error:
- Verify the GOOGLE_CLIENT_ID in backend/.env matches your Google Cloud Console

### Google button doesn't work:
- Check browser console for errors
- Make sure you installed `@react-oauth/google` package
- Verify VITE_GOOGLE_CLIENT_ID is set in frontend/.env.local

## Security Notes

- Never commit your `.env` files to Git
- Keep your Client Secret secure
- Use HTTPS in production
- Validate tokens on the backend
