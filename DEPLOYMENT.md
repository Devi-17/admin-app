# Deployment Guide

## Prerequisites

1. Firebase CLI installed: `npm install -g firebase-tools`
2. Firebase account with access to create new projects
3. Service account key for existing Firestore database

## Step 1: Create New Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it (e.g., "andnuts-admin")
4. Enable Google Analytics (optional)
5. Create project

## Step 2: Enable Firebase Services

### Authentication
1. Go to Authentication > Sign-in method
2. Enable Email/Password
3. Enable Google (optional)

### Cloud Messaging (FCM)
1. Go to Project Settings > Cloud Messaging
2. Generate Web Push certificates or use existing
3. Copy the VAPID key

### Hosting
1. Go to Hosting
2. Click "Get started"
3. Follow setup instructions

## Step 3: Get Service Account Key

1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely
4. Extract the following values:
   - `project_id`
   - `private_key`
   - `client_email`

## Step 4: Configure Environment Variables

Create `.env.local` file in the project root:

```bash
# New Firebase Project (Admin App)
NEXT_PUBLIC_FIREBASE_ADMIN_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_ADMIN_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_ADMIN_PROJECT_ID=your-admin-project-id
NEXT_PUBLIC_FIREBASE_ADMIN_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_ADMIN_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_ADMIN_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_ADMIN_MEASUREMENT_ID=your-measurement-id

# Existing Firestore Database (Service Account)
FIREBASE_SERVICE_ACCOUNT_PROJECT_ID=existing-project-id
FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com

# FCM Configuration
NEXT_PUBLIC_FCM_VAPID_KEY=your-vapid-key
FCM_SERVER_KEY=your-server-key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-admin-domain.com
ADMIN_APP_SECRET_KEY=generate-random-secret-key
```

## Step 5: Create Admin Users

1. Go to Authentication > Users
2. Add user with email/password
3. Go to Firestore and create document in `adminUsers` collection:

```json
{
  "email": "admin@example.com",
  "role": "admin",
  "permissions": [],
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## Step 6: Build and Deploy

```bash
# Build the application
npm run build

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Deploy
firebase deploy --only hosting
```

## Step 7: Configure Custom Domain (Optional)

1. Go to Hosting > Add custom domain
2. Follow DNS configuration instructions
3. Wait for SSL certificate provisioning

## Step 8: Set Up Firestore Rules

The admin app uses Firestore rules for its own collections. Update `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /adminUsers/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /notificationSubscriptions/{subscriptionId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

## Security Checklist

- [ ] All environment variables set
- [ ] Service account key has proper permissions
- [ ] Firestore rules deployed
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Audit logging enabled
- [ ] Admin users created
- [ ] FCM configured
- [ ] Custom domain configured (if applicable)

## Monitoring

- Set up Firebase Performance Monitoring
- Configure error tracking
- Monitor API usage and rate limits
- Review audit logs regularly

## Troubleshooting

### Authentication Issues
- Verify Firebase Auth is enabled
- Check admin user exists in Firestore
- Verify custom token creation

### Firestore Connection Issues
- Verify service account credentials
- Check service account has Firestore permissions
- Verify project ID matches

### Push Notification Issues
- Verify FCM is enabled
- Check VAPID key is correct
- Verify service worker is registered

## Support

For issues or questions, contact the development team.

