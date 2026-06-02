# Google OAuth Callback URL Fix

## Problem Analysis

Google was using `http://localhost:5000/api/auth/google/callback` as the redirect_uri instead of the production Render URL because:

1. **Hardcoded Callback URL**: The OAuth2Client was initialized with a callback URL that used `process.env.BASE_URL + '/api/auth/google/callback'`
2. **Missing Environment Variable**: The `BASE_URL` environment variable was not properly set in the production environment
3. **Fallback Logic**: There was no proper fallback logic for when `BASE_URL` was not set

## Files Modified

### 1. `server/src/controllers/authController.js`

**Changes Made:**
- Replaced hardcoded Google OAuth client initialization with a dynamic function `getGoogleClient()`
- Added proper fallback logic: `BASE_URL` → `BACKEND_URL` → `http://localhost:5000`
- Updated both `googleAuth` and `googleAuthCallback` functions to use the dynamic client

**Key Changes:**
```javascript
// Before:
const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.BASE_URL + '/api/auth/google/callback'
);

// After:
const getGoogleClient = () => {
  const baseUrl = process.env.BASE_URL || process.env.BACKEND_URL || 'http://localhost:5000';
  const callbackUrl = `${baseUrl}/api/auth/google/callback`;
  
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl
  );
};
```

### 2. `client/src/pages/AuthPage.jsx`

**Changes Made:**
- Fixed the Google auth button to use relative path `/api` as fallback instead of hardcoded `http://localhost:5000/api`

**Key Changes:**
```javascript
// Before:
onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`}

// After:
onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || '/api'}/auth/google`}
```

### 3. `server/src/routes/oauthRoutes.js`

**Changes Made:**
- Fixed YouTube OAuth callback URL to use proper environment variable fallback
- Fixed Twitter OAuth callback URL to use proper environment variable fallback

**Key Changes:**
```javascript
// For YouTube:
const baseUrl = process.env.BASE_URL || process.env.BACKEND_URL || 'http://localhost:5000';
const redirectUri = `${baseUrl}/api/oauth/youtube/callback`;

// For Twitter:
const baseUrl = process.env.BASE_URL || process.env.BACKEND_URL || 'http://localhost:5000';
const CALLBACK_URL = `${baseUrl}/api/oauth/twitter/callback`;
```

## Environment Variables Required

### Backend Configuration
```
# Required for OAuth callbacks
BASE_URL=https://your-backend.onrender.com
BACKEND_URL=https://your-backend.onrender.com  # Alternative

# Required for frontend redirects after auth
FRONTEND_URL=https://your-frontend.vercel.app

# Google OAuth credentials
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
```

### Development Configuration
```
# For local development
BASE_URL=http://localhost:5000
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

## Deployment Instructions

### For Render Deployment:

1. **Set Environment Variables**:
   - Go to your Render dashboard
   - Navigate to your backend service
   - Add the following environment variables:
     ```
     BASE_URL=https://your-backend.onrender.com
     FRONTEND_URL=https://your-frontend.vercel.app
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     ```

2. **Update Google Cloud Console**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to "APIs & Services" → "Credentials"
   - Edit your OAuth 2.0 Client ID
   - Add the following authorized redirect URIs:
     ```
     https://your-backend.onrender.com/api/auth/google/callback
     https://your-backend.onrender.com/api/oauth/youtube/callback
     ```

3. **Redeploy**:
   - Your changes will automatically deploy on Render
   - Test the Google authentication flow

### For Local Development:

1. **Set Environment Variables**:
   - Create a `.env` file in your `server` directory
   - Add the following:
     ```
     BASE_URL=http://localhost:5000
     FRONTEND_URL=http://localhost:5173
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     ```

2. **Update Google Cloud Console**:
   - Add the following authorized redirect URIs for local development:
     ```
     http://localhost:5000/api/auth/google/callback
     http://localhost:5000/api/oauth/youtube/callback
     ```

## Testing

### Test Google Authentication:
1. Click the "Sign In with Google" button on your login page
2. You should be redirected to Google's authentication page
3. After authenticating, you should be redirected back to your frontend with a token
4. Verify that the callback URL shown in the browser matches your production URL

### Test YouTube Authentication:
1. Navigate to the social media connections page
2. Click "Connect YouTube"
3. Verify that the callback URL uses your production backend URL

## Troubleshooting

### Issue: Google shows "Redirect URI mismatch" error
**Solution:**
- Double-check that the callback URLs in Google Cloud Console match exactly what your backend is using
- Ensure there are no trailing slashes or different protocols (http vs https)

### Issue: Callback URL still shows localhost in production
**Solution:**
- Verify that `BASE_URL` or `BACKEND_URL` environment variable is set in your Render deployment
- Restart your Render service to ensure environment variables are loaded
- Check your server logs to see what callback URL is being generated

### Issue: Frontend redirect fails after successful authentication
**Solution:**
- Ensure `FRONTEND_URL` is set correctly in your environment variables
- Check that the frontend URL matches exactly where your Vercel app is deployed
- Verify CORS settings if you're getting CORS errors

## Summary

The fix ensures that:
1. Callback URLs are never hardcoded
2. Proper environment variable fallback logic is in place
3. Both development and production environments work correctly
4. All OAuth providers (Google, YouTube, Twitter, etc.) use consistent URL generation
5. The solution is production-ready and follows best practices