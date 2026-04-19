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
        {'name': 'Процессор', 'slug': 'processor'},
        {'name': 'Корпус', 'slug': 'korpus'},
        {'name': 'Материнская плата', 'slug': 'materinskaya-plata'},
        {'name': 'Система охлаждения', 'slug': 'sistema-ohlazhdeniya'},
        {'name': 'Оперативная память', 'slug': 'operativnaya-pamyat'},
        {'name': 'Твердотельный накопитель', 'slug': 'tverdotelnyj-nakopitel'},
        {'name': 'Блок питания', 'slug': 'blok-pitaniya'},
        {'name': 'SSD', 'slug': 'ssd'},
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
        {
            'name': 'Intel Core i7-14700',
            'slug': 'intel-core-i7-14700',
            'category_slug': 'processor',
            'price': 400000,
            'brand': 'Intel',
            'specs': {"socket": "LGA1700", "cores": 20, "threads": 28, "boost_clock": "5.4 GHz", "tdp": "65W"},
            'description': 'Intel Core i7-14700 — мощный процессор 14-го поколения с высокой производительностью для игр и работы, поддерживает современные технологии и подходит для сборок среднего и высокого уровня.',
            'stock': 6985,
        },
        {
            'name': 'Intel Core i3-10105F',
            'slug': 'intel-core-i3-10105f',
            'category_slug': 'processor',
            'price': 100000,
            'brand': 'Intel',
            'specs': {"socket": "LGA1200", "cores": 4, "threads": 8, "boost_clock": "4.4 GHz", "tdp": "65W"},
            'description': 'Intel Core i3-10105F — бюджетный процессор 10-го поколения без встроенной графики, подходит для недорогих игровых и офисных сборок с дискретной видеокартой.',
            'stock': 7002,
        },
        {
            'name': 'AMD Ryzen 5 3600',
            'slug': 'amd-ryzen-5-3600',
            'category_slug': 'processor',
            'price': 216000,
            'brand': 'AMD',
            'specs': {"socket": "AM4", "cores": 6, "threads": 12, "base_clock": "3.6 GHz", "boost_clock": "4.2 GHz", "cache": "32 MB", "tdp": "65W"},
            'description': 'AMD Ryzen 5 3600 — популярный 6-ядерный процессор с отличным балансом цены и производительности, подходит для игр и повседневных задач.',
            'stock': 3649,
        },
        {
            'name': 'Samsung 990 PRO 1TB',
            'slug': 'samsung-990-pro-1tb',
            'category_slug': 'ssd',
            'price': 420000,
            'brand': 'samsung',
            'specs': {"type": "NVMe SSD", "interface": "PCIe 4.0 x4", "capacity": "1TB", "form_factor": "M.2 2280", "read_speed": "7450 MB/s", "write_speed": "6900 MB/s"},
            'description': 'Samsung 990 PRO 1TB — высокоскоростной NVMe SSD для игровых и рабочих систем с отличной производительностью и быстрой загрузкой.',
            'stock': 993,
        },
        {
            'name': 'Kingston 1TB NVMe',
            'slug': 'kingston-1tb-nvme',
            'category_slug': 'ssd',
            'price': 312300,
            'brand': 'kingston',
            'specs': {"type": "NVMe SSD", "interface": "PCIe 3.0 / 4.0 x4", "capacity": "1TB", "form_factor": "M.2 2280", "read_speed": "до 3500–6000 MB/s", "write_speed": "до 3000–4000 MB/s", "memory_type": "3D NAND"},
            'description': 'Kingston 1TB NVMe — быстрый и доступный SSD для повседневных задач, игр и работы, обеспечивающий заметный прирост скорости по сравнению с обычными дисками.',
            'stock': 895,
        },
        {
            'name': 'Crucial 4TB NVMe',
            'slug': 'crucial-4tb-nvme',
            'category_slug': 'ssd',
            'price': 653000,
            'brand': 'crucial',
            'specs': {"type": "NVMe SSD", "interface": "PCIe 3.0 / 4.0 x4", "capacity": "4TB", "form_factor": "M.2 2280", "read_speed": "3500–5000 MB/s", "write_speed": "3000–4200 MB/s", "memory_type": "3D NAND (QLC)", "tbw": "≈800 TB"},
            'description': 'Crucial 4TB NVMe — вместительный SSD для хранения игр, видео и файлов с хорошей скоростью и выгодной ценой, подходит для обычных и игровых сборок.',
            'stock': 1007,
        },
        {
            'name': 'GIGABYTE P850GM',
            'slug': 'gigabyte-p850gm',
            'category_slug': 'blok-pitaniya',
            'price': 712000,
            'brand': 'gigabyte',
            'specs': {"power": "850W", "efficiency": "80+ Gold", "modular": True, "form_factor": "ATX", "fan": "120mm", "protection": "OVP, OPP, SCP, UVP, OCP, OTP"},
            'description': 'GIGABYTE P850GM — мощный модульный блок питания с высоким КПД, подходит для игровых ПК и сборок с производительными видеокартами.',
            'stock': 1068,
        },
        {
            'name': 'GameMax GM-600B',
            'slug': 'gamemax-gm-600b',
            'category_slug': 'blok-pitaniya',
            'price': 895000,
            'brand': 'gamemax',
            'specs': {"power": "600W", "efficiency": "80+ Bronze", "form_factor": "ATX", "fan": "140mm", "pfc": "Active PFC", "efficiency_rate": "до 85-87%", "protection": "OVP, UVP, OPP, OCP, SCP", "noise": "<25dB"},
            'description': 'GameMax GM-600B — доступный блок питания на 600W с базовой защитой и стандартной эффективностью, подходит для бюджетных ПК и офисных сборок.',
            'stock': 2008,
        },
        {
            'name': 'Cougar DarkBlader-G',
            'slug': 'cougar-darkblader-g',
            'category_slug': 'korpus',
            'price': 1200000,
            'brand': 'Cougar',
            'specs': {"type": "Mid Tower", "motherboard_support": "ATX, Micro-ATX, Mini-ITX", "material": "Steel + Tempered Glass", "color": "Black", "max_gpu_length": "≈400 mm", "cooling_support": "Air + Liquid", "fans_included": False, "front_panel": "USB 3.0, USB 2.0, Audio", "side_panel": "Tempered Glass"},
            'description': 'Cougar DarkBlader-G — стильный игровой корпус с агрессивным дизайном и стеклянной боковой панелью, подходит для мощных сборок с хорошим охлаждением.',
            'stock': 1001,
        },
        {
            'name': 'HIPER XG300 POLARIS',
            'slug': 'hiper-xg300-polaris',
            'category_slug': 'korpus',
            'price': 600000,
            'brand': 'Hiper',
            'specs': {"type": "Mid Tower", "motherboard_support": "ATX, Micro-ATX, Mini-ITX", "material": "Steel + Tempered Glass", "color": "Black", "max_gpu_length": "≈360 mm", "cooling_support": "Air", "fans_included": True, "fan_count": "3-4", "front_panel": "USB 3.0, USB 2.0, Audio", "side_panel": "Tempered Glass"},
            'description': 'HIPER XG300 POLARIS — доступный игровой корпус с подсветкой и предустановленными вентиляторами, подходит для бюджетных и средних сборок.',
            'stock': 998,
        },
        {
            'name': 'Axle H510',
            'slug': 'axle-h510',
            'category_slug': 'materinskaya-plata',
            'price': 298200,
            'brand': 'Axle',
            'specs': {"chipset": "H510", "socket": "LGA1200", "form_factor": "Micro-ATX", "memory_support": "DDR4", "memory_slots": 2, "max_memory": "64GB", "pcie": "PCIe 3.0", "storage": "SATA + M.2", "usb": "USB 3.0 / 2.0", "network": "Ethernet"},
            'description': 'Axle H510 — бюджетная материнская плата для процессоров Intel 10–11 поколения, подходит для простых и недорогих сборок.',
            'stock': 886,
        },
        {
            'name': 'Gigabyte H610M H DDR4',
            'slug': 'gigabyte-h610m-h-ddr4',
            'category_slug': 'materinskaya-plata',
            'price': 342000,
            'brand': 'Gigabyte',
            'specs': {"chipset": "H610", "socket": "LGA1700", "form_factor": "Micro-ATX", "memory_support": "DDR4", "memory_slots": 2, "max_memory": "64GB", "pcie": "PCIe 4.0", "storage": "M.2 + SATA", "usb": "USB 3.2 / 2.0", "network": "Gigabit Ethernet"},
            'description': 'Gigabyte H610M H DDR4 — базовая материнская плата для процессоров Intel 12–14 поколения, подходит для бюджетных и средних сборок без разгона.',
            'stock': 901,
        },
        {
            'name': 'Fujitsu',
            'slug': 'fujitsu',
            'category_slug': 'operativnaya-pamyat',
            'price': 360000,
            'brand': 'Fujitsu Primergy',
            'specs': {"type": "DDR4 / DDR5 RDIMM", "capacity": "16GB / 32GB", "ecc_support": "Yes (Registered ECC)", "frequency": "2666MHz / 3200MHz", "voltage": "1.2V", "rank": "1Rx4 / 2Rx4", "compatibility": "Fujitsu PRIMERGY TX/RX Series", "pins": "288-pin"},
            'description': 'Оригинальная серверная память Fujitsu с поддержкой ECC. Обеспечивает отказоустойчивость и стабильную работу баз данных и систем виртуализации в режиме 24/7.',
            'stock': 893,
        },
        {
            'name': 'Pullout DDR4 8GB',
            'slug': 'pullout-ddr4-8gb',
            'category_slug': 'operativnaya-pamyat',
            'price': 266300,
            'brand': 'Pullout',
            'specs': {"type": "DDR4", "capacity": "8GB", "form_factor": "DIMM / SO-DIMM", "frequency": "2400MHz / 2666MHz / 3200MHz", "voltage": "1.2V", "condition": "Pullout (Original/Used)", "pins": "288-pin (Desktop) / 260-pin (Laptop)", "ecc_support": "Non-ECC"},
            'description': 'Оригинальный модуль памяти, снятый с брендовых сборок (HP, Dell, Lenovo). Протестирован на стабильность, идеален для бюджетного апгрейда домашних и офисных ПК.',
            'stock': 897,
        },
        {
            'name': 'SSD Lexar 480GB SATA III',
            'slug': 'ssd-lexar-480gb-sata-iii',
            'category_slug': 'tverdotelnyj-nakopitel',
            'price': 321000,
            'brand': 'Lexar',
            'specs': {"capacity": "480GB", "interface": "SATA III (6Gb/s)", "form_factor": "2.5-inch", "read_speed": "up to 550MB/s", "write_speed": "up to 450MB/s", "nand_type": "3D TLC", "tbw": "approx. 128TB", "thickness": "7mm"},
            'description': 'Надежный SSD-накопитель для ускорения системы. В 10 раз быстрее обычных HDD, обеспечивает быстрый запуск Windows и программ. Подходит для ноутбуков и ПК.',
            'stock': 698,
        },
        {
            'name': 'Lexar NS100 1ТБ SSD SATA',
            'slug': 'lexar-ns100-1tb-ssd-sata',
            'category_slug': 'tverdotelnyj-nakopitel',
            'price': 269000,
            'brand': 'Lexar',
            'specs': {"model": "Lexar NS100", "capacity": "1TB", "interface": "SATA III (6Gb/s)", "form_factor": "2.5-inch", "read_speed": "up to 550MB/s", "write_speed": "up to 500MB/s", "nand_type": "3D TLC", "operating_temperature": "0°C to 70°C"},
            'description': 'Емкий и надежный SSD для хранения тяжелых игр и рабочих архивов. Отличается высокой скоростью чтения и встроенным мониторингом состояния диска через ПО Lexar Dash.',
            'stock': 892,
        },
        {
            'name': 'GI-H58U V2 PcCOOLER 194560887',
            'slug': 'gi-h58u-v2-pccooler-194560887',
            'category_slug': 'sistema-ohlazhdeniya',
            'price': 125000,
            'brand': 'Pccooler',
            'specs': {"model": "PCCooler GI-H58U V2", "socket": "LGA1700/1200/115X, AM4/AM5", "tdp": "240W", "heatpipes": 5, "fan_size": "120mm", "fan_speed": "1000-1800 RPM", "noise_level": "26.5 dBA", "airflow": "65 CFM", "dimensions": "126 x 84 x 157mm"},
            'description': 'Мощный башенный кулер с 5 медными тепловыми трубками и TDP 240 Вт. Тихий 120-мм вентилятор обеспечивает отличное охлаждение даже для «горячих» игровых процессоров.',
            'stock': 148,
        },
        {
            'name': 'SE-214-XT od 590',
            'slug': 'se-214-xt-od-590',
            'category_slug': 'sistema-ohlazhdeniya',
            'price': 230000,
            'brand': 'SE 24',
            'specs': {"model": "ID-COOLING SE-214-XT", "socket": "LGA1700/1200/115X, AM4/AM5", "tdp": "180W", "heatpipes": 4, "fan_size": "120mm", "fan_speed": "500-1500 RPM", "noise_level": "13.8-26.6 dBA", "height": "150mm", "backlight": "ARGB"},
            'description': 'Один из лучших бюджетных кулеров с прямым контактом тепловых трубок. Компактная высота 150 мм позволяет установить его в большинство корпусов, а ARGB-подсветка отлично дополнит игровой билд.',
            'stock': 1183,
        },
    ]
    
    created_products = []
    for prod_data in products_data:
        category_slug = prod_data.pop('category_slug')
        category = categories.get(category_slug)
        if not category:
            continue
            
        product, created = Product.objects.get_or_create(
            slug=prod_data['slug'],
            defaults={**prod_data, 'category': category}
        )
        created_products.append(product)
        print(f"  {'Created' if created else 'Already exists'}: {product.name}")
    
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
            'customer_name': 'Иван Иванов',
            'phone': '+998901234567',
            'email': 'ivan@email.com',
            'comment': 'Доставка в рабочее время',
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
            'customer_name': 'Мария Петрова',
            'phone': '+998912345678',
            'email': 'maria@email.com',
            'comment': 'Позвонить перед доставкой',
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
            'customer_name': 'Александр Сидоров',
            'phone': '+998923456789',
            'comment': 'Срочный заказ',
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
        print(f"  {'Created' if created else 'Already exists'}: Order {order.id} - {order.customer_name}")
    
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
