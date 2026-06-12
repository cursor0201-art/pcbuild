from django.contrib import admin, messages
from django.utils.html import format_html
from django.urls import reverse, path
from django.utils.safestring import mark_safe
from django.shortcuts import render, redirect
from .models import Category, Product, Order, ProductImage
import json
import re
import csv
import io

def cyrillic_slugify(text):
    rus = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z',
        'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
        'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh', 'З': 'Z',
        'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R',
        'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
        'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    }
    translit = "".join(rus.get(char, char) for char in text)
    slug = translit.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug).strip('-')
    return slug


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'parent', 'product_count', 'created_at', 'is_parent']
    list_filter = ['parent', 'created_at']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at', 'product_count_display']
    ordering = ['name']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'slug', 'parent')
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at', 'product_count_display'),
            'classes': ('collapse',)
        }),
    )
    
    def product_count(self, obj):
        return obj.products.filter(is_active=True).count()
    product_count.short_description = 'Активные товары'
    
    def product_count_display(self, obj):
        count = self.product_count(obj)
        return f"{count} активных товаров"
    product_count_display.short_description = 'Кол-во товаров'
    
    def is_parent(self, obj):
        return not obj.parent
    is_parent.boolean = True
    is_parent.short_description = 'Родительская'
    
    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('products', 'children')


class ProductFilter(admin.SimpleListFilter):
    title = 'Наличие'
    parameter_name = 'stock_status'
    
    def lookups(self, request, model_admin):
        return [
            ('in_stock', 'В наличии'),
            ('out_of_stock', 'Нет в наличии'),
            ('low_stock', 'Мало (< 5)'),
        ]
    
    def queryset(self, request, queryset):
        if self.value() == 'in_stock':
            return queryset.filter(stock__gt=0)
        elif self.value() == 'out_of_stock':
            return queryset.filter(stock=0)
        elif self.value() == 'low_stock':
            return queryset.filter(stock__gt=0, stock__lt=5)


from django import forms

class MultipleFileInput(forms.FileInput):
    allow_multiple_selected = True

class MultipleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("widget", MultipleFileInput(attrs={'multiple': True}))
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            return [single_file_clean(d, initial) for d in data]
        return single_file_clean(data, initial)


