#!/usr/bin/env python
import os
import sys
import django
import random

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GameZoneBuild.settings')
django.setup()

from shop.models import Product

def add_product_images():
    print("Adding images to products without images...")
    print("=" * 50)
    
    # Available images in media folder
    available_images = [
        'products/images_1.png',
        'products/images_2.png', 
        'products/images_3.png',
        'products/images_4.png',
        'products/images_5.png'
    ]
    
    products = Product.objects.all()
    updated_count = 0
    
    for product in products:
        if not product.image:
            # Assign random image
            random_image = random.choice(available_images)
            product.image = random_image
            product.save()
            print(f"Added image to {product.name}: {random_image}")
            updated_count += 1
        else:
            print(f"{product.name} already has image: {product.image}")
    
    print(f"\nUpdated {updated_count} products with images")
    
    # Verify
    print("\nVerification:")
    for product in products:
        print(f"{product.name}: {product.image}")

if __name__ == "__main__":
    add_product_images()
