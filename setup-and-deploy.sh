#!/bin/bash

# Admin App Setup and Deployment Script
# This script helps set up and deploy the admin application

set -e  # Exit on error

echo "=========================================="
echo "&Nuts Admin App - Setup and Deployment"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from the admin-app directory.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Found admin-app directory"
echo ""

# Step 1: Install dependencies
echo "Step 1: Installing dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} node_modules exists, skipping install"
fi
echo ""

# Step 2: Check environment file
echo "Step 2: Checking environment configuration..."
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo -e "${YELLOW}⚠${NC} Created .env.local from .env.example"
        echo -e "${YELLOW}⚠${NC} Please edit .env.local with your actual values before proceeding"
    else
        echo -e "${RED}Error: .env.example not found${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓${NC} .env.local exists"
fi
echo ""

# Step 3: Check Firebase CLI
echo "Step 3: Checking Firebase CLI..."
if ! command -v firebase &> /dev/null; then
    echo -e "${YELLOW}⚠${NC} Firebase CLI not found. Installing..."
    npm install -g firebase-tools
else
    echo -e "${GREEN}✓${NC} Firebase CLI installed"
fi
echo ""

# Step 4: Check Firebase login
echo "Step 4: Checking Firebase authentication..."
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}⚠${NC} Not logged in to Firebase. Please login:"
    firebase login
else
    echo -e "${GREEN}✓${NC} Firebase authenticated"
fi
echo ""

# Step 5: Build application
echo "Step 5: Building application..."
echo -e "${YELLOW}Note: Build may show warnings about missing env vars. This is normal if .env.local is not configured yet.${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Build successful"
else
    echo -e "${RED}✗${NC} Build failed. Please check errors above."
    exit 1
fi
echo ""

# Step 6: Firebase initialization check
echo "Step 6: Checking Firebase configuration..."
if [ ! -f ".firebaserc" ]; then
    echo -e "${YELLOW}⚠${NC} Firebase not initialized. Run: firebase init"
    echo "   Select: Hosting, Firestore"
    echo "   Choose existing project or create new one"
else
    echo -e "${GREEN}✓${NC} Firebase initialized"
fi
echo ""

# Step 7: Deployment options
echo "=========================================="
echo "Deployment Options:"
echo "=========================================="
echo ""
echo "1. Deploy Firestore rules only"
echo "2. Deploy to Firebase Hosting only"
echo "3. Deploy everything (rules + hosting)"
echo "4. Skip deployment"
echo ""
read -p "Choose option (1-4): " deploy_option

case $deploy_option in
    1)
        echo "Deploying Firestore rules..."
        firebase deploy --only firestore:rules
        ;;
    2)
        echo "Deploying to Firebase Hosting..."
        firebase deploy --only hosting
        ;;
    3)
        echo "Deploying everything..."
        firebase deploy
        ;;
    4)
        echo "Skipping deployment"
        ;;
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Configure .env.local with your actual values"
echo "2. Create admin users in Firebase Authentication"
echo "3. Create adminUsers documents in Firestore"
echo "4. Test the application"
echo ""
echo "For detailed instructions, see:"
echo "- ADMIN_APP_COMPLETE_DOCUMENTATION.md"
echo "- DEPLOYMENT_PROMPT.md"
echo ""

