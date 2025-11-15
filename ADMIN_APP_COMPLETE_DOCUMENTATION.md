# &Nuts Admin Portal - Complete Documentation

## Overview

This is a **production-ready admin application** for the &Nuts Trading e-commerce platform. It is a **separate Next.js application** that connects to the existing Firestore database while using its own Firebase project for authentication and hosting.

## Architecture

### Project Structure

```
admin-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   └── login/               # Login page
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── dashboard/           # Main dashboard
│   │   ├── orders/              # Order management
│   │   ├── products/            # Product management
│   │   ├── customers/           # Customer management
│   │   ├── analytics/           # Analytics dashboard
│   │   ├── inventory/           # Inventory management
│   │   ├── coupons/             # Coupon management
│   │   └── settings/            # Settings page
│   └── api/                     # API routes
│       ├── auth/                # Authentication endpoints
│       ├── orders/              # Order API
│       ├── products/            # Product API
│       ├── customers/            # Customer API
│       ├── analytics/            # Analytics API
│       └── notifications/       # Push notification API
├── components/                   # React components
│   ├── admin/                   # Admin-specific components
│   ├── notifications/           # Notification components
│   └── providers/               # Context providers
├── lib/                          # Core libraries
│   ├── firebase-admin.ts        # Firebase Admin SDK (connects to existing DB)
│   ├── firebase-client.ts       # Firebase Client SDK (new project)
│   ├── services/                 # Business logic services
│   ├── middleware/               # API middleware
│   ├── utils/                    # Utility functions
│   └── types/                    # TypeScript types
└── public/                       # Static assets
    └── firebase-messaging-sw.js  # Service worker for FCM
```

### Key Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Chart.js, Recharts
- **Notifications**: Firebase Cloud Messaging (FCM) + Web Push API
- **Authentication**: Firebase Auth (separate project)
- **Database**: Firestore (existing database via Admin SDK)
- **Hosting**: Firebase Hosting

## Firebase Configuration

### Two Firebase Projects

1. **New Firebase Project (Admin App)**
   - Used for: Authentication, Hosting, FCM
   - Project ID: `andnuts-admin` (or your chosen name)
   - Contains: Admin users, notification subscriptions

2. **Existing Firebase Project (E-commerce)**
   - Used for: Firestore database (read/write access)
   - Project ID: `andnuts-next` (existing project)
   - Contains: Orders, Products, Customers, Discounts

### Why Two Projects?

- **Security**: Admin app has separate authentication
- **Isolation**: Admin operations don't affect main app
- **Scalability**: Can scale admin app independently
- **Access Control**: Different security rules and permissions

## Features

### 1. Authentication System

**Location**: `app/(auth)/login/`, `lib/auth.ts`, `lib/store/authStore.ts`

- Email/password authentication
- Google OAuth support
- Custom token-based authentication
- Role-based access control (RBAC)
- Protected routes
- Session management

**Admin Roles**:
- `admin`: Full access
- `manager`: Manage products, orders, inventory
- `inventory`: Manage products and inventory only
- `orders`: Manage orders only
- `viewer`: Read-only access

### 2. Order Management

**Location**: `app/(dashboard)/orders/`, `lib/services/orderService.ts`

**Features**:
- Real-time order list with filters
- Order detail view with full information
- Status updates (pending → confirmed → processing → shipped → delivered)
- Order cancellation and refund processing
- Search by order number
- Filter by status, date range
- Order timeline/history
- Customer information display

**API Endpoints**:
- `GET /api/orders` - List orders with filters
- `GET /api/orders/[id]` - Get order details
- `PATCH /api/orders/[id]` - Update order status

### 3. Product Management

**Location**: `app/(dashboard)/products/`, `lib/services/productService.ts`

**Features**:
- Product list with pagination
- Create/Edit/Delete products
- Product image management
- Inventory management
- Bulk operations
- Product search

