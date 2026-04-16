# GameZoneBuild - Backend API

Backend Django REST Framework para el constructor de PCs GameZoneBuild.

## Características

- **Gestión de Categorías**: Soporte de categorías anidadas para productos
- **Gestión de Productos**: Catálogo completo de componentes de PC con especificaciones técnicas
- **Sistema de Pedidos**: Flujo completo de pedidos con validación de stock
- **Procesamiento de Pagos**: Integración con sistema de pagos mediante recibos
- **Notificaciones Telegram**: Envío automático de notificaciones de pedidos
- **Panel de Administración**: Interfaz completa de administración Django
- **API RESTful**: Endpoints completos con documentación Swagger
- **Seguridad**: Validación de datos, protección contra manipulación de precios

## Tecnologías

- Django 4.2.7
- Django REST Framework 3.14.0
- PostgreSQL (con fallback a SQLite para desarrollo)
- python-telegram-bot para notificaciones
- Pillow para manejo de imágenes
- drf-yasg para documentación API

## Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd GameZoneBuild
```

### 2. Crear entorno virtual
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno
Copiar y editar el archivo `.env`:
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```env
# Django Settings
SECRET_KEY=django-insecure-gamezonebuild-secret-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (opcional - usa SQLite por defecto)
DB_NAME=gamezonebuild
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# Telegram Bot (requerido para notificaciones)
BOT_TOKEN=your_telegram_bot_token_here
CHAT_ID=your_telegram_chat_id_here

# Payment Details
PAYMENT_CARD_NUMBER=8600 1234 5678 9012
PAYMENT_CARD_HOLDER=GAMEZONE BUILD
```

### 5. Configurar Telegram Bot (Opcional pero recomendado)

1. Crear un bot en Telegram usando @BotFather
2. Obtener el token del bot
3. Obtener el chat ID:
   - Enviar un mensaje a tu bot
   - Visitar: `https://api.telegram.org/bot<TU_TOKEN>/getUpdates`
   - Buscar el `chat.id` en la respuesta

