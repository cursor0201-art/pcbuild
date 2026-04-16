#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GameZoneBuild.settings')
django.setup()

from shop.telegram_service import TelegramService

def test_telegram():
    print("Testing Telegram Bot Configuration...")
    print("=" * 50)
    
    service = TelegramService()
    
    print(f"Bot Token configured: {bool(service.bot_token)}")
    print(f"Chat ID configured: {bool(service.chat_id)}")
    print(f"Is configured: {service.is_configured()}")
    
    if service.is_configured():
        print("\nSending test message...")
        result = service.send_test_message()
        print(f"Test message result: {result}")
        
        if result:
            print("✅ Telegram bot is working correctly!")
        else:
            print("❌ Failed to send test message")
    else:
        print("❌ Telegram bot not configured properly")
        print("Please check BOT_TOKEN and CHAT_ID in .env file")

if __name__ == "__main__":
    test_telegram()
