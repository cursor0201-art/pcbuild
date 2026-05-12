from django.db import models
from django.core.validators import RegexValidator
from django.urls import reverse
import uuid


class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nombre de la categoría")
    slug = models.SlugField(max_length=100, unique=True, verbose_name="Slug")
    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='children',
        verbose_name="Categoría padre"
    )
    image = models.ImageField(
        upload_to='categories/', 
        blank=True, 
        null=True,
        verbose_name="Imagen de la categoría"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        ordering = ['name']

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return f'/api/categories/{self.slug}/'

    def get_children(self):
        return self.children.all()

    def is_parent(self):
        return self.parent is None

    def get_level(self):
        level = 0
        current = self
        while current.parent:
            level += 1
            current = current.parent
        return level


class Product(models.Model):
    CONDITION_CHOICES = [
        ('new', 'Nuevo'),
        ('used', 'Usado'),
        ('refurbished', 'Reacondicionado'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, verbose_name="Nombre del producto")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="Slug")
    category = models.ForeignKey(
        Category, 
        on_delete=models.PROTECT, 
        related_name='products',
        verbose_name="Categoría"
    )
    price = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        verbose_name="Precio (UZS)"
    )
    brand = models.CharField(max_length=100, verbose_name="Marca")
    specs = models.JSONField(default=dict, verbose_name="Especificaciones")
    description = models.TextField(blank=True, verbose_name="Descripción")
    image = models.ImageField(
        upload_to='products/', 
        blank=True, 
        null=True,
        verbose_name="Imagen del producto"
    )
    stock = models.PositiveIntegerField(default=0, verbose_name="Stock")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    condition = models.CharField(
        max_length=20, 
        choices=CONDITION_CHOICES, 
        default='new',
        verbose_name="Condición"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Producto"
        verbose_name_plural = "Productos"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['category']),
            models.Index(fields=['brand']),
            models.Index(fields=['price']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return f'/api/products/{self.id}/'

    def is_in_stock(self):
        return self.stock > 0

    def reduce_stock(self, quantity):
        if self.stock >= quantity:
            self.stock -= quantity
            self.save()
            return True
        return False

    def increase_stock(self, quantity):
        self.stock += quantity
        self.save()


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('waiting_for_payment', 'Esperando pago'),
        ('checking', 'Verificando pago'),
        ('confirmed', 'Confirmado'),
        ('cancelled', 'Cancelado'),
    ]

    phone_validator = RegexValidator(
        regex=r'^\+998\d{9}$',
        message="El número de teléfono debe empezar con +998 y tener 12 dígitos"
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer_name = models.CharField(max_length=100, verbose_name="Nombre del cliente")
    phone = models.CharField(
        max_length=13, 
        validators=[phone_validator],
        verbose_name="Teléfono"
    )
    email = models.EmailField(blank=True, verbose_name="Email")
    comment = models.TextField(blank=True, verbose_name="Comentarios")
    items = models.JSONField(verbose_name="Items del pedido")
    total_price = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        verbose_name="Precio total (UZS)"
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending',
        verbose_name="Estado"
    )
    receipt_image = models.ImageField(
        upload_to='receipts/', 
        blank=True, 
        null=True,
        verbose_name="Imagen del recibo"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Pedido"
        verbose_name_plural = "Pedidos"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['phone']),
        ]

    def __str__(self):
        return f"Pedido {self.id} - {self.customer_name}"

    def get_absolute_url(self):
        return f'/api/orders/{self.id}/'

    def calculate_total(self):
        """Calculate total price from items"""
        total = 0
        for item in self.items:
            total += item.get('price', 0) * item.get('quantity', 1)
        self.total_price = total
        self.save()
        return total

    def can_upload_receipt(self):
        return self.status == 'waiting_for_payment'

    def mark_as_checking(self):
        if self.receipt_image:
            self.status = 'checking'
            self.save()

    def confirm(self):
        self.status = 'confirmed'
        self.save()

    def cancel(self):
        self.status = 'cancelled'
        self.save()

    def get_items_summary(self):
        """Get formatted items summary for display"""
        summary = []
        for item in self.items:
            product_name = item.get('name', 'Producto desconocido')
            quantity = item.get('quantity', 1)
            price = item.get('price', 0)
            summary.append(f"{product_name} x{quantity} - {price:,} UZS")
        return summary
