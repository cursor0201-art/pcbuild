#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GameZoneBuild.settings')
django.setup()

from shop.models import Order
from shop.telegram_service import TelegramService

def test_new_format():
    print("Testing NEW Telegram format...")
    print("=" * 50)
    
    # Get latest order
    latest_order = Order.objects.all().order_by('-created_at').first()
    
    if not latest_order:
        print("No orders found!")
        return
    
    print(f"Latest order: {latest_order.id}")
    print(f"Customer: {latest_order.customer_name}")
    print(f"Items: {len(latest_order.items)}")
    
    # Test new Telegram service
    service = TelegramService()
    
    print("\nSending NEW format notification...")
    try:
        result = service.send_order_notification(latest_order)
        print(f"Send result: {result}")
        
        if result:
            print("NEW format Telegram notification sent successfully!")
            print("Photos should now be sent with captions 'Mahsulot: [product name]'")
        else:
            print("Failed to send NEW format notification")
            
    except Exception as e:
        print(f"Error sending NEW format notification: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_new_format()
