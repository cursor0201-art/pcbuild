#!/usr/bin/env python
import os
import sys
import django
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GameZoneBuild.settings')
django.setup()

from shop.telegram_service import TelegramService

def check_chat_id():
    print("Checking Telegram Chat ID...")
    print("=" * 50)
    
    service = TelegramService()
    
    print(f"Current BOT_TOKEN: {service.bot_token[:20]}...")
    print(f"Current CHAT_ID: {service.chat_id}")
    
    if not service.is_configured():
        print("❌ Telegram not configured!")
        return
    
    # Get bot info and updates
    try:
        url = f"https://api.telegram.org/bot{service.bot_token}/getUpdates"
        response = requests.get(url)
        data = response.json()
        
        print(f"\ngetUpdates response: {data}")
        
        if data.get('ok'):
            updates = data.get('result', [])
            print(f"\nFound {len(updates)} recent updates")
            
            for i, update in enumerate(updates[-5:]):  # Last 5 updates
                if 'message' in update:
                    message = update['message']
                    chat_info = message.get('chat', {})
                    print(f"\nUpdate {i+1}:")
                    print(f"  Chat ID: {chat_info.get('id')}")
                    print(f"  Chat Type: {chat_info.get('type')}")
                    print(f"  From: {message.get('from', {}).get('first_name', 'Unknown')}")
                    print(f"  Message: {message.get('text', 'No text')[:50]}...")
        
        print(f"\n" + "="*50)
        print("IMPORTANT:")
        print("1. Make sure you sent a message to your bot FIRST")
        print("2. The CHAT_ID should be the ID from YOUR message")
        print("3. If you see multiple chat IDs, use YOUR personal chat ID")
        print("4. Current CHAT_ID in .env:", service.chat_id)
        
    except Exception as e:
        print(f"❌ Error checking chat ID: {e}")

if __name__ == "__main__":
    check_chat_id()
