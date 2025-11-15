# Complete Setup & Deployment Prompt

Copy and use this prompt to finish and deploy the admin application:

---

## PROMPT TO COMPLETE AND DEPLOY ADMIN APP

```
I have a complete Next.js 14 admin application for an e-commerce platform located at /home/heresy/myrepos/admin-app. The application is fully implemented with all features but needs to be configured and deployed.

Please complete the following tasks in order:

### PHASE 1: VERIFICATION AND SETUP

1. **Verify Application Structure**
   - Check all files exist in /home/heresy/myrepos/admin-app
   - Verify package.json has all dependencies
   - Ensure TypeScript configuration is correct
   - Check all API routes are properly structured
   - Verify components are in place

2. **Install Dependencies**
   - Run `npm install` in /home/heresy/myrepos/admin-app
   - Verify all packages install successfully
   - Check for any dependency conflicts

3. **Create Environment File**
   - Copy .env.example to .env.local
   - Document which values need to be filled
   - Create a checklist of required Firebase credentials

### PHASE 2: FIREBASE CONFIGURATION

4. **Create New Firebase Project for Admin App**
   - Project name: "andnuts-admin" (or verify if exists)
   - Enable Authentication (Email/Password and Google)
   - Enable Cloud Messaging (FCM)
   - Generate Web Push certificates and VAPID key
   - Enable Firebase Hosting
   - Enable Firestore (for admin users collection)
   - Copy all configuration values to .env.local

5. **Configure Existing Firestore Database Access**
   - Go to existing Firebase project (andnuts-next)
   - Generate service account key
   - Verify service account has Firestore read/write permissions
   - Extract project_id, private_key, and client_email
   - Add to .env.local as FIREBASE_SERVICE_ACCOUNT_* variables

6. **Initialize Firebase CLI**
   - Run `firebase login` if not already logged in
   - Run `firebase init` in admin-app directory
   - Select: Hosting, Firestore
   - Choose the new Firebase project (andnuts-admin)
   - Configure hosting public directory as "out"
   - Configure Firestore rules file

### PHASE 3: ADMIN USER SETUP

7. **Create Admin Users**
   - In Firebase Authentication (new project), create user:
     - Email: admin@andnuts.com
     - Password: [secure password]
     - Copy the User UID
   - In Firestore (new project), create collection "adminUsers"
   - Create document with User UID as document ID
   - Add fields:
     {
       "email": "admin@andnuts.com",
       "displayName": "Admin User",
       "role": "admin",
       "permissions": [],
       "isActive": true,
       "createdAt": "2024-01-01T00:00:00Z",
       "updatedAt": "2024-01-01T00:00:00Z"
     }

### PHASE 4: BUILD AND TEST

8. **Build Application**
   - Run `npm run build` in admin-app directory
   - Fix any TypeScript errors
   - Fix any build errors
   - Verify build completes successfully
   - Check .next directory is created

9. **Test Locally**
   - Run `npm run dev`
   - Open http://localhost:3000
   - Test login with admin credentials
   - Verify dashboard loads
   - Test navigation between pages
   - Check API endpoints respond correctly

### PHASE 5: DEPLOYMENT

10. **Deploy Firestore Rules**
    - Run `firebase deploy --only firestore:rules`
    - Verify rules deploy successfully
    - Check Firebase Console to confirm

11. **Deploy to Firebase Hosting**
    - Ensure .env.local has all production values
    - Run `npm run build` to create production build
    - Run `firebase deploy --only hosting`
    - Verify deployment succeeds
    - Get the hosting URL from Firebase Console

12. **Configure Custom Domain (Optional)**
    - Go to Firebase Hosting > Add custom domain
    - Enter: admin.andnuts.store
    - Follow DNS configuration instructions
    - Wait for SSL certificate (up to 24 hours)

13. **Set Environment Variables in Production**
    - Go to Firebase Console > Hosting > Your site
    - Add environment variables (if supported)
    - Or configure in hosting platform settings
    - Verify all variables are set correctly

### PHASE 6: POST-DEPLOYMENT VERIFICATION

14. **Test Deployed Application**
    - Access deployed URL
    - Test login functionality
    - Verify order management works
    - Test product management
    - Check customer management
    - Verify analytics dashboard loads
    - Test inventory management
    - Check coupon management
    - Test push notifications (if configured)

15. **Security Verification**
    - Verify HTTPS is enabled
    - Check security headers are present
    - Test rate limiting works
    - Verify authentication is required for all routes
    - Check audit logs are being created

### PHASE 7: DOCUMENTATION

16. **Update Documentation**
    - Verify ADMIN_APP_COMPLETE_DOCUMENTATION.md is accurate
    - Update DEPLOYMENT_PROMPT.md with any issues found
    - Document any custom configurations
    - Create troubleshooting notes for common issues

### FINAL CHECKLIST

Before considering deployment complete, verify:
- [ ] All environment variables are set correctly
- [ ] Firebase projects are configured
- [ ] Service account has proper permissions
- [ ] Admin users are created
- [ ] Firestore rules are deployed
- [ ] Application builds without errors
- [ ] Application deploys successfully
- [ ] All features work in production
- [ ] Security measures are active
- [ ] Documentation is complete

Please proceed step by step, report progress at each phase, and document any issues or missing configurations encountered.
```

