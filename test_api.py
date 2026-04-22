import requests

url = "https://global-silvia-bave-hub-f7de6d2e.koyeb.app/api/orders/"
payload = {
    "customer_name": "Test Name",
    "phone": "+998901234567",
    "email": "test@example.com",
    "comment": "Testing from script",
    "items": [
        {
            "product_id": "test",
            "name": "Test CPU",
            "price": 1200000,
            "quantity": 1
        }
    ]
}
headers = {
    "Origin": "https://pcbuild-e14.pages.dev",
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=payload, headers=headers)
    print("STATUS:", response.status_code)
    print("RESPONSE:", response.text)
except Exception as e:
    print("ERROR:", e)
