from rest_framework import serializers
from .models import Category, Product, Order
from django.conf import settings


class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    level = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'parent', 'children', 
            'level', 'product_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_children(self, obj):
        children = obj.get_children()
        return CategorySerializer(children, many=True).data

    def get_level(self, obj):
        return obj.get_level()

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class CategoryCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name', 'slug', 'parent']

    def validate_slug(self, value):
        if Category.objects.filter(slug=value).exists():
            if self.instance and self.instance.slug != value:
                raise serializers.ValidationError("Slug must be unique")
        return value

    def validate_parent(self, value):
        if value and self.instance:
            # Prevent circular references
            if value == self.instance:
                raise serializers.ValidationError("Category cannot be its own parent")
            # Check if setting this parent would create a loop
            current = value
            while current.parent:
                if current.parent == self.instance:
                    raise serializers.ValidationError("Cannot create circular reference")
                current = current.parent
        return value


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    image_url = serializers.SerializerMethodField()
    is_in_stock = serializers.BooleanField(read_only=True)
    formatted_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'category_name', 'category_slug',
            'price', 'formatted_price', 'brand', 'specs', 'description',
            'image', 'image_url', 'stock', 'is_in_stock', 'is_active',
            'condition', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return f"{settings.MEDIA_URL}{obj.image}"
        return None

    def get_formatted_price(self, obj):
        return f"{obj.price:,.0f} UZS"


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'name', 'slug', 'category', 'price', 'brand', 'specs',
            'description', 'image', 'stock', 'is_active', 'condition'
        ]

    def validate_slug(self, value):
        if Product.objects.filter(slug=value).exists():
            if self.instance and self.instance.slug != value:
                raise serializers.ValidationError("Slug must be unique")
        return value

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative")
        return value

    def validate_image(self, value):
        if value:
            # Validate image size (max 5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Image size cannot exceed 5MB")
            
            # Validate image format
            allowed_formats = ['JPEG', 'PNG', 'WebP']
            if value.image.format not in allowed_formats:
                raise serializers.ValidationError(
                    f"Image format must be one of: {', '.join(allowed_formats)}"
                )
        return value


class OrderItemSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    name = serializers.CharField(max_length=200)
    price = serializers.DecimalField(max_digits=12, decimal_places=2)
    quantity = serializers.IntegerField(min_value=1)
    
    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        return value


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    items_summary = serializers.SerializerMethodField()
    formatted_total = serializers.SerializerMethodField()
    receipt_image_url = serializers.SerializerMethodField()
    can_upload_receipt = serializers.BooleanField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'customer_name', 'phone', 'email', 'comment', 'items',
            'items_summary', 'total_price', 'formatted_total', 'status',
            'receipt_image', 'receipt_image_url', 'can_upload_receipt',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'total_price', 'status', 'receipt_image', 
            'created_at', 'updated_at'
        ]

    def get_items_summary(self, obj):
        return obj.get_items_summary()

    def get_formatted_total(self, obj):
        return f"{obj.total_price:,.0f} UZS"

    def get_receipt_image_url(self, obj):
        if obj.receipt_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.receipt_image.url)
            return f"{settings.MEDIA_URL}{obj.receipt_image}"
        return None

    def validate_phone(self, value):
        # Phone validation is handled by the model validator
        return value

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Order must contain at least one item")
        
        # Validate that all product IDs exist and are active
        product_ids = [item['product_id'] for item in value]
        products = Product.objects.filter(id__in=product_ids, is_active=True)
        
        if len(products) != len(product_ids):
            found_ids = set(str(p.id) for p in products)
            missing_ids = set(str(pid) for pid in product_ids) - found_ids
            raise serializers.ValidationError(
                f"Products not found or inactive: {', '.join(missing_ids)}"
            )
        
        # Check stock availability
        for item in value:
            product = next((p for p in products if str(p.id) == str(item['product_id'])), None)
            if product and product.stock < item['quantity']:
                raise serializers.ValidationError(
                    f"Not enough stock for product '{product.name}'. "
                    f"Available: {product.stock}, Requested: {item['quantity']}"
                )
        
        return value

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Calculate total price from items (backend-only calculation)
        total_price = 0
        validated_items = []
        
        for item_data in items_data:
            product = Product.objects.get(id=item_data['product_id'])
            
            # Use current product price from database (prevent price manipulation)
            current_price = product.price
            quantity = item_data['quantity']
            
            # Validate stock again
            if product.stock < quantity:
                raise serializers.ValidationError(
                    f"Not enough stock for product '{product.name}'"
                )
            
            # Reduce stock
            product.reduce_stock(quantity)
            
            # Create item with backend price
            item = {
                'product_id': str(product.id),
                'name': product.name,
                'price': float(current_price),
                'quantity': quantity
            }
            validated_items.append(item)
            total_price += current_price * quantity
        
        # Create order with calculated total
        order = Order.objects.create(
            **validated_data,
            items=validated_items,
            total_price=total_price,
            status='waiting_for_payment'  # Set status to waiting for payment
        )
        
        return order


class OrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status', 'comment']
    
    def validate_status(self, value):
        current_status = self.instance.status
        
        # Define valid status transitions
        valid_transitions = {
            'pending': ['waiting_for_payment', 'cancelled'],
            'waiting_for_payment': ['checking', 'cancelled'],
            'checking': ['confirmed', 'cancelled'],
            'confirmed': [],  # Final state
            'cancelled': [],  # Final state
        }
        
        if value not in valid_transitions.get(current_status, []):
            raise serializers.ValidationError(
                f"Cannot change status from '{current_status}' to '{value}'"
            )
        
        return value


class ReceiptUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['receipt_image']
    
    def validate_receipt_image(self, value):
        if value:
            # Validate image size (max 10MB for receipts)
            if value.size > 10 * 1024 * 1024:
                raise serializers.ValidationError("Receipt image size cannot exceed 10MB")
            
            # Validate image format
            allowed_formats = ['JPEG', 'PNG', 'WebP']
            if value.image.format not in allowed_formats:
                raise serializers.ValidationError(
                    f"Image format must be one of: {', '.join(allowed_formats)}"
                )
        return value
    
    def validate(self, attrs):
        if not self.instance.can_upload_receipt():
            raise serializers.ValidationError(
                "Receipt can only be uploaded for orders in 'waiting_for_payment' status"
            )
        return attrs
    
    def update(self, instance, validated_data):
        instance.receipt_image = validated_data.get('receipt_image')
        instance.save()
        
        # Auto-update status to checking
        instance.mark_as_checking()
        
        return instance


class PaymentDetailsSerializer(serializers.Serializer):
    card_number = serializers.CharField(read_only=True)
    card_holder = serializers.CharField(read_only=True)
    order_id = serializers.UUIDField(read_only=True)
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    formatted_amount = serializers.SerializerMethodField()
    
    def get_formatted_amount(self, obj):
        return f"{obj['total_amount']:,.0f} UZS"