class ProductAdminForm(forms.ModelForm):
    additional_images = MultipleFileField(
        required=False,
        label="Добавить несколько дополнительных изображений",
        help_text="Вы можете выбрать сразу несколько файлов для загрузки."
    )

    class Meta:
        model = Product
        fields = '__all__'


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 100px; border-radius: 5px;" />',
                obj.image.url
            )
        return "Нет изображения"
    image_preview.short_description = "Предпросмотр"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    inlines = [ProductImageInline]

    list_display = [
        'name', 'category', 'brand', 'price', 'stock', 
        'is_active', 'condition', 'image_preview', 'created_at'
    ]
    list_filter = [
        'category', 'brand', 'condition', 'is_active', 
        'created_at', ProductFilter
    ]
    search_fields = ['name', 'brand', 'description', 'specs']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = [
        'created_at', 'updated_at', 'image_preview', 
        'formatted_price', 'stock_status'
    ]
    ordering = ['-created_at']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'slug', 'category', 'brand', 'condition')
        }),
        ('Цена и склад', {
            'fields': ('price', 'stock', 'is_active', 'formatted_price', 'stock_status')
        }),
        ('Детали', {
            'fields': ('description', 'specs')
        }),
        ('Изображение', {
            'fields': ('image', 'image_preview', 'additional_images')
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        files = request.FILES.getlist('additional_images')
        for f in files:
            ProductImage.objects.create(product=obj, image=f)

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('bulk-add/', self.admin_site.admin_view(self.bulk_add), name='shop_product_bulk_add'),
        ]
        return custom_urls + urls

    def bulk_add(self, request):
        if request.method == 'POST':
            action_type = request.POST.get('action_type')
            
            if action_type == 'text_list':
                category_id = request.POST.get('category')
                brand = request.POST.get('brand')
                price = request.POST.get('price')
                stock = request.POST.get('stock')
                names_text = request.POST.get('names', '')
                
                category = Category.objects.get(id=category_id)
                names = [n.strip() for n in names_text.split('\n') if n.strip()]
                
                created_count = 0
                for name in names:
                    base_slug = cyrillic_slugify(name)
                    slug = base_slug
                    counter = 1
                    while Product.objects.filter(slug=slug).exists():
                        slug = f"{base_slug}-{counter}"
                        counter += 1
                        
                    Product.objects.create(
                        category=category,
                        name=name,
                        slug=slug,
                        brand=brand,
                        price=price,
                        stock=stock,
                        is_active=True
                    )
                    created_count += 1
                
                messages.success(request, f"Успешно создано {created_count} товаров.")
                return redirect('admin:shop_product_changelist')
                
            elif action_type == 'csv_file':
                csv_file = request.FILES.get('csv_file')
                if not csv_file.name.endswith('.csv'):
                    messages.error(request, "Пожалуйста, загрузите файл формата CSV.")
                    return redirect(request.path)
                    
                try:
                    file_data = csv_file.read().decode('utf-8')
                    csv_data = csv.reader(io.StringIO(file_data), delimiter=',')
                    
                    try:
                        header = next(csv_data)
                    except StopIteration:
                        messages.error(request, "CSV файл пуст.")
                        return redirect(request.path)
                    
                    created_count = 0
                    for row in csv_data:
                        if len(row) < 5:
                            continue
                        name = row[0].strip()
                        category_slug = row[1].strip()
                        brand = row[2].strip()
                        price = row[3].strip()
                        stock = row[4].strip()
                        description = row[5].strip() if len(row) > 5 else name
                        
                        try:
                            category = Category.objects.get(slug=category_slug)
                        except Category.DoesNotExist:
                            try:
                                category = Category.objects.get(name__iexact=category_slug)
                            except Category.DoesNotExist:
                                category = Category.objects.first()
                                if not category:
                                    continue
                        
                        base_slug = cyrillic_slugify(name)
                        slug = base_slug
                        counter = 1
                        while Product.objects.filter(slug=slug).exists():
                            slug = f"{base_slug}-{counter}"
                            counter += 1
                            
                        Product.objects.create(
                            category=category,
                            name=name,
                            slug=slug,
                            brand=brand,
                            price=price,
                            stock=stock,
                            description=description,
                            is_active=True
                        )
                        created_count += 1
                        
                    messages.success(request, f"Успешно импортировано {created_count} товаров из CSV.")
                    return redirect('admin:shop_product_changelist')
                except Exception as e:
                    messages.error(request, f"Ошибка при разборе CSV: {str(e)}")
                    return redirect(request.path)

        categories = Category.objects.all()
        context = {
            **self.admin_site.each_context(request),
            'opts': self.model._meta,
            'categories': categories,
            'title': 'Массовое добавление товаров',
        }
        return render(request, 'admin/shop/product/bulk_add.html', context)
    
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover;" />',
                obj.image.url
            )
        return "Нет изображения"
    image_preview.short_description = 'Превью'
    
    def formatted_price(self, obj):
        if obj.price is None:
            return "0 UZS"
        return f"{obj.price:,.0f} UZS"
    formatted_price.short_description = 'Цена'
    
    def stock_status(self, obj):
        if obj.stock is None:
            return '<span style="color: gray;">Нет данных</span>'
        elif obj.stock == 0:
            return '<span style="color: red;">Нет в наличии</span>'
        elif obj.stock < 5:
            return format_html('<span style="color: orange;">Мало ({})</span>', obj.stock)
        else:
            return format_html('<span style="color: green;">В наличии ({})</span>', obj.stock)
    stock_status.short_description = 'Статус склада'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('category')
    
    actions = ['mark_as_active', 'mark_as_inactive', 'duplicate_product']
    
    def mark_as_active(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f"{queryset.count()} товаров активировано.")
    mark_as_active.short_description = "Активировать выбранные товары"
    
    def mark_as_inactive(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f"{queryset.count()} товаров деактивировано.")
    mark_as_inactive.short_description = "Деактивировать выбранные товары"
    
    def duplicate_product(self, request, queryset):
        for product in queryset:
            product.pk = None
            product.name = f"{product.name} (Копия)"
            product.slug = f"{product.slug}-copy"
            product.save()
        self.message_user(request, f"{queryset.count()} товаров скопировано.")
    duplicate_product.short_description = "Дублировать выбранные товары"


