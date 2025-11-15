# Deployment Prompt - Complete Admin App Setup

Use this prompt to finish and deploy the admin application:

---

## PROMPT FOR COMPLETION AND DEPLOYMENT

```
I have a Next.js 14 admin application for an e-commerce platform that needs to be completed and deployed. The app is located at /home/heresy/myrepos/admin-app.

Please complete the following tasks:

1. **Verify Application Structure**
   - Check all files are in place
   - Verify all dependencies are installed
   - Ensure TypeScript compilation works
   - Fix any remaining build errors

2. **Firebase Setup**
   - Create a new Firebase project named "andnuts-admin" (or verify it exists)
   - Enable Authentication (Email/Password and Google)
   - Enable Cloud Messaging (FCM) and generate VAPID key
   - Enable Firebase Hosting
   - Generate service account key for the existing Firestore database (project: andnuts-next)
   - Configure Firebase Hosting for the admin app

3. **Environment Configuration**
   - Create .env.local file with all required environment variables
   - Set up Firebase Admin SDK credentials (service account)
   - Configure FCM VAPID key and server key
   - Set NEXT_PUBLIC_APP_URL to production URL

4. **Admin User Setup**
   - Create at least one admin user in Firebase Authentication
   - Create corresponding document in Firestore adminUsers collection with role: "admin"
   - Test login functionality

5. **Firestore Configuration**
   - Deploy Firestore rules for the new Firebase project
   - Verify indexes are created
   - Test database connection to existing Firestore

6. **Build and Test**
   - Run `npm run build` and fix any errors
   - Test all API endpoints
   - Verify authentication flow
   - Test push notifications setup

7. **Deployment**
   - Build the application for production
   - Deploy to Firebase Hosting
   - Configure custom domain (admin.andnuts.store) if needed
   - Set up environment variables in Firebase Hosting
   - Verify HTTPS is enabled

8. **Post-Deployment Verification**
   - Test login functionality
   - Verify order management works
   - Test product management
   - Check customer management
   - Verify analytics dashboard
   - Test push notifications
   - Verify all security features are working

9. **Documentation**
   - Update README.md with final setup instructions
   - Document any custom configurations
   - Create troubleshooting guide

10. **Final Checklist**
    - All environment variables set
    - Service account credentials configured
    - Admin users created
    - Firestore rules deployed
    - Application deployed and accessible
    - All features tested and working
    - Security measures verified

Please proceed step by step and report any issues or missing configurations.
```

---

## QUICK DEPLOYMENT COMMANDS

```bash
# Navigate to admin app directory
cd /home/heresy/myrepos/admin-app

# Install dependencies (if not already done)
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your actual values

# Build the application
npm run build

# Login to Firebase (if not already logged in)
firebase login

# Initialize Firebase (if not already done)
firebase init
# Select: Hosting, Firestore
# Use existing project or create new one

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Verify deployment
# Check Firebase Console > Hosting for deployment status
```

---

## ENVIRONMENT VARIABLES CHECKLIST

Before deploying, ensure these are set in `.env.local`:

- [ ] `NEXT_PUBLIC_FIREBASE_ADMIN_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_ADMIN_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_ADMIN_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_ADMIN_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_ADMIN_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_ADMIN_APP_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_ADMIN_MEASUREMENT_ID`
- [ ] `FIREBASE_SERVICE_ACCOUNT_PROJECT_ID` (existing project: andnuts-next)
- [ ] `FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY`
- [ ] `FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL`
- [ ] `NEXT_PUBLIC_FCM_VAPID_KEY`
- [ ] `FCM_SERVER_KEY`
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `ADMIN_APP_SECRET_KEY`

---

## FIREBASE PROJECT SETUP CHECKLIST

### New Firebase Project (Admin App)
- [ ] Project created: `andnuts-admin`
- [ ] Authentication enabled (Email/Password, Google)
- [ ] Cloud Messaging enabled
- [ ] VAPID key generated
- [ ] Server key copied
- [ ] Hosting enabled
- [ ] Firestore enabled (for admin users collection)

### Existing Firebase Project (E-commerce DB)
- [ ] Service account key generated
- [ ] Service account has Firestore read/write permissions
- [ ] Project ID confirmed: `andnuts-next`

---

## ADMIN USER CREATION

1. **In Firebase Authentication** (new project):
   - Add user with email: `admin@andnuts.com`
   - Set password
   - Copy User UID

2. **In Firestore** (new project):
   - Create collection: `adminUsers`
   - Create document with User UID as document ID
   - Add fields:
     ```json
     {
       "email": "admin@andnuts.com",
       "displayName": "Admin User",
       "role": "admin",
       "permissions": [],
       "isActive": true,
       "createdAt": "2024-01-01T00:00:00Z",
       "updatedAt": "2024-01-01T00:00:00Z"
     }
     ```

---

## TESTING CHECKLIST

After deployment, test:

- [ ] Login page loads
- [ ] Can login with admin credentials
- [ ] Dashboard displays correctly
- [ ] Orders page loads and displays orders
- [ ] Can view order details
- [ ] Can update order status
- [ ] Products page loads
- [ ] Customers page loads
- [ ] Analytics dashboard displays data
- [ ] Inventory page shows products
- [ ] Push notifications permission prompt appears
- [ ] Notifications work when new order created

---

## TROUBLESHOOTING

### Build Fails
- Check environment variables are set
- Verify Firebase Admin SDK credentials
- Check TypeScript errors
- Ensure all dependencies installed

### Authentication Fails
- Verify Firebase Auth is enabled
- Check admin user exists in Firestore
- Verify custom token creation
- Check browser console for errors

### Database Connection Fails
- Verify service account credentials
- Check service account permissions
- Verify project ID matches
- Check network connectivity

### Push Notifications Don't Work
- Verify FCM is enabled
- Check VAPID key is correct
- Verify service worker is registered
- Check browser notification permissions

---

## SUPPORT

If you encounter issues:
1. Check ADMIN_APP_COMPLETE_DOCUMENTATION.md
2. Review Firebase Console logs
3. Check browser console for errors
4. Verify all environment variables
5. Contact development team