**API Endpoints**:
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get product
- `PATCH /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### 4. Customer Management

**Location**: `app/(dashboard)/customers/`, `lib/services/customerService.ts`

**Features**:
- Customer list with search
- Customer detail view
- Order history per customer
- Customer analytics (total spent, order count)
- Customer segmentation

**API Endpoints**:
- `GET /api/customers` - List customers
- `GET /api/customers/[id]` - Get customer with orders

### 5. Analytics Dashboard

**Location**: `app/(dashboard)/analytics/`, `lib/services/analyticsService.ts`

**Features**:
- Sales overview (revenue, orders, AOV)
- Revenue trends (charts)
- Orders by date (charts)
- Top products by revenue
- Order status distribution
- Real-time metrics

**API Endpoints**:
- `GET /api/analytics` - Get analytics data

### 6. Inventory Management

**Location**: `app/(dashboard)/inventory/`

**Features**:
- Stock level monitoring
- Low stock alerts
- Inventory adjustments
- Stock history tracking

### 7. Coupon Management

**Location**: `app/(dashboard)/coupons/`

**Features**:
- Create/Edit/Delete coupons
- Coupon usage tracking
- Discount analytics
- Bulk coupon generation

### 8. Push Notifications

**Location**: `lib/notifications/`, `public/firebase-messaging-sw.js`

**Features**:
- Firebase Cloud Messaging (FCM)
- Web Push API
- Service worker for background notifications
- Notification preferences
- Real-time order notifications

**Notification Types**:
- New order created
- Order status changed
- Payment received
- Order cancelled
- Low inventory alerts

**API Endpoints**:
- `POST /api/notifications/subscribe` - Subscribe to notifications
- `POST /api/notifications/unsubscribe` - Unsubscribe

### 9. Security Features

**Location**: `lib/middleware/`, `lib/utils/`

**Implemented**:
- Content Security Policy (CSP)
- Rate limiting (100-200 requests/minute)
- Input validation and sanitization
- XSS protection
- CSRF protection
- Audit logging for all admin actions
- Secure headers (HSTS, X-Frame-Options, etc.)
- Token-based authentication
- Role-based access control

## API Routes

### Authentication
- `POST /api/auth/signin` - Sign in with email/password
- `GET /api/auth/user/[uid]` - Get admin user data

### Orders
- `GET /api/orders` - List orders (with filters)
- `GET /api/orders/[id]` - Get order details
- `PATCH /api/orders/[id]` - Update order

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get product
- `PATCH /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Customers
- `GET /api/customers` - List customers
- `GET /api/customers/[id]` - Get customer with orders

### Analytics
- `GET /api/analytics` - Get analytics data

### Notifications
- `POST /api/notifications/subscribe` - Subscribe to push notifications
- `POST /api/notifications/unsubscribe` - Unsubscribe

## Environment Variables

### Required Variables

Create `.env.local` file in the project root:

```bash
# ============================================
# NEW FIREBASE PROJECT (Admin App)
# ============================================
NEXT_PUBLIC_FIREBASE_ADMIN_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_ADMIN_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_ADMIN_PROJECT_ID=your-admin-project-id
NEXT_PUBLIC_FIREBASE_ADMIN_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_ADMIN_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_ADMIN_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_ADMIN_MEASUREMENT_ID=your-measurement-id

# ============================================
# EXISTING FIRESTORE DATABASE (Service Account)
# ============================================
FIREBASE_SERVICE_ACCOUNT_PROJECT_ID=andnuts-next
FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL=service-account@andnuts-next.iam.gserviceaccount.com

# ============================================
# FCM CONFIGURATION
# ============================================
NEXT_PUBLIC_FCM_VAPID_KEY=your-vapid-key
FCM_SERVER_KEY=your-server-key

# ============================================
# APP CONFIGURATION
# ============================================
NEXT_PUBLIC_APP_URL=https://admin.andnuts.store
ADMIN_APP_SECRET_KEY=generate-random-secret-key-here
NODE_ENV=production
```

