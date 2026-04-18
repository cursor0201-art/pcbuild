# Telegram Bot Setup Guide

## 1. Create Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/start` to BotFather
3. Send `/newbot` to create a new bot
4. Follow the instructions:
   - Choose a name for your bot (e.g., "PC Builder Orders")
   - Choose a username (must end with `bot`, e.g., "pcbuilder_orders_bot")
5. BotFather will give you a **BOT_TOKEN** (looks like: `1234567890:ABCDEF...`)

## 2. Get Your Chat ID

1. Send a message to your new bot (any message)
2. Open this URL in your browser (replace YOUR_BOT_TOKEN):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
3. Look for `chat.id` in the response (looks like: `"chat":{"id":123456789,...}`)
4. Copy this **CHAT_ID**

## 3. Update .env File

Open `backend/.env` and update:
```env
# Telegram Bot
BOT_TOKEN=1234567890:ABCDEF...  # Replace with your bot token
CHAT_ID=123456789              # Replace with your chat ID
```

## 4. Test Telegram Connection

Run this command in backend directory:
```bash
python manage.py shell -c "
from shop.telegram_service import TelegramService
service = TelegramService()
print('Is configured:', service.is_configured())
if service.is_configured():
    print('Sending test message...')
    result = service.send_test_message()
    print('Test message sent:', result)
else:
    print('Please configure BOT_TOKEN and CHAT_ID in .env file')
"
```

## 5. Restart Django Server

After updating .env, restart the Django server:
```bash
python manage.py runserver
```

## 6. Test Order Notifications

1. Add products to cart in frontend
2. Go to checkout and place an order
3. You should receive a notification in Telegram with order details

## Troubleshooting

**If test message fails:**
- Check BOT_TOKEN is correct (no extra spaces)
- Check CHAT_ID is correct (numbers only)
- Make sure you sent a message to your bot first
- Check internet connection

**If no notifications on orders:**
- Check Django server logs for errors
- Verify .env file is being loaded correctly
- Check that order creation is working in admin panel
