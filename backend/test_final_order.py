#!/usr/bin/env python
import os
import sys
import django
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GameZoneBuild.settings')
django.setup()

def test_final_order():
    print("Testing FINAL Order Creation...")
    print("=" * 50)
    
    # Get a real product
    from shop.models import Product
    products = Product.objects.filter(is_active=True)[:1]
    
    if not products:
        print("❌ No products found!")
        return
    
    product = products[0]
    print(f"Using product: {product.name} (ID: {product.id})")
    
    # Test order data with correct fields
    order_data = {
        "customer_name": "Test Customer",
        "phone": "+998900000000", 
        "email": "test@example.com",
        "comment": "Final test order",
        "items": [
            {
                "product_id": str(product.id),
                "name": product.name,
                "price": float(product.price),
                "quantity": 1
            }
        ]
    }
    
    print(f"Order data: {order_data}")
    
    try:
        url = "http://127.0.0.1:8000/api/orders/"
        headers = {
            "Content-Type": "application/json",
            "Origin": "http://localhost:5173"
        }
        
        print(f"Sending POST to: {url}")
        
        response = requests.post(url, json=order_data, headers=headers)
        
        print(f"Response Status: {response.status_code}")
        
        try:
            response_data = response.json()
            print(f"Response Data: {response_data}")
            
            if response.status_code == 200 and response_data.get('success'):
                print("✅ FINAL TEST PASSED!")
                print("Order creation working correctly!")
            else:
                print(f"❌ Test failed: {response_data.get('error', 'Unknown error')}")
                
        except Exception as e:
            print(f"❌ Failed to parse response: {e}")
            print(f"Raw response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error during test: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_final_order()