---

## QUICK COMMANDS REFERENCE

```bash
# Navigate to admin app
cd /home/heresy/myrepos/admin-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your values

# Run setup script
./setup-and-deploy.sh

# Or manual steps:
npm run build
firebase login
firebase init
firebase deploy --only firestore:rules
firebase deploy --only hosting
```

---

## ENVIRONMENT VARIABLES CHECKLIST

Before deployment, ensure these are configured:

### New Firebase Project (Admin App)
- [ ] NEXT_PUBLIC_FIREBASE_ADMIN_API_KEY
- [ ] NEXT_PUBLIC_FIREBASE_ADMIN_AUTH_DOMAIN
- [ ] NEXT_PUBLIC_FIREBASE_ADMIN_PROJECT_ID
- [ ] NEXT_PUBLIC_FIREBASE_ADMIN_STORAGE_BUCKET
- [ ] NEXT_PUBLIC_FIREBASE_ADMIN_MESSAGING_SENDER_ID
- [ ] NEXT_PUBLIC_FIREBASE_ADMIN_APP_ID
- [ ] NEXT_PUBLIC_FIREBASE_ADMIN_MEASUREMENT_ID

### Existing Firestore Database
- [ ] FIREBASE_SERVICE_ACCOUNT_PROJECT_ID (andnuts-next)
- [ ] FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY
- [ ] FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL

### FCM Configuration
- [ ] NEXT_PUBLIC_FCM_VAPID_KEY
- [ ] FCM_SERVER_KEY

### App Configuration
- [ ] NEXT_PUBLIC_APP_URL
- [ ] ADMIN_APP_SECRET_KEY
- [ ] NODE_ENV

---

## TROUBLESHOOTING QUICK REFERENCE

### Build Fails
- Check environment variables
- Verify Firebase Admin SDK credentials
- Check TypeScript errors
- Ensure all dependencies installed

### Authentication Fails
- Verify Firebase Auth enabled
- Check admin user exists in Firestore
- Verify custom token creation
- Check browser console

### Database Connection Fails
- Verify service account credentials
- Check service account permissions
- Verify project ID matches
- Check network connectivity

### Deployment Fails
- Verify Firebase CLI is logged in
- Check firebase.json configuration
- Verify build completes successfully
- Check Firebase project permissions

---

## SUPPORT DOCUMENTS

- **Complete Documentation**: `ADMIN_APP_COMPLETE_DOCUMENTATION.md`
- **Deployment Guide**: `DEPLOYMENT_PROMPT.md`
- **Quick Start**: `QUICK_START.md`
- **README**: `README.md`

