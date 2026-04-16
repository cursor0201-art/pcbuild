#!/bin/bash

# PC Builder Deployment Script
echo "Preparing PC Builder for deployment..."

# Backend preparation
echo "=== Backend Preparation ==="
cd backend

# Create logs directory
mkdir -p logs

# Generate new SECRET_KEY
SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
echo "Generated SECRET_KEY: $SECRET_KEY"

# Update .env.production with new SECRET_KEY
sed -i "s/your-production-secret-key-here/$SECRET_KEY/" .env.production

echo "Backend prepared!"
echo ""

# Frontend preparation
echo "=== Frontend Preparation ==="
cd ../frontend

# Install dependencies
npm install

# Build for production
npm run build

echo "Frontend built!"
echo ""

# Git preparation
echo "=== Git Preparation ==="
cd ..

# Add all changes
git add .

# Commit changes
git commit -m "Prepare for deployment - $(date)"

echo "Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Deploy backend on Koyeb"
echo "3. Deploy frontend on Cloudflare Pages"
echo "4. Update environment variables"
echo ""
echo "Check DEPLOYMENT.md for detailed instructions."
