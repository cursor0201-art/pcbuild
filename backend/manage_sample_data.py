#!/usr/bin/env python
"""
Sample data creation script for GameZoneBuild
Run this script to populate the database with sample categories, products, and orders
"""

import os
import sys
import django
from decimal import Decimal
from uuid import uuid4

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GameZoneBuild.settings')
django.setup()

from shop.models import Category, Product, Order


def create_sample_categories():
    """Create sample product categories"""
    print("Creating sample categories...")
    
    categories_data = [
        {'name': 'Procesadores', 'slug': 'procesadores'},
        {'name': 'Tarjetas Gráficas', 'slug': 'tarjetas-graficas'},
        {'name': 'Memoria RAM', 'slug': 'memoria-ram'},
        {'name': 'Almacenamiento', 'slug': 'almacenamiento'},
        {'name': 'Placas Base', 'slug': 'placas-base'},
        {'name': 'Fuentes de Poder', 'slug': 'fuentes-de-poder'},
        {'name': 'Refrigeración', 'slug': 'refrigeracion'},
        {'name': 'Gabinetes', 'slug': 'gabinetes'},
        {'name': 'Monitores', 'slug': 'monitores'},
        {'name': 'Periféricos', 'slug': 'perifericos'},
    ]
    
    created_categories = []
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            slug=cat_data['slug'],
            defaults={'name': cat_data['name']}
        )
        created_categories.append(category)
        print(f"  {'Created' if created else 'Already exists'}: {category.name}")
    
    return created_categories


def create_sample_products():
    """Create sample products"""
    print("\nCreating sample products...")
    
    # Get categories
    categories = {cat.slug: cat for cat in Category.objects.all()}
    
    products_data = [
        # Procesadores
        {
            'name': 'Intel Core i9-13900K',
            'slug': 'intel-core-i9-13900k',
            'category': categories['procesadores'],
            'price': Decimal('5999000'),
            'brand': 'Intel',
            'specs': {
                'cores': '24 (8P + 16E)',
                'threads': '32',
                'base_clock': '3.0 GHz',
                'boost_clock': '5.8 GHz',
                'cache': '36MB Smart Cache',
                'socket': 'LGA 1700'
            },
            'stock': 15,
            'description': 'Procesador de alta gama para gaming y productividad'
        },
        {
            'name': 'AMD Ryzen 9 7950X',
            'slug': 'amd-ryzen-9-7950x',
            'category': categories['procesadores'],
            'price': Decimal('5499000'),
            'brand': 'AMD',
            'specs': {
                'cores': '16',
                'threads': '32',
                'base_clock': '4.5 GHz',
                'boost_clock': '5.7 GHz',
                'cache': '80MB L3',
                'socket': 'AM5'
            },
            'stock': 12,
            'description': 'Procesador AMD de 16 núcleos para máximo rendimiento'
        },
        
        # Tarjetas Gráficas
        {
            'name': 'NVIDIA GeForce RTX 4090',
            'slug': 'nvidia-geforce-rtx-4090',
            'category': categories['tarjetas-graficas'],
            'price': Decimal('12999000'),
            'brand': 'NVIDIA',
            'specs': {
                'memory': '24GB GDDR6X',
                'cuda_cores': '16384',
                'boost_clock': '2.52 GHz',
                'memory_interface': '384-bit',
                'power_consumption': '450W'
            },
            'stock': 8,
            'description': 'La tarjeta gráfica más potente del mercado'
        },
        {
            'name': 'AMD Radeon RX 7900 XTX',
            'slug': 'amd-radeon-rx-7900-xtx',
            'category': categories['tarjetas-graficas'],
            'price': Decimal('9999000'),
            'brand': 'AMD',
            'specs': {
                'memory': '24GB GDDR6',
                'stream_processors': '6144',
                'boost_clock': '2.5 GHz',
                'memory_interface': '384-bit',
                'power_consumption': '355W'
            },
            'stock': 10,
            'description': 'Tarjeta gráfica AMD de última generación'
        },
        
        # Memoria RAM
        {
            'name': 'Corsair Vengeance RGB Pro 32GB DDR4',
            'slug': 'corsair-vengeance-rgb-pro-32gb-ddr4',
            'category': categories['memoria-ram'],
            'price': Decimal('899000'),
            'brand': 'Corsair',
            'specs': {
                'capacity': '32GB (2x16GB)',
                'type': 'DDR4',
                'speed': '3600MHz',
                'latency': 'CL16',
                'voltage': '1.35V'
            },
            'stock': 25,
            'description': 'Memoria RAM DDR4 con iluminación RGB'
        },
        {
            'name': 'G.Skill Trident Z5 RGB 32GB DDR5',
            'slug': 'gskill-trident-z5-rgb-32gb-ddr5',
            'category': categories['memoria-ram'],
            'price': Decimal('1299000'),
            'brand': 'G.Skill',
            'specs': {
                'capacity': '32GB (2x16GB)',
                'type': 'DDR5',
                'speed': '6000MHz',
                'latency': 'CL30',
                'voltage': '1.35V'
            },
            'stock': 18,
            'description': 'Memoria RAM DDR5 de alta velocidad'
        },
        
        # Almacenamiento
        {
            'name': 'Samsung 980 PRO 2TB NVMe SSD',
            'slug': 'samsung-980-pro-2tb-nvme-ssd',
            'category': categories['almacenamiento'],
            'price': Decimal('1899000'),
            'brand': 'Samsung',
            'specs': {
                'capacity': '2TB',
                'interface': 'NVMe PCIe 4.0',
                'read_speed': '7000 MB/s',
                'write_speed': '5000 MB/s',
                'form_factor': 'M.2 2280'
            },
            'stock': 20,
            'description': 'SSD NVMe de ultra alta velocidad'
        },
        {
            'name': 'WD Black SN850X 1TB NVMe SSD',
            'slug': 'wd-black-sn850x-1tb-nvme-ssd',
            'category': categories['almacenamiento'],
            'price': Decimal('899000'),
            'brand': 'Western Digital',
            'specs': {
                'capacity': '1TB',
                'interface': 'NVMe PCIe 4.0',
                'read_speed': '7300 MB/s',
                'write_speed': '6600 MB/s',
                'form_factor': 'M.2 2280'
            },
            'stock': 30,
            'description': 'SSD gaming optimizado'
        },
        
        # Placas Base
        {
            'name': 'ASUS ROG Strix Z790-E Gaming WiFi',
            'slug': 'asus-rog-strix-z790-e-gaming-wifi',
            'category': categories['placas-base'],
            'price': Decimal('3299000'),
            'brand': 'ASUS',
            'specs': {
                'socket': 'LGA 1700',
                'chipset': 'Z790',
                'memory_support': 'DDR5 up to 7800MHz',
                'slots': '4x DDR5',
                'storage': '5x M.2, 6x SATA',
                'networking': '2.5G LAN + WiFi 6E'
            },
            'stock': 12,
            'description': 'Placa base premium para Intel 13th gen'
        },
        {
            'name': 'MSI MPG X670E Carbon WiFi',
            'slug': 'msi-mpg-x670e-carbon-wifi',
            'category': categories['placas-base'],
            'price': Decimal('2999000'),
            'brand': 'MSI',
            'specs': {
                'socket': 'AM5',
                'chipset': 'X670E',
                'memory_support': 'DDR5 up to 7600MHz',
                'slots': '4x DDR5',
                'storage': '5x M.2, 6x SATA',
                'networking': '2.5G LAN + WiFi 6E'
            },
            'stock': 10,
            'description': 'Placa base para AMD Ryzen 7000 series'
        }
    ]
    
    created_products = []
    for prod_data in products_data:
        product, created = Product.objects.get_or_create(
            slug=prod_data['slug'],
            defaults=prod_data
        )
        created_products.append(product)
        print(f"  {'Created' if created else 'Already exists'}: {product.name} - {product.price:,} UZS")
    
    return created_products