class OrderItemInline(admin.TabularInline):
    model = Order
    extra = 0
    can_delete = False
    verbose_name = "Товар в заказе"
    verbose_name_plural = "Товары в заказе"
    
    fields = ('product_name', 'quantity', 'price', 'total_price')
    readonly_fields = ('product_name', 'quantity', 'price', 'total_price')
    
    def product_name(self, obj):
        # Try to get from items JSON
        if hasattr(obj, 'items') and obj.items:
            return obj.items[0].get('name', 'Неизвестно')
        return "Неизвестно"
    
    def quantity(self, obj):
        if hasattr(obj, 'items') and obj.items:
            return obj.items[0].get('quantity', 1)
        return 1
    
    def price(self, obj):
        if hasattr(obj, 'items') and obj.items:
            return f"{obj.items[0].get('price', 0):,.0f} UZS"
        return "0 UZS"
    
    def total_price(self, obj):
        if hasattr(obj, 'items') and obj.items:
            item = obj.items[0]
            total = item.get('price', 0) * item.get('quantity', 1)
            return f"{total:,.0f} UZS"
        return "0 UZS"


def format_order_items(items):
    """Format order items for display"""
    if not items:
        return "Нет товаров"
    
    html = "<table style='width: 100%; border: 1px solid #ddd;'>"
    html += "<tr style='background: #f5f5f5;'><th>Товар</th><th>Кол-во</th><th>Цена</th><th>Итого</th></tr>"
    
    for item in items:
        name = item.get('name', 'Неизвестно')
        quantity = item.get('quantity', 1)
        price = item.get('price', 0)
        total = price * quantity
        
        html += f"""
        <tr>
            <td>{name}</td>
            <td>{quantity}</td>
            <td>{price:,.0f} UZS</td>
            <td>{total:,.0f} UZS</td>
        </tr>
        """
    
    html += "</table>"
    return mark_safe(html)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'customer_name', 'phone', 'total_price', 
        'status', 'items_count', 'receipt_image_preview', 'created_at'
    ]
    list_filter = [
        'status', 'created_at'
    ]
    search_fields = ['customer_name', 'phone', 'email']
    readonly_fields = [
        'id', 'total_price', 'created_at', 'updated_at',
        'items_display', 'receipt_image_preview', 'formatted_total'
    ]
    ordering = ['-created_at']
    
    fieldsets = (
        ('Информация о заказе', {
            'fields': ('id', 'customer_name', 'phone', 'email', 'status')
        }),
        ('Детали заказа', {
            'fields': ('items_display', 'formatted_total', 'comment')
        }),
        ('Чек оплаты', {
            'fields': ('receipt_image', 'receipt_image_preview')
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def items_count(self, obj):
        if obj.items:
            return len(obj.items)
        return 0
    items_count.short_description = 'Кол-во товаров'
    
    def items_display(self, obj):
        return format_order_items(obj.items)
    items_display.short_description = 'Товары в заказе'
    
    def formatted_total(self, obj):
        return f"{obj.total_price:,.0f} UZS"
    formatted_total.short_description = 'Итого'
    
    def receipt_image_preview(self, obj):
        if obj.receipt_image:
            return format_html(
                '<a href="{}" target="_blank"><img src="{}" style="width: 100px; height: 100px; object-fit: cover;" /></a>',
                obj.receipt_image.url,
                obj.receipt_image.url
            )
        return "Нет чека"
    receipt_image_preview.short_description = 'Превью чека'
    
    actions = ['confirm_orders', 'cancel_orders']
    
    def confirm_orders(self, request, queryset):
        confirmed = 0
        for order in queryset:
            if order.status in ['pending', 'waiting_for_payment', 'checking']:
                order.confirm()
                confirmed += 1
        self.message_user(request, f"{confirmed} заказов подтверждено.")
    confirm_orders.short_description = "Подтвердить выбранные заказы"
    
    def cancel_orders(self, request, queryset):
        cancelled = 0
        for order in queryset:
            if order.status not in ['confirmed', 'cancelled']:
                # Restore stock
                for item in order.items:
                    try:
                        product = Product.objects.get(id=item['product_id'])
                        product.increase_stock(item['quantity'])
                    except Product.DoesNotExist:
                        continue
                
                order.cancel()
                cancelled += 1
        self.message_user(request, f"{cancelled} заказов отменено (склад восстановлен).")
    cancel_orders.short_description = "Отменить выбранные заказы"
    
    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']  # Remove default delete action
        return actions
    
    def has_delete_permission(self, request, obj=None):
        # Prevent deletion of orders to maintain data integrity
        return False


# Customize admin site
admin.site.site_header = "GameZoneBuild — Панель управления"
admin.site.site_title = "GameZoneBuild Админ"
admin.site.index_title = "Добро пожаловать в панель управления"
