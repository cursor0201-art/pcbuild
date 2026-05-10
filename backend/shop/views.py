from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.conf import settings

from .models import Category, Product, Order

@csrf_exempt
def ping_view(request):
    response = JsonResponse({"status": "ok", "message": "Backend is alive!"})
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "*"
    return response

from .serializers import (
    CategorySerializer, CategoryCreateUpdateSerializer,
    ProductSerializer, ProductCreateUpdateSerializer,
    OrderSerializer, OrderUpdateSerializer, ReceiptUploadSerializer,
    PaymentDetailsSerializer
)
from .telegram_service import TelegramService


class CustomResponseMixin:
    """Mixin to provide custom response format"""
    
    def custom_response(self, data=None, error=None, status_code=status.HTTP_200_OK):
        return Response({
            'success': error is None,
            'data': data,
            'error': error
        }, status=status_code)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        # If response is already paginated, response.data will have 'results'
        return self.custom_response(data=response.data)

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return self.custom_response(data=response.data)

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            return self.custom_response(data=response.data, status_code=status.HTTP_201_CREATED)
        except Exception as e:
            return self.custom_response(error=str(e), status_code=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            response = super().update(request, *args, **kwargs)
            return self.custom_response(data=response.data)
        except Exception as e:
            return self.custom_response(error=str(e), status_code=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            super().destroy(request, *args, **kwargs)
            return self.custom_response(data={'message': 'Deleted successfully'})
        except Exception as e:
            return self.custom_response(error=str(e), status_code=status.HTTP_400_BAD_REQUEST)


class CategoryViewSet(CustomResponseMixin, viewsets.ModelViewSet):
    queryset = Category.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'slug']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CategoryCreateUpdateSerializer
        return CategorySerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.products.exists():
            return self.custom_response(
                error="Cannot delete category with existing products",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        if instance.children.exists():
            return self.custom_response(
                error="Cannot delete category with subcategories",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def tree(self, request):
        """Get category tree structure"""
        categories = Category.objects.filter(parent=None)
        serializer = CategorySerializer(categories, many=True)
        return self.custom_response(data=serializer.data)

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """Get products in this category"""
        category = self.get_object()
        products = Product.objects.filter(category=category, is_active=True)
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return self.custom_response(data=serializer.data)


class ProductViewSet(CustomResponseMixin, viewsets.ModelViewSet):
    queryset = Product.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'brand', 'condition', 'is_active']
    search_fields = ['name', 'brand', 'description']
    ordering_fields = ['name', 'price', 'created_at', 'stock']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = Product.objects.all()
        
        # Filter by category slug if provided
        category_slug = self.request.query_params.get('category_slug')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Filter in stock only
        in_stock = self.request.query_params.get('in_stock')
        if in_stock == 'true':
            queryset = queryset.filter(stock__gt=0)
        
        # Only show active products for non-admin users
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
        
        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products"""
        products = Product.objects.filter(is_active=True, stock__gt=0).order_by('-created_at')[:10]
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return self.custom_response(data=serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Advanced product search"""
        query = request.query_params.get('q', '')
        if not query:
            return self.custom_response(error="Search query is required")
        
        products = Product.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(brand__icontains=query) |
            Q(category__name__icontains=query)
        ).filter(is_active=True)
        
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return self.custom_response(data=serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def update_stock(self, request, pk=None):
        """Update product stock"""
        product = self.get_object()
        quantity = request.data.get('quantity')
        
        if quantity is None:
            return self.custom_response(error="Quantity is required")
        
        try:
            quantity = int(quantity)
            if quantity < 0:
                return self.custom_response(error="Quantity cannot be negative")
            
            product.stock = quantity
            product.save()
            
            serializer = ProductSerializer(product, context={'request': request})
            return self.custom_response(data=serializer.data)
        except ValueError:
            return self.custom_response(error="Invalid quantity format")


class OrderViewSet(CustomResponseMixin, viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'created_at']
    search_fields = ['customer_name', 'phone', 'email']
    ordering_fields = ['created_at', 'total_price']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAdminUser]  # Only admin can view orders
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [permissions.AllowAny]  # Anyone can create order
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return OrderUpdateSerializer
        elif self.action == 'upload_receipt':
            return ReceiptUploadSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        """Create order and return payment details"""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            order = serializer.save()
            
            # Send Telegram notification
            try:
                from shop.telegram_service import TelegramService
                telegram_service = TelegramService()
                telegram_service.send_order_notification(order)
            except Exception as e:
                print(f"Failed to send Telegram notification: {e}")
            
            # Return order with payment details
            payment_data = {
                'order_id': order.id,
                'total_amount': order.total_price,
                'card_number': settings.PAYMENT_CARD_NUMBER,
                'card_holder': settings.PAYMENT_CARD_HOLDER
            }
            
            payment_serializer = PaymentDetailsSerializer(payment_data)
            order_serializer = OrderSerializer(order, context={'request': request})
            
            return self.custom_response(data={
                'order': order_serializer.data,
                'payment_details': payment_serializer.data
            }, status_code=status.HTTP_201_CREATED)
            
        except Exception as e:
            return self.custom_response(error=str(e), status_code=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def upload_receipt(self, request, pk=None):
        """Upload receipt image for order"""
        order = self.get_object()
        
        if not order.can_upload_receipt():
            return self.custom_response(
                error="Receipt can only be uploaded for orders in 'waiting_for_payment' status",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(order, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Send notification to Telegram
        try:
            telegram_service = TelegramService()
            telegram_service.send_order_notification(order)
        except Exception as e:
            # Log error but don't fail the request
            print(f"Failed to send Telegram notification: {e}")
        
        # Return updated order
        order_serializer = OrderSerializer(order, context={'request': request})
        return self.custom_response(data=order_serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def confirm(self, request, pk=None):
        """Confirm order (admin only)"""
        order = self.get_object()
        order.confirm()
        
        # Send confirmation to Telegram
        try:
            telegram_service = TelegramService()
            telegram_service.send_order_confirmation(order)
        except Exception as e:
            print(f"Failed to send Telegram confirmation: {e}")
        
        serializer = OrderSerializer(order, context={'request': request})
        return self.custom_response(data=serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def cancel(self, request, pk=None):
        """Cancel order (admin only)"""
        order = self.get_object()
        
        # Restore stock for cancelled orders
        for item in order.items:
            try:
                from .models import Product
                product = Product.objects.get(id=item['product_id'])
                product.increase_stock(item['quantity'])
            except Product.DoesNotExist:
                continue
        
        order.cancel()
        serializer = OrderSerializer(order, context={'request': request})
        return self.custom_response(data=serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def test_telegram(self, request):
        """Test Telegram connection"""
        try:
            from shop.telegram_service import TelegramService
            telegram_service = TelegramService()
            
            # Send test message
            success = telegram_service.send_test_message()
            
            if success:
                return self.custom_response(data={'message': 'Test message sent successfully! Check your Telegram.'})
            else:
                return self.custom_response(
                    error="Failed to send test message. Check your TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Koyeb settings.",
                    status_code=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return self.custom_response(error=str(e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def statistics(self, request):
        """Get order statistics (admin only)"""
        from django.db.models import Count, Sum
        from datetime import datetime, timedelta
        
        stats = {
            'total_orders': Order.objects.count(),
            'pending_orders': Order.objects.filter(status='pending').count(),
            'waiting_payment': Order.objects.filter(status='waiting_for_payment').count(),
            'checking': Order.objects.filter(status='checking').count(),
            'confirmed': Order.objects.filter(status='confirmed').count(),
            'cancelled': Order.objects.filter(status='cancelled').count(),
            'total_revenue': Order.objects.filter(status='confirmed').aggregate(
                total=Sum('total_price'))['total'] or 0,
        }
        
        # Last 30 days stats
        thirty_days_ago = datetime.now() - timedelta(days=30)
        recent_orders = Order.objects.filter(created_at__gte=thirty_days_ago)
        stats['last_30_days_orders'] = recent_orders.count()
        stats['last_30_days_revenue'] = recent_orders.filter(
            status='confirmed').aggregate(total=Sum('total_price'))['total'] or 0
        
        return self.custom_response(data=stats)


from rest_framework.views import APIView
import json
import requests

class AIBuilderView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        prompt_text = request.data.get('prompt', '')
        history = request.data.get('history', []) # List of {role: 'user'|'assistant', content: '...'}
        
        if not prompt_text:
            return Response({'success': False, 'error': 'Prompt is required'}, status=status.HTTP_400_BAD_REQUEST)

        gemini_key = getattr(settings, 'GEMINI_API_KEY', None)
        if not gemini_key:
            return Response({'success': False, 'error': 'API key not configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 1. Gather all active products to present to the AI
        from shop.models import Category, Product
        import random
        
        categories = Category.objects.all()
        inventory_samples = []
        for cat in categories:
            # Get up to 8 random products for each category to provide variety
            products = list(Product.objects.filter(category=cat, is_active=True, stock__gt=0))
            if products:
                sample = random.sample(products, min(len(products), 8))
                for p in sample:
                    inventory_samples.append(f"- {p.name} (ID: {p.id}, Price: {p.price}, Category: {cat.slug})")
        
        inventory_text = "\n".join(inventory_samples)
        category_list = ", ".join([f"{c.name} (slug: {c.slug})" for c in categories])

        # 2. Build the exact system instructions
        full_prompt = f"""
        You are "GameZone AI Assistant", a friendly and expert PC building advisor. 
        Your goal is to help users choose parts or build a complete PC.
        
        REAL INVENTORY IN OUR STORE:
        {inventory_text}
        
        Available categories: {category_list}
        
        GUIDELINES:
        1. Be conversational and helpful. If the user asks a general question, answer it expert-like.
        2. If the user asks for a build or describes their needs (gaming, work, budget), recommend a FULL BUILD.
        3. If you recommend a build, you MUST provide a JSON object in your response.
        4. If you suggest a build, pick EXACTLY ONE product for each category from the REAL INVENTORY list above.
        5. Respond in the same language as the user (Russian or Uzbek).
        
        RESPONSE FORMAT:
        You must return a JSON with two fields:
        - "message": Your text response (advice, explanation, or asking if they like the build).
        - "build": (Optional) A map where keys are category slugs and values are the product IDs you picked.
        
        Example JSON:
        {{
          "message": "Для гейминга в 2К я рекомендую эту сбалансированную сборку...",
          "build": {{"cpu": "id-1", "gpu": "id-2", ...}}
        }}
        """

        def call_gemini(model_name, api_version='v1'):
            url = f"https://generativelanguage.googleapis.com/{api_version}/models/{model_name}:generateContent?key={gemini_key}"
            headers = {'Content-Type': 'application/json'}
            
            contents = []
            system_context = f"SYSTEM INSTRUCTIONS:\n{full_prompt}\n\n"
            
            if history:
                valid_history = [h for h in history if h.get('role') and h.get('content')]
                if valid_history and valid_history[0]['role'] != 'user':
                    contents.append({"role": "user", "parts": [{"text": "Hello, I have a question about PC parts."}]})
                
                for h in valid_history:
                    role = "user" if h['role'] == 'user' else 'model'
                    contents.append({"role": role, "parts": [{"text": h['content']}]})
                
                if contents[-1]['role'] == 'user':
                    contents[-1]['parts'][0]['text'] = f"{system_context}FOLLOW-UP: {prompt_text}"
                else:
                    contents.append({"role": "user", "parts": [{"text": f"{system_context}REQUEST: {prompt_text}"}]})
            else:
                contents.append({"role": "user", "parts": [{"text": f"{system_context}REQUEST: {prompt_text}"}]})

            payload = {"contents": contents}
            return requests.post(url, headers=headers, json=payload, timeout=20)

        try:
            # Try gemini-1.5-flash on v1 (more stable for non-beta features)
            r = call_gemini('gemini-1.5-flash', 'v1')
            
            # If v1 fails, try v1beta with -latest suffix
            if r.status_code != 200:
                print(f"Gemini v1 failed ({r.status_code}), trying v1beta with -latest...")
                r = call_gemini('gemini-1.5-flash-latest', 'v1beta')

            ai_response = None
            if r.status_code == 200:
                try:
                    r_data = r.json()
                    raw_text = r_data['candidates'][0]['content']['parts'][0]['text']
                    import re
                    import json
                    json_match = re.search(r'\{.*\}', raw_text, re.DOTALL)
                    if json_match:
                        ai_response = json.loads(json_match.group())
                    else:
                        ai_response = {"message": raw_text, "build": None}
                except Exception as e:
                    ai_response = {"message": f"AI Parse Error: {str(e)}", "build": None}
            else:
                error_detail = r.text[:500]
                return Response({
                    'success': False, 
                    'error': f"Gemini Error {r.status_code}: {error_detail}",
                }, status=status.HTTP_200_OK)

            # Resolve products
            result_build = None
            total_price = 0
            if ai_response.get('build'):
                result_build = {}
                for cat_slug, p_id in ai_response['build'].items():
                    try:
                        product = Product.objects.get(id=p_id)
                        serializer = ProductSerializer(product, context={'request': request})
                        data = serializer.data
                        price = float(product.price)
                        total_price += price
                        data['price'] = price
                        result_build[cat_slug] = data
                    except: continue

            return Response({
                'success': True,
                'message': ai_response.get('message', ''),
                'build': result_build,
                'total_price': total_price
            })

        except Exception as e:
            return Response({'success': False, 'error': f"Internal Error: {str(e)}"}, status=status.HTTP_200_OK)
