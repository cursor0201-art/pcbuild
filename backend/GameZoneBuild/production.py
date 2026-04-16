"""
Production settings for GameZoneBuild project.
"""

from .settings import *
import os

# SECURITY SETTINGS
DEBUG = False
SECRET_KEY = os.getenv('SECRET_KEY', 'your-production-secret-key-here')

# ALLOWED HOSTS
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# DATABASE CONFIGURATION
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'pcbuilder_db'),
        'USER': os.getenv('DB_USER', 'pcbuilder_user'),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# CORS SETTINGS
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')

# STATIC AND MEDIA FILES
STATIC_URL = '/static/'
STATIC_ROOT = '/app/staticfiles/'

MEDIA_URL = '/media/'
MEDIA_ROOT = '/app/media/'

# SECURITY MIDDLEWARE
MIDDLEWARE += [
    'django.middleware.security.SecurityMiddleware',
]

# SECURITY HEADERS
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# SESSION COOKIES
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Strict'

# CSRF COOKIES
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Strict'

# LOGGING
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/app/logs/django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
        'shop': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
