import requests
import os
from django.conf import settings
from django.utils import timezone
import pytz

class TelegramService:
    def __init__(self):
        self.bot_token = settings.TELEGRAM_BOT_TOKEN
        self.chat_id = settings.TELEGRAM_CHAT_ID
        self.base_url = f"https://api.telegram.org/bot{self.bot_token}"

    def is_configured(self):
        return bool(self.bot_token and self.chat_id and self.bot_token != 'your_telegram_bot_token_here')

    def send_message(self, text, parse_mode='HTML'):
        if not self.is_configured():
            print("Telegram bot not configured. Skipping message.")
            return False
            
        url = f"{self.base_url}/sendMessage"
        data = {
            'chat_id': self.chat_id,
            'text': text,
            'parse_mode': parse_mode
        }
        
        try:
            response = requests.post(url, json=data, timeout=30)
            response.raise_for_status()
            return response.json().get('ok', False)
        except requests.RequestException as e:
            print(f"Failed to send Telegram message: {e}")
            return False

    def send_photo(self, photo_path, caption=''):
        if not self.is_configured():
            print("Telegram bot not configured. Skipping photo.")
            return False
            
        url = f"{self.base_url}/sendPhoto"
        
        try:
            with open(photo_path, 'rb') as photo_file:
                files = {'photo': photo_file}
                data = {'chat_id': self.chat_id}
                
                if caption:
                    data['caption'] = caption
                
                response = requests.post(url, files=files, data=data, timeout=30)
                response.raise_for_status()
                return response.json().get('ok', False)
        except (IOError, requests.RequestException) as e:
            print(f"Failed to send Telegram photo: {e}")
            return False

    def format_order_message(self, order):
        """Format order details for Telegram message in Uzbek"""
        items_text = ""
        item_photos = []
        
        for i, item in enumerate(order.items, 1):
            items_text += f"  {i}. {item['name']} x{item['quantity']} = {item['price'] * item['quantity']:,.0f} so'm\n"
            
            # Try to get product photo
            try:
                from shop.models import Product
                product = Product.objects.get(id=item['product_id'])
                if product.image:
                    item_photos.append((product.image, item['name']))
            except:
                pass
        
        status_emoji = {
            'pending': 'Kutilmoqda',
            'waiting_for_payment': 'To\'lov kutilmoqda',
            'checking': 'Tekshirilmoqda',
            'confirmed': 'Tasdiqlangan',
            'cancelled': 'Bekor qilingan'
        }
        
        emoji = status_emoji.get(order.status, 'Kutilmoqda')
        
        # Build message header without items
        message = f"""<b>YANGI BUYURTMA #{str(order.id)[:8]}</b>

<b>Mijoz:</b> {order.customer_name}
<b>Telefon:</b> {order.phone}
{f'<b>Email:</b> {order.email}' if order.email else ''}
<b>Holati:</b> {emoji} {order.get_status_display()}

<b>Mahsulotlar:</b>
{items_text}

<b>Jami summa:</b> {order.total_price:,.0f} UZS

{f'<b>Izoh:</b> {order.comment}' if order.comment else ''}

<b>Sana:</b> {timezone.localtime(order.created_at, pytz.timezone('Asia/Tashkent')).strftime('%d/%m/%Y %H:%M')}
        """
        
        return message, item_photos

    def format_order_confirmation_message(self, order):
        """Format order confirmation message for Telegram in Uzbek"""
        message = f"""<b>BUYURTMA TASDIQLANDI #{str(order.id)[:8]}</b>

<b>Mijoz:</b> {order.customer_name}
<b>Jami summa:</b> {order.total_price:,.0f} UZS

<b>Holati:</b> Tasdiqlangan

<b>Tasdiqlash vaqti:</b> {timezone.localtime(order.updated_at, pytz.timezone('Asia/Tashkent')).strftime('%d/%m/%Y %H:%M')}
        """
        
        return message

    def send_order_notification(self, order):
        """Send new order notification to Telegram with photos in Mahsulotlar section"""
        if not self.is_configured():
            return False

        message, item_photos = self.format_order_message(order)
        
        # Send text message first
        success = self.send_message(message)
        
        # Send product photos with captions showing product info
        if success and item_photos:
            for photo_field, product_name in item_photos:
                try:
                    # Handle ImageFieldFile object
                    if hasattr(photo_field, 'path'):
                        photo_path = photo_field.path
                    elif hasattr(photo_field, 'startswith') and photo_field.startswith('/'):
                        photo_path = f"media{photo_field}"
                    else:
                        photo_path = str(photo_field)
                    
                    # Send photo with product name as caption
                    self.send_photo(photo_path, f"Mahsulot: {product_name}")
                except Exception as e:
                    print(f"Failed to send photo for {product_name}: {e}")

        # Send receipt image if available
        if success and order.receipt_image:
            try:
                photo_path = order.receipt_image.path
                caption = f"Chek #{order.id}"
                self.send_photo(photo_path, caption)
            except Exception as e:
                print(f"Failed to send receipt photo: {e}")

        return success

    def send_order_confirmation(self, order):
        """Send order confirmation notification to Telegram"""
        if not self.is_configured():
            return False

        message = self.format_order_confirmation_message(order)
        return self.send_message(message)

    def send_test_message(self):
        """Send a test message to verify Telegram connection"""
        if not self.is_configured():
            return False
            
        test_message = """<b>TEST MESSAGE</b>

This is a test message from GameZoneBuild Telegram bot.

<b>Status:</b> Working
<b>Time:</b> Just now

If you see this message, Telegram is working correctly!"""
        
        return self.send_message(test_message)
