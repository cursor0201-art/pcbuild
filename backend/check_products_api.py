#!/usr/bin/env python
import os
import sys
import django
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GameZoneBuild.settings')
django.setup()

def check_products_api():
    print("Checking products API...")
    print("=" * 50)
    
    try:
        # Check API endpoint
        response = requests.get('http://127.0.0.1:8000/api/products/')
        
        if response.status_code == 200:
            data = response.json()
            print(f"API Response Status: {response.status_code}")
            print(f"API Success: {data.get('success')}")
            
            if data.get('success'):
                products = data.get('data', {})
                if 'results' in products:
                    api_products = products['results']
                    print(f"Products returned by API: {len(api_products)}")
                    
                    print("\nAPI Products:")
                    for i, product in enumerate(api_products, 1):
                        print(f"  {i}. {product.get('name')} - {product.get('brand')}")
                else:
                    print("No 'results' in API response")
                    print(f"Data keys: {list(products.keys())}")
            else:
                print(f"API returned error: {data.get('error')}")
        else:
            print(f"API request failed with status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"Error checking API: {e}")
    
    # Compare with database
    print("\n" + "=" * 50)
    print("DATABASE COMPARISON:")
    
    from shop.models import Product
    db_products = Product.objects.filter(is_active=True)
    print(f"Active products in database: {db_products.count()}")
    
    print("\nDatabase Products:")
    for i, product in enumerate(db_products, 1):
        print(f"  {i}. {product.name} - {product.brand}")

if __name__ == "__main__":
    check_products_api()
