#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GameZoneBuild.settings')
django.setup()

from shop.models import Order
from shop.telegram_service import TelegramService

def debug_latest_order():
    print("Debugging latest order and Telegram...")
    print("=" * 50)
    
    # Get latest order
    latest_order = Order.objects.all().order_by('-created_at').first()
    
    if not latest_order:
        print("No orders found!")
        return
    
    print(f"Latest order: {latest_order.id}")
    print(f"Customer: {latest_order.customer_name}")
    print(f"Phone: {latest_order.phone}")
    print(f"Items: {len(latest_order.items)}")
    print(f"Created: {latest_order.created_at}")
    
    # Test Telegram service
    print("\nTesting Telegram service...")
    service = TelegramService()
    
    print(f"Bot Token configured: {bool(service.bot_token)}")
    print(f"Chat ID configured: {bool(service.chat_id)}")
    print(f"Is configured: {service.is_configured()}")
    
    if service.is_configured():
        print("\nAttempting to send order notification...")
        try:
            result = service.send_order_notification(latest_order)
            print(f"Send result: {result}")
            
            if result:
                print("Telegram notification sent successfully!")
            else:
                print("Failed to send Telegram notification")
                
        except Exception as e:
            print(f"Error sending Telegram notification: {e}")
            import traceback
            traceback.print_exc()
    else:
        print("Telegram service not configured properly")

if __name__ == "__main__":
    debug_latest_order()