def create_sample_orders():
    """Create sample orders"""
    print("\nCreating sample orders...")
    
    products = list(Product.objects.filter(is_active=True))
    
    if len(products) < 2:
        print("  Not enough products to create orders")
        return []
    
    orders_data = [
        {
            'customer_name': 'Juan Pérez',
            'phone': '+998901234567',
            'email': 'juan.perez@email.com',
            'comment': 'Entregar en horario laboral',
            'items': [
                {
                    'product_id': str(products[0].id),
                    'name': products[0].name,
                    'price': float(products[0].price),
                    'quantity': 1
                },
                {
                    'product_id': str(products[1].id),
                    'name': products[1].name,
                    'price': float(products[1].price),
                    'quantity': 2
                }
            ],
            'status': 'confirmed'
        },
        {
            'customer_name': 'María García',
            'phone': '+998912345678',
            'email': 'maria.garcia@email.com',
            'comment': 'Por favor llamar antes de entregar',
            'items': [
                {
                    'product_id': str(products[2].id),
                    'name': products[2].name,
                    'price': float(products[2].price),
                    'quantity': 1
                }
            ],
            'status': 'waiting_for_payment'
        },
        {
            'customer_name': 'Carlos Rodríguez',
            'phone': '+998923456789',
            'comment': 'Pedido urgente',
            'items': [
                {
                    'product_id': str(products[3].id),
                    'name': products[3].name,
                    'price': float(products[3].price),
                    'quantity': 1
                },
                {
                    'product_id': str(products[4].id),
                    'name': products[4].name,
                    'price': float(products[4].price),
                    'quantity': 1
                }
            ],
            'status': 'checking'
        }
    ]
    
    created_orders = []
    for order_data in orders_data:
        # Calculate total
        total = sum(item['price'] * item['quantity'] for item in order_data['items'])
        order_data['total_price'] = Decimal(str(total))
        
        order, created = Order.objects.get_or_create(
            customer_name=order_data['customer_name'],
            phone=order_data['phone'],
            defaults=order_data
        )
        created_orders.append(order)
        print(f"  {'Created' if created else 'Already exists'}: Order {order.id} - {order.customer_name} - {order.total_price:,} UZS")
    
    return created_orders


def main():
    """Main function to create all sample data"""
    print("=== GameZoneBuild Sample Data Creation ===\n")
    
    try:
        # Create categories first
        categories = create_sample_categories()
        
        # Create products
        products = create_sample_products()
        
        # Create orders
        orders = create_sample_orders()
        
        print(f"\n=== Summary ===")
        print(f"Categories: {len(categories)}")
        print(f"Products: {len(products)}")
        print(f"Orders: {len(orders)}")
        print(f"\nSample data creation completed successfully!")
        
    except Exception as e:
        print(f"\nError creating sample data: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
