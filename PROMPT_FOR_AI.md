# PROMPT FOR AI ASSISTANT - Complete Admin App Setup

Copy this entire prompt and use it with your AI assistant to finish and deploy the admin application:

---

I have a complete Next.js 14 admin application for an e-commerce platform located at /home/heresy/myrepos/admin-app. The application is fully implemented with all features but needs to be configured and deployed to production.

Please complete the following tasks:

## TASK 1: VERIFY APPLICATION STRUCTURE
- Check all files exist in /home/heresy/myrepos/admin-app
- Verify package.json has all required dependencies
- Ensure TypeScript configuration is correct
- Check all API routes are properly structured
- Verify components are in place
- Report any missing files or issues

## TASK 2: INSTALL AND BUILD
- Run `npm install` in /home/heresy/myrepos/admin-app
- Verify all packages install successfully
- Run `npm run build` and fix any TypeScript/build errors
- Ensure build completes successfully

## TASK 3: FIREBASE SETUP
- Create a new Firebase project named "andnuts-admin" (or verify if exists)
- Enable Authentication (Email/Password and Google)
- Enable Cloud Messaging (FCM) and generate VAPID key
- Enable Firebase Hosting
- Enable Firestore (for admin users collection)
- Generate service account key from existing project (andnuts-next)
- Document all configuration values needed for .env.local

## TASK 4: ENVIRONMENT CONFIGURATION
- Create .env.local file from .env.example
- Document which values need to be filled
- Create checklist of required Firebase credentials
- Set up all environment variables

## TASK 5: ADMIN USER SETUP
- Create admin user in Firebase Authentication (new project)
- Create adminUsers collection in Firestore (new project)
- Create document with user's UID and role: "admin"
- Test login functionality

## TASK 6: FIREBASE CLI SETUP
- Run `firebase login` if not already logged in
- Run `firebase init` in admin-app directory
- Select: Hosting, Firestore
- Choose the new Firebase project (andnuts-admin)
- Configure hosting public directory as "out"
- Configure Firestore rules file

## TASK 7: DEPLOYMENT
- Deploy Firestore rules: `firebase deploy --only firestore:rules`
- Build production: `npm run build`
- Deploy to hosting: `firebase deploy --only hosting`
- Verify deployment succeeds
- Get hosting URL

## TASK 8: POST-DEPLOYMENT TESTING
- Test login functionality
- Verify order management works
- Test product management
- Check customer management
- Verify analytics dashboard
- Test push notifications
- Verify security features

## TASK 9: FINAL VERIFICATION
- Verify all environment variables are set
- Check Firebase projects are configured correctly
- Verify service account has proper permissions
- Confirm admin users are created
- Verify Firestore rules are deployed
- Confirm application is accessible
- Verify all features work in production

Please proceed step by step, report progress at each task, and document any issues or missing configurations. Stop and ask for clarification if any step is unclear or if credentials are needed.

---

**Location**: /home/heresy/myrepos/admin-app
**Documentation**: See ADMIN_APP_COMPLETE_DOCUMENTATION.md for detailed information