## Setup Instructions

### Step 1: Create New Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name: `andnuts-admin` (or your preferred name)
4. Enable Google Analytics (optional)
5. Create project

### Step 2: Enable Firebase Services

#### Authentication
1. Go to Authentication > Sign-in method
2. Enable Email/Password
3. Enable Google (optional)
4. Save

#### Cloud Messaging (FCM)
1. Go to Project Settings > Cloud Messaging
2. Generate Web Push certificates (or use existing)
3. Copy the VAPID key
4. Copy the Server key

#### Hosting
1. Go to Hosting
2. Click "Get started"
3. Follow setup instructions

### Step 3: Get Service Account Key

1. Go to **existing Firebase project** (`andnuts-next`)
2. Go to Project Settings > Service Accounts
3. Click "Generate new private key"
4. Save the JSON file securely
5. Extract values:
   - `project_id` → `FIREBASE_SERVICE_ACCOUNT_PROJECT_ID`
   - `private_key` → `FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY`
   - `client_email` → `FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL`

**Important**: Keep the private key secure. Never commit it to version control.

### Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in all required values
3. For production, set these in your hosting platform

### Step 5: Create Admin Users

1. Go to Authentication > Users in new Firebase project
2. Add user with email/password
3. Go to Firestore in new Firebase project
4. Create collection `adminUsers`
5. Create document with user's UID:

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

### Step 6: Configure Firestore Rules

Deploy Firestore rules for the new Firebase project:

```bash
firebase deploy --only firestore:rules
```

Rules are in `firestore.rules` - they protect admin users and notification subscriptions.

### Step 7: Build and Deploy

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## Development

### Local Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:3000
```

### Testing

1. Create test admin user in Firebase Auth
2. Create corresponding document in `adminUsers` collection
3. Login at `/login`
4. Test all features

## Deployment

### Firebase Hosting Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**:
   ```bash
   firebase deploy --only hosting
   ```

3. **Deploy Firestore Rules** (if changed):
   ```bash
   firebase deploy --only firestore:rules
   ```

### Custom Domain Setup

1. Go to Firebase Hosting > Add custom domain
2. Enter domain: `admin.andnuts.store`
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning (can take up to 24 hours)

### Environment Variables in Production

Set environment variables in Firebase Hosting:
1. Go to Firebase Console > Hosting
2. Click on your site
3. Go to Environment Variables
4. Add all required variables

Or use `.env.production` file (not recommended for sensitive data).

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
- [ ] Environment variables secured (not in version control)

## Monitoring

### Firebase Performance Monitoring
- Set up Firebase Performance Monitoring
- Monitor API response times
- Track error rates

### Error Tracking
- Configure error tracking
- Set up alerts for critical errors

### Audit Logs
- Review audit logs regularly
- Monitor for suspicious activities
- Check admin user access patterns

## Troubleshooting

### Authentication Issues
- Verify Firebase Auth is enabled
- Check admin user exists in Firestore
- Verify custom token creation
- Check browser console for errors

### Firestore Connection Issues
- Verify service account credentials
- Check service account has Firestore permissions
- Verify project ID matches
- Check network connectivity

### Push Notification Issues
- Verify FCM is enabled
- Check VAPID key is correct
- Verify service worker is registered
- Check browser notification permissions

### Build Issues
- Ensure all dependencies are installed
- Check TypeScript errors
- Verify environment variables are set
- Check Firebase Admin SDK initialization

## Support

For issues or questions:
1. Check this documentation
2. Review Firebase documentation
3. Check error logs
4. Contact development team

## Version History

- **v0.1.0** (2024-01-XX): Initial release
  - Complete admin dashboard
  - Order management
  - Product management
  - Customer management
  - Analytics dashboard
  - Push notifications
  - Security features

## License

Private - &Nuts Trading. All rights reserved.

