# PC Builder Deployment Guide

## Overview
- **Frontend**: Cloudflare Pages (Static React App)
- **Backend**: Koyeb (Django + PostgreSQL)
- **Telegram**: Bot notifications

## Backend Deployment (Koyeb)

### 1. Prepare Database
```bash
# Create PostgreSQL database on Koyeb
# Note connection details from Koyeb dashboard
```

### 2. Update Environment Variables
Edit `backend/.env.production`:
```env
DEBUG=False
SECRET_KEY=your-unique-secret-key-here
ALLOWED_HOSTS=your-app.koyeb.app
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=your-db-host
DB_PORT=5432
TELEGRAM_BOT_TOKEN=8797840133:AAHXG-d5KZdxr3ZM9xBdFX7aioECkySbLoA
TELEGRAM_CHAT_ID=8456049332
```

### 3. Deploy to Koyeb
```bash
# Push to GitHub
git add .
git commit -m "Ready for Koyeb deployment"
git push origin main

# Deploy via Koyeb dashboard:
# 1. Create new app
# 2. Connect GitHub repository
# 3. Use koyeb.yaml configuration
# 4. Deploy
```

### 4. Run Migrations
After deployment, run migrations:
```bash
# Access Koyeb app logs or SSH to run:
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py loaddata fixtures/products.json
```

## Frontend Deployment (Cloudflare Pages)

### 1. Update Environment Variables
Edit `frontend/.env.production`:
```env
VITE_API_BASE_URL=https://your-koyeb-app.koyeb.app/api
```

### 2. Update Redirects
Edit `frontend/_redirects`:
```
/api/*  https://your-koyeb-app.koyeb.app/api/:splat  200
```

### 3. Build and Deploy
```bash
# Install dependencies
cd frontend
npm install

# Build for production
npm run build

# Deploy to Cloudflare Pages
# 1. Connect GitHub repository
# 2. Set build command: npm run build
# 3. Set output directory: dist
# 4. Add environment variables
# 5. Deploy
```

## Post-Deployment Checklist

### Backend (Koyeb)
- [ ] Database migrations completed
- [ ] Superuser created
- [ ] Sample data loaded
- [ ] Telegram bot working
- [ ] Admin panel accessible
- [ ] API endpoints responding

### Frontend (Cloudflare Pages)
- [ ] Site loads correctly
- [ ] API calls working
- [ ] Cart functionality working
- [ ] Checkout working
- [ ] Telegram notifications working

### Testing
1. **API Test**: `https://your-app.koyeb.app/api/products/`
2. **Frontend Test**: `https://your-app.pages.dev`
3. **Full Flow**: Builder -> Cart -> Checkout -> Telegram

## Environment Variables Summary

### Backend (Koyeb)
| Variable | Value |
|----------|-------|
| DEBUG | False |
| SECRET_KEY | Generate new key |
| ALLOWED_HOSTS | your-app.koyeb.app |
| DB_NAME | PostgreSQL database name |
| DB_USER | PostgreSQL username |
| DB_PASSWORD | PostgreSQL password |
| DB_HOST | PostgreSQL host |
| DB_PORT | 5432 |
| TELEGRAM_BOT_TOKEN | 8797840133:AAHXG-d5KZdxr3ZM9xBdFX7aioECkySbLoA |
| TELEGRAM_CHAT_ID | 8456049332 |

### Frontend (Cloudflare Pages)
| Variable | Value |
|----------|-------|
| VITE_API_BASE_URL | https://your-koyeb-app.koyeb.app/api |

## Troubleshooting

### Common Issues
1. **CORS Errors**: Update CORS_ALLOWED_ORIGINS in backend
2. **Database Connection**: Check database credentials
3. **Static Files**: Ensure collectstatic runs successfully
4. **Telegram Bot**: Verify BOT_TOKEN and CHAT_ID

### Debug Commands
```bash
# Check backend logs
kubectl logs -f deployment/backend

# Test database connection
python manage.py dbshell

# Check static files
python manage.py collectstatic --dry-run
```

## Production URLs
- **Frontend**: https://your-app.pages.dev
- **Backend API**: https://your-app.koyeb.app/api
- **Admin Panel**: https://your-app.koyeb.app/admin

## Security Notes
- Change default SECRET_KEY
- Use strong database passwords
- Enable HTTPS everywhere
- Monitor Telegram bot activity
- Regular database backups
