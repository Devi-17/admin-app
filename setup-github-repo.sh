#!/bin/bash

# Script to create GitHub repository and push code
# Usage: ./setup-github-repo.sh [GITHUB_TOKEN]

set -e

REPO_NAME="admin-app"
REPO_DESCRIPTION="Production-ready admin portal for &Nuts Trading e-commerce platform"
IS_PRIVATE="false"

GITHUB_TOKEN="${1:-$GITHUB_TOKEN}"
GITHUB_USER="${GITHUB_USER:-$(git config user.name)}"

if [ -z "$GITHUB_TOKEN" ]; then
    echo "Error: GitHub token required"
    echo "Usage: $0 [GITHUB_TOKEN]"
    echo "Or set GITHUB_TOKEN environment variable"
    echo ""
    echo "To get a token:"
    echo "1. Go to https://github.com/settings/tokens"
    echo "2. Generate new token (classic) with 'repo' scope"
    echo "3. Run: $0 YOUR_TOKEN"
    exit 1
fi

echo "Creating GitHub repository: $REPO_NAME"
echo "Description: $REPO_DESCRIPTION"
echo "User: $GITHUB_USER"

# Create repository using GitHub API
RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{
    \"name\": \"$REPO_NAME\",
    \"description\": \"$REPO_DESCRIPTION\",
    \"private\": $IS_PRIVATE,
    \"auto_init\": false
  }")

# Check if repo was created successfully
if echo "$RESPONSE" | grep -q '"message"'; then
    ERROR_MSG=$(echo "$RESPONSE" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
    if echo "$ERROR_MSG" | grep -q "already exists"; then
        echo "Repository already exists, continuing..."
    else
        echo "Error creating repository: $ERROR_MSG"
        echo "Response: $RESPONSE"
        exit 1
    fi
fi

# Get repository URL
REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "Repository created: $REPO_URL"

# Add remote if it doesn't exist
if git remote get-url origin >/dev/null 2>&1; then
    echo "Remote 'origin' already exists, updating..."
    git remote set-url origin "$REPO_URL"
else
    echo "Adding remote 'origin'..."
    git remote add origin "$REPO_URL"
fi

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo "Repository: $REPO_URL"

