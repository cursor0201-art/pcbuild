#!/usr/bin/env python
import os
import sys
import django
import requests

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'GameZoneBuild.settings')
django.setup()

def send_direct_test():
    print("Sending direct test message...")
    print("=" * 50)
    
    # Your bot token and chat ID
    BOT_TOKEN = "8797840133:AAHXG-d5KZdxr3ZM9xBdFX7aioECkySbLoA"
    CHAT_ID = "8456049332"
    
    # Test message
    test_message = """
🔥 TEST MESSAGE FROM PC BUILDER 🔥

This is a direct test message to verify Telegram is working.

Time: Just now
Status: Testing

If you see this message, Telegram is working correctly! 🎉
    """
    
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    
    data = {
        "chat_id": CHAT_ID,
        "text": test_message,
        "parse_mode": "HTML"
    }
    
    print(f"Sending to chat ID: {CHAT_ID}")
    print(f"Message length: {len(test_message)} characters")
    
    try:
        response = requests.post(url, json=data)
        result = response.json()
        
        print(f"\nResponse status: {response.status_code}")
        print(f"Response: {result}")
        
        if result.get('ok'):
            print("✅ Direct test message sent successfully!")
            print("Check your Telegram now!")
        else:
            print(f"❌ Failed to send: {result.get('description', 'Unknown error')}")
            
    except Exception as e:
        print(f"❌ Error sending test message: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    send_direct_test()
