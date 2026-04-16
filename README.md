# PC Builder Website - Full Stack Application

Complete PC builder application with Django backend and React frontend.

## Project Structure

```
Pcbuilderwebsitedesign-main/
|
|-- backend/                 # Django REST API
|   |-- GameZoneBuild/       # Django project settings
|   |-- shop/                # Main Django app
|   |-- manage.py            # Django management
|   |-- requirements.txt     # Python dependencies
|   |-- .env                 # Environment variables
|
|-- frontend/               # React/Vite frontend
|   |-- src/                 # React components
|   |-- package.json         # Node.js dependencies
|   |-- vite.config.ts       # Vite configuration
|
|-- start-dev.py            # Development server launcher
```

## Quick Start

### Option 1: Using the Development Launcher

```bash
python start-dev.py
```

This will give you options to start:
1. Backend only
2. Frontend only  
3. Both servers

### Option 2: Manual Start

#### Backend (Django)
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage_sample_data.py  # Optional: load sample data
python manage.py runserver
```

#### Frontend (React/Vite)
```bash
cd frontend
npm install
npm run dev
```

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/
- **API Documentation**: http://localhost:8000/docs/

## Backend Features

### Models
- **Category**: Nested categories for PC components
- **Product**: PC parts with specifications and pricing
- **Order**: Order management with payment processing

### API Endpoints
- `GET /api/categories/` - List categories
- `GET /api/products/` - List products with filters
- `POST /api/orders/` - Create orders
- `POST /api/orders/{id}/upload_receipt/` - Upload payment receipts

### Key Features
- **Security**: Backend-only price calculations, stock validation
- **Telegram Integration**: Order notifications
- **Admin Panel**: Complete management interface
- **API Documentation**: Swagger/ReDoc

## Frontend Features

### Technology Stack
- React with TypeScript
- Vite for development
- Tailwind CSS for styling
- shadcn/ui components

### Pages
- Home page with featured products
- Product catalog with filtering
- PC builder interface
- Shopping cart and checkout
- User dashboard

## Development

### Environment Setup

#### Backend (.env)
```env
# Django Settings
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (SQLite for development)
# DB_NAME=gamezonebuild
# DB_USER=postgres  
# DB_PASSWORD=postgres
# DB_HOST=localhost
# DB_PORT=5432

# Telegram Bot (optional)
BOT_TOKEN=your_telegram_bot_token
CHAT_ID=your_telegram_chat_id

# Payment Details
PAYMENT_CARD_NUMBER=8600 1234 5678 9012
PAYMENT_CARD_HOLDER=GAMEZONE BUILD
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=PC Builder
```

### Sample Data

Load sample PC components and orders:
```bash
cd backend
python manage_sample_data.py
```

This creates:
- 10 categories (Processors, Graphics Cards, etc.)
- 10 real products (Intel, AMD, NVIDIA components)
- 3 sample orders

## API Usage Examples

### Get Products
```javascript
const response = await fetch('http://localhost:8000/api/products/?category_slug=procesadores');
const data = await response.json();
```

### Create Order
```javascript
const order = {
  customer_name: "John Doe",
  phone: "+998901234567",
  email: "john@example.com",
  items: [
    {
      product_id: "uuid-here",
      quantity: 1
    }
  ]
};

const response = await fetch('http://localhost:8000/api/orders/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(order)
});
```

## Deployment

### Backend Production
1. Set `DEBUG=False`
2. Configure PostgreSQL database
3. Set `ALLOWED_HOSTS`
4. Use production WSGI server (Gunicorn)
5. Configure static files serving

### Frontend Production  
1. Build with `npm run build`
2. Serve static files with web server
3. Configure API base URL to production backend

## Testing

### Backend Tests
```bash
cd backend
python test_api.py  # API endpoint tests
python manage.py test  # Django tests
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:ui
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Backend CORS middleware is configured for localhost:3000
2. **Database Connection**: Uses SQLite by default, PostgreSQL optional
3. **Port Conflicts**: Backend uses 8000, Frontend uses 3000
4. **Dependencies**: Run `pip install -r requirements.txt` and `npm install`

### Reset Database
```bash
cd backend
rm db.sqlite3
python manage.py migrate
python manage_sample_data.py
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT License - see LICENSE file for details
