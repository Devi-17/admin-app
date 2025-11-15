# &Nuts Admin Portal

**Production-ready admin application** for &Nuts Trading e-commerce platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run setup script
./setup-and-deploy.sh

# Or manually:
npm run dev  # Development
npm run build  # Build
npm run deploy  # Deploy
```

## 📚 Documentation

- **[Complete Documentation](./ADMIN_APP_COMPLETE_DOCUMENTATION.md)** - Full guide with all details
- **[Deployment Prompt](./DEPLOYMENT_PROMPT.md)** - Step-by-step deployment instructions
- **[Quick Start](./QUICK_START.md)** - Get started in 5 minutes
- **[Deployment Guide](./DEPLOYMENT.md)** - Detailed deployment steps

## ✨ Features

- ✅ **Order Management** - Real-time order tracking and status updates
- ✅ **Product Management** - Full CRUD operations
- ✅ **Customer Management** - Customer database and analytics
- ✅ **Analytics Dashboard** - Sales metrics and charts
- ✅ **Inventory Management** - Stock monitoring and alerts
- ✅ **Push Notifications** - FCM and Web Push API
- ✅ **Security** - Rate limiting, validation, audit logging

## 🏗️ Architecture

- **Framework**: Next.js 14 (App Router)
- **Database**: Firestore (existing database via Admin SDK)
- **Authentication**: Firebase Auth (separate project)
- **Hosting**: Firebase Hosting
- **Notifications**: FCM + Web Push API

## 🔐 Security

- Content Security Policy (CSP)
- Rate limiting
- Input validation
- Audit logging
- Role-based access control

## 📋 Prerequisites

- Node.js 18+
- Firebase account
- Service account key for existing Firestore database

## 🛠️ Setup

1. **Install dependencies**: `npm install`
2. **Configure environment**: Copy `.env.example` to `.env.local` and fill values
3. **Create Firebase project**: New project for admin app
4. **Get service account**: From existing Firestore database
5. **Create admin users**: In Firebase Auth and Firestore
6. **Deploy**: `npm run deploy`

See [Complete Documentation](./ADMIN_APP_COMPLETE_DOCUMENTATION.md) for detailed instructions.

## 📝 Environment Variables

Required environment variables (see `.env.example`):

- Firebase Admin App credentials (new project)
- Firebase Service Account credentials (existing database)
- FCM VAPID key and server key
- App configuration

## 🚢 Deployment

```bash
# Build
npm run build

# Deploy to Firebase Hosting
npm run deploy

# Deploy Firestore rules
npm run deploy:rules

# Deploy everything
npm run deploy:all
```

## 📖 API Routes

- `/api/auth/*` - Authentication
- `/api/orders/*` - Order management
- `/api/products/*` - Product management
- `/api/customers/*` - Customer management
- `/api/analytics` - Analytics data
- `/api/notifications/*` - Push notifications

## 🔍 Testing

After deployment:
1. Login with admin credentials
2. Test order management
3. Verify product management
4. Check analytics dashboard
5. Test push notifications

## 🐛 Troubleshooting

See [Complete Documentation](./ADMIN_APP_COMPLETE_DOCUMENTATION.md) for troubleshooting guide.

## 📄 License

Private - &Nuts Trading
