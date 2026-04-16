// Debug script to test order creation
const testOrder = async () => {
    try {
        const orderData = {
            customer_name: 'Test Customer',
            phone: '+998900000000',
            email: 'test@example.com',
            comment: 'Test order from debug script',
            items: [
                {
                    product_id: '1',
                    quantity: 1
                }
            ]
        };

        console.log('Sending order data:', orderData);

        const response = await fetch('http://127.0.0.1:8000/api/orders/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:5173'
            },
            body: JSON.stringify(orderData)
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        const data = await response.json();
        console.log('Response data:', data);

        if (response.ok && data.success) {
            console.log('✅ Order created successfully!');
            console.log('Order ID:', data.data.id);
        } else {
            console.error('❌ Failed to create order:', data);
        }
    } catch (error) {
        console.error('❌ Error creating order:', error);
    }
};

// Run test
testOrder();
