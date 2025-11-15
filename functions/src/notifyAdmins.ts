import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// This function needs access to BOTH Firebase projects:
// 1. Main Firestore (andnuts-next) - to listen for order creation
// 2. Admin Firestore (andnuts-admin) - to get notification subscriptions

let adminApp: admin.app.App | null = null;

/**
 * Initialize Firebase Admin SDK with service account that has access to both projects
 */
function initializeAdminSDK(): admin.app.App {
  if (adminApp) {
    return adminApp;
  }

  // Check if already initialized
  if (admin.apps.length > 0) {
    adminApp = admin.app();
    return adminApp;
  }

  // Initialize with service account credentials
  // These should have access to BOTH Firebase projects
  const projectId = process.env.ADMIN_FIREBASE_PROJECT_ID || 'andnuts-admin';
  const clientEmail = process.env.ADMIN_FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.ADMIN_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin credentials. Set ADMIN_FIREBASE_CLIENT_EMAIL and ADMIN_FIREBASE_PRIVATE_KEY'
    );
  }

  adminApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    projectId,
  });

  return adminApp;
}

/**
 * Get Firestore instance for MAIN project (andnuts-next)
 * This is where orders are created
 */
function getMainFirestore(): admin.firestore.Firestore {
  const app = initializeAdminSDK();
  
  // For cross-project access, we need to use the service account
  // that has been granted access to the main project's Firestore
  // In Cloud Functions, we can access multiple projects if the service account has permissions
  
  // Option 1: If service account has access to main project, use it directly
  // Option 2: Initialize a second app instance for main project
  
  // For now, we'll use the same app but connect to main project's Firestore
  // This requires the service account to have access to both projects
  return admin.firestore(app);
}

/**
 * Get Firestore instance for ADMIN project (andnuts-admin)
 * This is where notification subscriptions are stored
 */
function getAdminFirestore(): admin.firestore.Firestore {
  const app = initializeAdminSDK();
  return admin.firestore(app);
}

/**
 * Get FCM Messaging instance
 */
function getMessaging(): admin.messaging.Messaging {
  const app = initializeAdminSDK();
  return admin.messaging(app);
}

/**
 * Interface for notification subscription
 */
interface NotificationSubscription {
  id: string;
  userId: string;
  token?: string;
  endpoint?: string;
  keys?: {
    p256dh: string;
    auth: string;
  };
  type?: 'fcm' | 'webpush';
  createdAt: admin.firestore.Timestamp | Date;
}

/**
 * HTTP Callable Function: Send admin notifications when order is created
 * This can be called from the main app after order creation
 * 
 * Note: For true Firestore trigger, deploy this function in the MAIN project (andnuts-next)
 * and listen to orders collection there. This HTTP version works across projects.
 */
