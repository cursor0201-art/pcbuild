#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GameZoneBuild.settings')
django.setup()

from shop.models import Order, Product
from shop.telegram_service import TelegramService

def debug_photos():
    print("Debugging photo sending...")
    print("=" * 50)
    
    # Get latest order
    latest_order = Order.objects.all().order_by('-created_at').first()
    
    if not latest_order:
        print("No orders found!")
        return
    
    print(f"Latest order: {latest_order.id}")
    print(f"Items in order: {len(latest_order.items)}")
    
    # Check each item for photos
    for i, item in enumerate(latest_order.items):
        print(f"\nItem {i+1}: {item['name']}")
        print(f"  Product ID: {item['product_id']}")
        
        try:
            product = Product.objects.get(id=item['product_id'])
            print(f"  Product found: {product.name}")
            print(f"  Image field: {product.image}")
            print(f"  Image URL: {product.image.url if product.image else 'None'}")
            print(f"  Image path: {product.image.path if product.image else 'None'}")
            
            # Check if file exists
            if product.image:
                import os
                if hasattr(product.image, 'path') and os.path.exists(product.image.path):
                    print(f"  File exists: YES")
                else:
                    print(f"  File exists: NO")
        except Product.DoesNotExist:
            print(f"  Product NOT found!")
        except Exception as e:
            print(f"  Error checking product: {e}")
    
    # Test photo sending
    print(f"\nTesting photo sending...")
    service = TelegramService()
    
    for item in latest_order.items:
        try:
            product = Product.objects.get(id=item['product_id'])
            if product.image:
                print(f"\nTrying to send photo for: {product.name}")
                result = service.send_photo(product.image.path, f"Test: {product.name}")
                print(f"Send result: {result}")
        except Exception as e:
            print(f"Error sending photo: {e}")

if __name__ == "__main__":
    debug_photos()
