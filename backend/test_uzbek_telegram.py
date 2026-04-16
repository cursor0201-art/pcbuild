#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GameZoneBuild.settings')
django.setup()

from shop.models import Order
from shop.telegram_service import TelegramService

def test_uzbek_telegram():
    print("Testing Uzbek Telegram notifications...")
    print("=" * 50)
    
    # Get latest order
    latest_order = Order.objects.all().order_by('-created_at').first()
    
    if not latest_order:
        print("❌ No orders found!")
        return
    
    print(f"Testing with order: {latest_order.id}")
    print(f"Customer: {latest_order.customer_name}")
    print(f"Items: {len(latest_order.items)}")
    
    # Test updated Telegram service
    service = TelegramService()
    
    print("\nSending Uzbek notification...")
    try:
        result = service.send_order_notification(latest_order)
        print(f"Send result: {result}")
        
        if result:
            print("✅ Uzbek Telegram notification sent successfully!")
            print("Check your Telegram for the new format!")
        else:
            print("❌ Failed to send Uzbek notification")
            
    except Exception as e:
        print(f"❌ Error sending Uzbek notification: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_uzbek_telegram()
