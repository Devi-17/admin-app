# Admin Push Notifications - Cloud Function Setup

This guide explains how to set up the Cloud Function approach for admin notifications.

## Overview

The Cloud Function (`notifyAdminsOnOrderCreated`) can be called from the main app after order creation, or configured as a Firestore trigger in the main project.

## Setup Steps

### 1. Install Dependencies

```bash
cd /home/heresy/myrepos/admin-app/functions
npm install
```

### 2. Configure Environment Variables

Set these in Firebase Functions config:

```bash
firebase functions:config:set \
  admin_firebase.project_id="andnuts-admin" \
  admin_firebase.client_email="service-account@andnuts-admin.iam.gserviceaccount.com" \
  admin_firebase.private_key="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Or use `.env` file (for local development):
```bash
ADMIN_FIREBASE_PROJECT_ID=andnuts-admin
ADMIN_FIREBASE_CLIENT_EMAIL=service-account@andnuts-admin.iam.gserviceaccount.com
ADMIN_FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. Build Functions

```bash
npm run build
```

### 4. Deploy Functions

```bash
firebase deploy --only functions
```

### 5. Test Function

Call the function from main app or test directly:

```bash
# Using Firebase CLI
firebase functions:shell
> notifyAdminsOnOrderCreated({ orderId: "test-123", orderData: { total: 1000, orderNumber: "123" } })
```

## Integration with Main App

### Option A: Call from Main App (HTTP Callable)

In main app's order creation API, call the Cloud Function:

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const notifyAdmins = httpsCallable(functions, 'notifyAdminsOnOrderCreated');

// After order creation
await notifyAdmins({
  orderId: orderRef.id,
  orderData: {
    orderNumber: orderNumber,
    total: total,
    customerName: customerName,
  }
});
```

### Option B: Firestore Trigger (Deploy in Main Project)

Copy the function to main project and deploy as Firestore trigger:

1. Copy `functions/src/notifyAdmins.ts` to main project
2. Deploy from main project
3. Function automatically triggers on order creation

## Monitoring

Check function logs:

```bash
firebase functions:log --only notifyAdminsOnOrderCreated
```

View in Firebase Console:
- Functions → notifyAdminsOnOrderCreated → Logs

## Troubleshooting

See main setup guide: `/home/heresy/myrepos/AndNuts/ADMIN_NOTIFICATIONS_SETUP.md`

