"""
CORS configuration for frontend integration
"""

from django.conf import settings
from django.middleware.csrf import CsrfViewMiddleware
from django.http import HttpResponse


class CorsMiddleware:
    """
    CORS middleware for development
    """
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Add CORS headers for development
        if settings.DEBUG:
            response = self.get_response(request)
            
            # Allow frontend origin
            response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
            response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-CSRFToken'
            response['Access-Control-Allow-Credentials'] = 'true'
            
            # Handle preflight requests
            if request.method == 'OPTIONS':
                return HttpResponse(status=200)
                
            return response
        
        return self.get_response(request)
