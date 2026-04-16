#!/usr/bin/env python
import os
import sys
import django
import json
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GameZoneBuild.settings')
django.setup()

def test_order_creation():
    print("Testing Order Creation...")
    print("=" * 50)
    
    # Test order data
    order_data = {
        "customer_name": "Test Customer",
        "phone": "+998900000000", 
        "email": "test@example.com",
        "comment": "Test order from script",
        "items": [
            {
                "product_id": "1",
                "quantity": 1
            }
        ]
    }
    
    print(f"Order data: {json.dumps(order_data, indent=2)}")
    
    try:
        # Test API endpoint
        url = "http://127.0.0.1:8000/api/orders/"
        headers = {
            "Content-Type": "application/json",
            "Origin": "http://localhost:5173"
        }
        
        print(f"\nSending POST to: {url}")
        print(f"Headers: {headers}")
        
        response = requests.post(url, json=order_data, headers=headers)
        
        print(f"\nResponse Status: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        try:
            response_data = response.json()
            print(f"Response Data: {json.dumps(response_data, indent=2)}")
        except:
            print(f"Response Text: {response.text}")
            
        if response.status_code == 200:
            print("✅ Order creation test PASSED!")
        else:
            print(f"❌ Order creation test FAILED with status {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error during test: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_order_creation()
