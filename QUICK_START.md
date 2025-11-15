# Quick Start Guide - Admin App

## Prerequisites

- Node.js 18+ installed
- Firebase account
- Access to existing Firestore database (andnuts-next project)

## Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
cd /home/heresy/myrepos/admin-app
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your Firebase credentials
```

### 3. Run Setup Script

```bash
./setup-and-deploy.sh
```

The script will:
- Install dependencies
- Check Firebase CLI
- Build the application
- Guide you through deployment

### 4. Manual Steps Required

After running the script, you need to:

1. **Create Firebase Project** (if not exists):
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create new project: `andnuts-admin`
   - Enable Authentication, FCM, Hosting

2. **Get Service Account Key**:
   - Go to existing project (`andnuts-next`)
   - Project Settings > Service Accounts
   - Generate new private key
   - Add to `.env.local`

3. **Create Admin User**:
   - Firebase Auth: Add user
   - Firestore: Create `adminUsers` collection
   - Add document with user's UID and role: "admin"

4. **Deploy**:
   ```bash
   firebase deploy
   ```

## Testing

1. Open `http://localhost:3000` (dev) or your deployed URL
2. Login with admin credentials
3. Test all features

## Documentation

- **Complete Documentation**: `ADMIN_APP_COMPLETE_DOCUMENTATION.md`
- **Deployment Guide**: `DEPLOYMENT_PROMPT.md`
- **README**: `README.md`

## Support

See `ADMIN_APP_COMPLETE_DOCUMENTATION.md` for troubleshooting.