export const notifyAdminsOnOrderCreated = functions
  .region('asia-south1') // Change to your preferred region
  .https
  .onCall(async (data, context) => {
    // Validate input
    if (!data.orderId || !data.orderData) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'orderId and orderData are required'
      );
    }

    const orderId = data.orderId;
    const orderData = data.orderData;

    console.log(`📦 New order created: ${orderId}`);

    try {
      // Get admin Firestore and messaging instances
      const adminDb = getAdminFirestore();
      const messaging = getMessaging();

      // Get all notification subscriptions from admin Firestore
      const subscriptionsSnapshot = await adminDb
        .collection('notificationSubscriptions')
        .get();

      if (subscriptionsSnapshot.empty) {
        console.log('No admin notification subscriptions found.');
        return {
          success: true,
          sent: 0,
          failed: 0,
          message: 'No subscriptions found',
        };
      }

      const subscriptions: NotificationSubscription[] = [];
      subscriptionsSnapshot.forEach((doc) => {
        subscriptions.push({
          id: doc.id,
          ...doc.data(),
        } as NotificationSubscription);
      });

      console.log(`Found ${subscriptions.length} admin notification subscription(s)`);

      // Prepare order details
      const orderNumber = orderData.orderNumber || orderId;
      const total = Number(orderData.total || orderData.totalAmount || 0);
      const totalFormatted = `₹${total.toLocaleString('en-IN')}`;
      const customerName = orderData.customerName || 
                          orderData.shipping_details?.name || 
                          'Customer';

      // Prepare notification payload
      const notificationPayload: admin.messaging.Message = {
        notification: {
          title: 'New Order Received',
          body: `Order #${orderNumber} - ${totalFormatted}`,
          icon: '/icon-192x192.png',
        },
        data: {
          orderId: orderId,
          orderNumber: orderNumber,
          total: total.toString(),
          type: 'new_order',
          url: `/orders/${orderId}`,
          customerName: customerName,
          click_action: `/orders/${orderId}`,
        },
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'order_notifications',
          },
        },
        apns: {
          headers: {
            'apns-priority': '10',
          },
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      };

      // Send notifications to all admin subscriptions
      const sendPromises = subscriptions.map(async (subscription) => {
        try {
          // Only send to FCM tokens
          if (!subscription.token || subscription.type === 'webpush') {
            return {
              subscriptionId: subscription.id,
              success: false,
              reason: 'webpush_not_supported',
            };
          }

          // Send FCM message
          const messageId = await messaging.send({
            token: subscription.token,
            ...notificationPayload,
          });

          console.log(
            `✅ Sent notification to admin ${subscription.userId} (subscription: ${subscription.id})`
          );

          return {
            subscriptionId: subscription.id,
            success: true,
            messageId,
          };
        } catch (error: any) {
          // Handle invalid tokens
          if (
            error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered'
          ) {
            console.warn(
              `⚠️ Invalid token for subscription ${subscription.id}, user ${subscription.userId}. Removing subscription.`
            );

            // Remove invalid subscription
            try {
              await adminDb
                .collection('notificationSubscriptions')
                .doc(subscription.id)
                .delete();
            } catch (deleteError) {
              console.error('Failed to delete invalid subscription:', deleteError);
            }
          } else {
            console.error(
              `❌ Failed to send notification to subscription ${subscription.id}:`,
              error.message || error
            );
          }

          return {
            subscriptionId: subscription.id,
            success: false,
            error: error.message || String(error),
          };
        }
      });

      // Wait for all notifications to be sent
      const results = await Promise.allSettled(sendPromises);

      const successCount = results.filter(
        (r) => r.status === 'fulfilled' && r.value.success
      ).length;
      const failureCount = results.length - successCount;

      console.log(
        `📊 Admin notifications sent: ${successCount} successful, ${failureCount} failed`
      );

      return {
        success: true,
        sent: successCount,
        failed: failureCount,
      };
    } catch (error: any) {
      console.error('Error in notifyAdminsOnOrderCreated:', error);
      throw new functions.https.HttpsError(
        'internal',
        error.message || 'Failed to send admin notifications'
      );
    }
  });

/**
 * Alternative: Firestore trigger (deploy in MAIN project to listen to orders)
 * Uncomment and deploy in main project (andnuts-next) if you want automatic triggers
 * 
 * To use this:
 * 1. Copy this function to main project's functions directory
 * 2. Deploy from main project
 * 3. Function will automatically trigger on order creation
 */
/*
export const onOrderCreated = functions
  .region('asia-south1')
  .firestore
  .document('orders/{orderId}')
  .onCreate(async (snapshot, context) => {
    const orderId = context.params.orderId;
    const orderData = snapshot.data();

    console.log(`📦 New order created: ${orderId}`);

    try {
      // Initialize admin Firebase app (separate project)
      const adminDb = getAdminFirestore();
      const messaging = getMessaging();

      // Rest of the code is the same as notifyAdminsOnOrderCreated...
      // (Copy the notification sending logic from above)
      
      return null;
    } catch (error) {
      console.error('Error in onOrderCreated:', error);
      return null;
    }
  });
*/

