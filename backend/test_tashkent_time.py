#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GameZoneBuild.settings')
django.setup()

from shop.models import Order
from shop.telegram_service import TelegramService
from django.utils import timezone
import pytz

def test_tashkent_time():
    print("Testing Tashkent timezone in Telegram messages...")
    print("=" * 50)
    
    # Get latest order
    latest_order = Order.objects.all().order_by('-created_at').first()
    
    if not latest_order:
        print("No orders found!")
        return
    
    print(f"Latest order: {latest_order.id}")
    print(f"Original created_at: {latest_order.created_at}")
    print(f"Original timezone: {latest_order.created_at.tzinfo}")
    
    # Convert to Tashkent time
    tashkent_time = timezone.localtime(latest_order.created_at, pytz.timezone('Asia/Tashkent'))
    print(f"Tashkent time: {tashkent_time}")
    print(f"Tashkent timezone: {tashkent_time.tzinfo}")
    print(f"Formatted: {tashkent_time.strftime('%d/%m/%Y %H:%M')}")
    
    # Test Telegram service
    service = TelegramService()
    message, item_photos = service.format_order_message(latest_order)
    
    print(f"\nTelegram message with Tashkent time:")
    print(message)
    
    # Send test notification
    print(f"\nSending test notification...")
    try:
        result = service.send_order_notification(latest_order)
        print(f"Send result: {result}")
        
        if result:
            print("Tashkent timezone notification sent successfully!")
        else:
            print("Failed to send notification")
            
    except Exception as e:
        print(f"Error sending notification: {e}")

if __name__ == "__main__":
    test_tashkent_time()
