#!/usr/bin/env python
"""
API Test Script for GameZoneBuild
Tests all major API endpoints
"""

import requests
import json
import os
from uuid import uuid4

# Configuration
BASE_URL = "http://127.0.0.1:8000"
API_BASE = f"{BASE_URL}/api"


def test_endpoint(method, endpoint, data=None, files=None):
    """Test API endpoint and return response"""
    url = f"{API_BASE}{endpoint}"
    
    print(f"\n{'='*50}")
    print(f"Testing: {method} {url}")
    if data:
        print(f"Data: {json.dumps(data, indent=2, ensure_ascii=False)}")
    
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            if files:
                response = requests.post(url, data=data, files=files)
            else:
                response = requests.post(url, json=data)
        elif method == "PUT":
            response = requests.put(url, json=data)
        elif method == "DELETE":
            response = requests.delete(url)
        else:
            print(f"Unsupported method: {method}")
            return None
        
        print(f"Status Code: {response.status_code}")
        
        try:
            response_data = response.json()
            print(f"Response: {json.dumps(response_data, indent=2, ensure_ascii=False)}")
            return response_data
        except:
            print(f"Response: {response.text}")
            return response.text
            
    except requests.exceptions.ConnectionError:
        print("Connection Error - Make sure Django server is running!")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None


def main():
    """Main test function"""
    print("=== GameZoneBuild API Test Suite ===")
    print(f"Base URL: {BASE_URL}")
    
    # Test server connection
    print("\n" + "="*50)
    print("Testing server connection...")
    try:
        response = requests.get(BASE_URL)
        if response.status_code == 200:
            print("Server is running!")
        else:
            print(f"Server returned status: {response.status_code}")
    except:
        print("Server is not running. Start with: python manage.py runserver")
        return
    
    # 1. Test Categories
    print("\n" + "="*50)
    print("1. Testing Categories API")
    
    # Get all categories
    categories = test_endpoint("GET", "/categories/")
    
    if categories and categories.get('success'):
        category_data = categories['data']
        if category_data and len(category_data) > 0:
            first_category = category_data[0]
            print(f"Found {len(category_data)} categories")
            
            # Get category details
            test_endpoint("GET", f"/categories/{first_category['id']}/")
            
            # Get category products
            test_endpoint("GET", f"/categories/{first_category['id']}/products/")
            
            # Get category tree
            test_endpoint("GET", "/categories/tree/")
    
    # 2. Test Products
    print("\n" + "="*50)
    print("2. Testing Products API")
    
    # Get all products
    products = test_endpoint("GET", "/products/")
    
    if products and products.get('success'):
        product_data = products['data']
        if product_data and len(product_data) > 0:
            first_product = product_data['results'][0] if 'results' in product_data else product_data[0]
            print(f"Found {len(product_data.get('results', product_data))} products")
            
            # Get product details
            test_endpoint("GET", f"/products/{first_product['id']}/")
            
            # Test featured products
            test_endpoint("GET", "/products/featured/")
            
            # Test search
            test_endpoint("GET", "/products/search/?q=Intel")
            
            # Test filters
            test_endpoint("GET", "/products/?in_stock=true")
    
    # 3. Test Orders
    print("\n" + "="*50)
    print("3. Testing Orders API")
    
    # First get products to create order
    if products and products.get('success'):
        product_data = products['data']
        product_list = product_data.get('results', product_data) if isinstance(product_data, dict) else product_data
        
        if product_list and len(product_list) > 0:
            first_product = product_list[0]
            
            # Create order
            order_data = {
                "customer_name": "Test Customer",
                "phone": "+998901234567",
                "email": "test@example.com",
                "comment": "Test order",
                "items": [
                    {
                        "product_id": first_product['id'],
                        "quantity": 1
                    }
                ]
            }
            
            order_response = test_endpoint("POST", "/orders/", order_data)
            
            if order_response and order_response.get('success'):
                order_info = order_response['data']
                order_id = order_info['order']['id']
                print(f"Created order: {order_id}")
                
                # Get order details (will fail - admin only)
                test_endpoint("GET", f"/orders/{order_id}/")
                
                # Test receipt upload (create dummy file)
                dummy_receipt_path = "test_receipt.jpg"
                with open(dummy_receipt_path, 'wb') as f:
                    f.write(b'\xff\xd8\xff\xe0\x00\x10JFIF')  # Minimal JPEG header
                
                try:
                    with open(dummy_receipt_path, 'rb') as receipt_file:
                        files = {'receipt_image': receipt_file}
                        test_endpoint("POST", f"/orders/{order_id}/upload_receipt/", files=files)
                except:
                    print("Could not test receipt upload")
                
                # Clean up
                if os.path.exists(dummy_receipt_path):
                    os.remove(dummy_receipt_path)
    
    # 4. Test API Documentation
    print("\n" + "="*50)
    print("4. Testing API Documentation")
    
    # Test docs endpoints
    docs_response = test_endpoint("GET", "/../docs/")
    redoc_response = test_endpoint("GET", "/../redoc/")
    
    # 5. Test Admin Panel
    print("\n" + "="*50)
    print("5. Testing Admin Panel")
    
    try:
        admin_response = requests.get(f"{BASE_URL}/admin/")
        if admin_response.status_code == 200:
            print("Admin panel is accessible!")
        else:
            print(f"Admin panel returned: {admin_response.status_code}")
    except Exception as e:
        print(f"Admin panel error: {e}")
    
    # Summary
    print("\n" + "="*50)
    print("=== Test Summary ===")
    print("API endpoints tested:")
    print("  - Categories: GET, GET by ID, products, tree")
    print("  - Products: GET, GET by ID, featured, search, filters")
    print("  - Orders: POST, GET by ID, receipt upload")
    print("  - Documentation: Swagger, ReDoc")
    print("  - Admin Panel: Accessibility")
    print("\nFor full functionality:")
    print("  1. Set up Telegram bot in .env")
    print("  2. Create admin user: python manage.py createsuperuser")
    print("  3. Load sample data: python manage_sample_data.py")
    print("  4. Configure production settings for deployment")


if __name__ == "__main__":
    main()
