#!/usr/bin/env python
import os
import sys
import django
import json
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GameZoneBuild.settings')
django.setup()

def test_fixed_order():
    print("Testing FIXED Order Creation...")
    print("=" * 50)
    
    # Get a real product ID from database
    from shop.models import Product
    products = Product.objects.filter(is_active=True)[:1]
    
    if not products:
        print("❌ No products found in database!")
        return
    
    real_product = products[0]
    print(f"Using real product: {real_product.name} (ID: {real_product.id})")
    
    # Fixed order data with proper fields
    order_data = {
        "customer_name": "Test Customer",
        "phone": "+998900000000", 
        "email": "test@example.com",
        "comment": "Test order from FIXED script",
        "items": [
            {
                "product_id": str(real_product.id),  # Real UUID
                "name": real_product.name,           # Required field
                "price": float(real_product.price),     # Required field
                "quantity": 1
            }
        ]
    }
    
    print(f"Fixed order data: {json.dumps(order_data, indent=2)}")
    
    try:
        # Test API endpoint
        url = "http://127.0.0.1:8000/api/orders/"
        headers = {
            "Content-Type": "application/json",
            "Origin": "http://localhost:5173"
        }
        
        print(f"\nSending POST to: {url}")
        
        response = requests.post(url, json=order_data, headers=headers)
        
        print(f"\nResponse Status: {response.status_code}")
        
        try:
            response_data = response.json()
            print(f"Response Data: {json.dumps(response_data, indent=2)}")
            
            if response.status_code == 200 and response_data.get('success'):
                print("✅ FIXED Order creation test PASSED!")
                print(f"Order ID: {response_data.get('data', {}).get('id', 'N/A')}")
            else:
                print(f"❌ Order creation test FAILED")
                print(f"Error: {response_data.get('error', 'Unknown error')}")
                
        except Exception as e:
            print(f"❌ Failed to parse response: {e}")
            print(f"Raw response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error during test: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_fixed_order()