### 6. Migraciones y base de datos
```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Crear superusuario
```bash
python manage.py createsuperuser
```

### 8. Crear datos de muestra
```bash
python manage_sample_data.py
```

### 9. Iniciar servidor
```bash
python manage.py runserver
```

El servidor estará disponible en: http://127.0.0.1:8000/

## API Endpoints

### Categorías
- `GET /api/categories/` - Listar todas las categorías
- `POST /api/categories/` - Crear categoría (admin)
- `GET /api/categories/{id}/` - Detalles de categoría
- `PUT /api/categories/{id}/` - Actualizar categoría (admin)
- `DELETE /api/categories/{id}/` - Eliminar categoría (admin)
- `GET /api/categories/tree/` - Estructura de árbol de categorías
- `GET /api/categories/{id}/products/` - Productos de una categoría

### Productos
- `GET /api/products/` - Listar productos (con filtros)
- `POST /api/products/` - Crear producto (admin)
- `GET /api/products/{id}/` - Detalles de producto
- `PUT /api/products/{id}/` - Actualizar producto (admin)
- `DELETE /api/products/{id}/` - Eliminar producto (admin)
- `GET /api/products/featured/` - Productos destacados
- `GET /api/products/search/?q=termino` - Búsqueda avanzada
- `POST /api/products/{id}/update_stock/` - Actualizar stock (admin)

### Pedidos
- `POST /api/orders/` - Crear pedido
- `GET /api/orders/{id}/` - Detalles de pedido (admin)
- `POST /api/orders/{id}/upload_receipt/` - Subir recibo de pago
- `POST /api/orders/{id}/confirm/` - Confirmar pedido (admin)
- `POST /api/orders/{id}/cancel/` - Cancelar pedido (admin)
- `GET /api/orders/statistics/` - Estadísticas (admin)

## Filtros de Productos

### Query Parameters
- `category_slug` - Filtrar por slug de categoría
- `brand` - Filtrar por marca
- `min_price` - Precio mínimo
- `max_price` - Precio máximo
- `in_stock=true` - Solo productos con stock
- `search` - Búsqueda por nombre/descripción

Ejemplo:
```
GET /api/products/?category_slug=procesadores&brand=Intel&min_price=1000000&in_stock=true
```

## Panel de Administración

Acceder al panel de administración: http://127.0.0.1:8000/admin/

### Funcionalidades del Admin:
- **Gestión de Categorías**: Crear, editar, eliminar categorías anidadas
- **Gestión de Productos**: Catálogo completo con imágenes y especificaciones
- **Gestión de Pedidos**: Ver pedidos, cambiar estados, subir recibos
- **Acciones Masivas**: Confirmar/cancelar múltiples pedidos
- **Estadísticas**: Vista detallada de métricas de ventas

## Documentación API

- **Swagger UI**: http://127.0.0.1:8000/docs/
- **ReDoc**: http://127.0.0.1:8000/redoc/

## Flujo de Pedidos

1. **Creación del Pedido**
   ```json
   POST /api/orders/
   {
     "customer_name": "Juan Pérez",
     "phone": "+998901234567",
     "email": "juan@email.com",
     "comment": "Entregar en horario laboral",
     "items": [
       {
         "product_id": "uuid-del-producto",
         "quantity": 1
       }
     ]
   }
   ```

2. **Respuesta con Detalles de Pago**
   ```json
   {
     "success": true,
     "data": {
       "order": { ... },
       "payment_details": {
         "order_id": "uuid",
         "total_amount": 5999000,
         "card_number": "8600 1234 5678 9012",
         "card_holder": "GAMEZONE BUILD"
       }
     }
   }
   ```

3. **Subida de Recibo**
   ```bash
   curl -X POST \
     http://127.0.0.1:8000/api/orders/{order_id}/upload_receipt/ \
     -F "receipt_image=@path/to/receipt.jpg"
   ```

4. **Notificación Automática a Telegram**
   - Se envía mensaje con detalles del pedido
   - Se incluye imagen del recibo si está disponible

## Validaciones y Seguridad

### Validaciones Implementadas:
- **Teléfono**: Formato +998XXXXXXXXX obligatorio
- **Stock**: Verificación automática antes de crear pedido
- **Precios**: Cálculo exclusivo en backend (anti-manipulación)
- **Imágenes**: Validación de formato y tamaño
- **Permisos**: Protección de endpoints de administración

### Medidas de Seguridad:
- CORS configurado para desarrollo
- Validación de entrada de datos
- Protección contra inyección SQL
- Manejo seguro de archivos multimedia

## Estructura del Proyecto

```
GameZoneBuild/
|
|-- GameZoneBuild/          # Configuración principal
|   |-- settings.py         # Configuraciones del proyecto
|   |-- urls.py            # URLs principales
|   |-- wsgi.py            # WSGI config
|
|-- shop/                   # Aplicación principal
|   |-- models.py          # Modelos de datos
|   |-- serializers.py     # Serializadores API
|   |-- views.py           # ViewSets y lógica
|   |-- urls.py            # URLs de la app
|   |-- admin.py           # Configuración admin
|   |-- telegram_service.py # Servicio de notificaciones
|
|-- media/                  # Archivos multimedia
|-- requirements.txt        # Dependencias Python
|-- .env                   # Variables de entorno
|-- manage_sample_data.py   # Script de datos de muestra
```

## Datos de Muestra

El script `manage_sample_data.py` crea:

- **10 Categorías**: Procesadores, Tarjetas Gráficas, RAM, etc.
- **10 Productos**: Componentes reales de Intel, AMD, NVIDIA, etc.
- **3 Pedidos de ejemplo**: Diferentes estados y productos

## Deployment (Producción)

### Configuraciones Adicionales:
1. **DEBUG=False** en producción
2. Configurar **ALLOWED_HOSTS** con dominio real
3. Usar **PostgreSQL** en lugar de SQLite
4. Configurar **STATIC_ROOT** y **MEDIA_ROOT**
5. Setear **SECRET_KEY** único
6. Configurar servidor web (Nginx + Gunicorn)

### Variables de Entorno Producción:
```env
DEBUG=False
ALLOWED_HOSTS=tudominio.com,www.tudominio.com
SECRET_KEY=clave-secreta-muy-larga-y-aleatoria
DB_NAME=gamezonebuild_prod
DB_USER=usuario_prod
DB_PASSWORD=clave_segura
```

## Troubleshooting

### Problemas Comunes:

1. **Error de Telegram Bot**
   - Verificar token y chat_id en .env
   - Asegurar que el bot está activo
   - Probar con: `python manage.py shell` y usar TelegramService()

2. **Error de Base de Datos PostgreSQL**
   - Verificar que PostgreSQL está corriendo
   - Confirmar credenciales en .env
   - Usar SQLite si no se requiere PostgreSQL

3. **Error de Imágenes**
   - Verificar permisos de carpeta media/
   - Confirmar Pillow está instalado
   - Validar formato y tamaño de imágenes

4. **Error de Migraciones**
   - Eliminar db.sqlite3 y volver a migrar
   - Usar `python manage.py makemigrations --empty shop`

## Soporte

Para soporte técnico:
- Revisar logs del servidor Django
- Verificar configuración en .env
- Consultar documentación API en /docs/
- Revisar panel de administración en /admin/

## Licencia

Este proyecto está bajo licencia BSD.
