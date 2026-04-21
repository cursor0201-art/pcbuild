from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q
from django.conf import settings

from .models import Category, Product, Order
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
        if error:
            return Response({
                'success': False,
                'data': None,
                'error': error
            }, status=status_code)
        return Response({
            'success': True,
            'data': data,
            'error': None
        }, status=status_code)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
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
        if not prompt_text:
            return Response({'success': False, 'error': 'Prompt is required'}, status=status.HTTP_400_BAD_REQUEST)

        gemini_key = getattr(settings, 'GEMINI_API_KEY', None)
        if not gemini_key:
            return Response({'success': False, 'error': 'API key not configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 1. Gather all active products to present to the AI
        products = Product.objects.filter(is_active=True, stock__gt=0)
        product_list = []
        for p in products:
            product_list.append(f"ID: {p.id} | CAT: {p.category.slug} | Name: {p.name} | Price: {p.price} UZS | Specs: {p.specs}")

        products_text = "\n".join(product_list)

        # 2. Build the exact system instructions
        system_instruction = f"""You are an expert PC builder. The user wants a custom PC build based on this prompt: "{prompt_text}"

Here is the current inventory in the shop:
{products_text}

Task: Choose EXACTLY 1 component for each major category (cpu, gpu, motherboard, ram, storage, power-supply, case, cooling) to build a compatible and optimal PC fitting the user's prompt. Try to balance the budget gracefully. 
Rules:
1. ONLY USE IDs from the inventory list provided.
2. Return ONLY a valid JSON object map where keys are the category_slug and values are the chosen product ID string. No markdown formatting, no explanations, JUST raw JSON.
Example output:
{{"cpu": "uuid-here", "gpu": "uuid-here", "motherboard": "uuid-here"}}"""

        def call_gemini(model_name, api_version='v1beta'):
            url = f"https://generativelanguage.googleapis.com/{api_version}/models/{model_name}:generateContent?key={gemini_key}"
            headers = {'Content-Type': 'application/json'}
            # Extremely simple payload to test connectivity
            payload = {
                "contents": [{
                    "parts": [{
                        "text": f"User request: {user_prompt}\n\nReturn JSON only with component IDs for this PC build based on stock."
                    }]
                }]
            }
            return requests.post(url, headers=headers, json=payload, timeout=20)

        try:
            # Using the absolute best candidates from your diagnostic list
            models_to_try = [
                ('gemini-2.0-flash', 'v1beta'),
                ('gemini-flash-latest', 'v1beta'),
            ]
            
            last_error = None
            r = None
            
            for model, version in models_to_try:
                try:
                    print(f"AI BUILDER: Trying {model} on {version}...")
                    r = call_gemini(model, version)
                    if r.status_code == 200:
                        break 
                    else:
                        last_error = f"{model} ({version}) -> {r.status_code}"
                except Exception as e:
                    last_error = str(e)
                    continue

            if not r or r.status_code != 200:
                return Response({
                    'success': False, 
                    'error': f"ИИ недоступен. Ошибка: {last_error}"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            r_data = r.json()
            
            if 'error' in r_data:
                return Response({'success': False, 'error': f"Gemini Error: {r_data['error'].get('message', 'Unknown')}"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if we have candidates
            if not r_data.get('candidates') or not r_data['candidates'][0].get('content'):
                reason = r_data.get('promptFeedback', {}).get('blockReason', 'Safety filters or empty response')
                return Response({'success': False, 'error': f"ИИ не смог сгенерировать ответ. Причина: {reason}"}, status=status.HTTP_400_BAD_REQUEST)

            raw_text = r_data['candidates'][0]['content']['parts'][0]['text']
            
            # Clean possible markdown format
            raw_text = raw_text.replace("```json", "").replace("```", "").strip()
            
            try:
                chosen_ids = json.loads(raw_text)
            except json.JSONDecodeError:
                import re
                json_match = re.search(r'\{.*\}', raw_text, re.DOTALL)
                if json_match:
                    chosen_ids = json.loads(json_match.group())
                else:
                    return Response({'success': False, 'error': f"ИИ вернул неверный формат данных: {raw_text[:100]}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Retrieve components
            result_map = {}
            for cat_slug, p_id in chosen_ids.items():
                try:
                    if not p_id or len(str(p_id)) < 30:
                        continue
                        
                    product = Product.objects.get(id=p_id)
                    serializer = ProductSerializer(product, context={'request': request})
                    data = serializer.data
                    data['performance'] = 85 + (hash(str(p_id)) % 15)
                    result_map[cat_slug] = data
                except (Product.DoesNotExist, ValueError, Exception):
                    continue

            if not result_map:
                return Response({'success': False, 'error': "ИИ не подобрал ни одной детали или вернул неверные ID."}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'success': True, 'data': result_map})

        except requests.exceptions.Timeout:
            return Response({'success': False, 'error': "Нейросеть долго не отвечала (Тайм-аут). Попробуйте еще раз через минуту."}, status=status.HTTP_504_GATEWAY_TIMEOUT)
        except requests.exceptions.RequestException as e:
            return Response({'success': False, 'error': f"Ошибка запроса к ИИ: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            import traceback
            print(f"AI Builder ERROR: {str(e)}")
            print(traceback.format_exc())
            return Response({'success': False, 'error': f"Ошибка сервера: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
