# CREATE ORDER API - Frontend Guide

## Endpoint Overview

```
POST /api/orders
```

This endpoint creates a new order from the user's shopping cart and automatically clears it upon successful order creation.

---

## Prerequisites

### Requirements Before Creating an Order

1. **User Authentication**
   - User must be logged in with a valid JWT token
   - Include token in `Authorization` header

2. **Cart Not Empty**
   - User must have at least one item in their cart
   - If cart is empty, you'll get an error: "Cart is empty"

3. **Default Shipping Address Set**
   - User must have a default shipping address configured
   - If no default address exists, you'll get a 404: "Address not defined"

---

## Request Details

### Headers

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body

**No body required!** This endpoint is very simple:

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

### JavaScript/Fetch Example

```javascript
async function createOrder(token) {
  const response = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
}
```

---

## Response Structure

### Success Response (200 OK)

When an order is successfully created, you'll receive:

```json
{
  "id": 101,
  "userId": 1,
  "netAmount": 1999.98,
  "shippingLineOne": "123 Main Street",
  "shippingLineTwo": "Apt 4B",
  "shippingCity": "New York",
  "shippingCountry": "USA",
  "shippingPincode": "10001",
  "createdAt": "2026-01-31T10:30:00.000Z",
  "updatedAt": "2026-01-31T10:30:00.000Z",
  "orderProducts": [
    {
      "id": 1,
      "orderId": 101,
      "productId": 1,
      "name": "Laptop",
      "price": 999.99,
      "quantity": 2
    },
    {
      "id": 2,
      "orderId": 101,
      "productId": 5,
      "name": "Mouse",
      "price": 29.99,
      "quantity": 1
    }
  ],
  "orderEvents": [
    {
      "id": 1,
      "orderId": 101,
      "status": "PENDING",
      "createdAt": "2026-01-31T10:30:00.000Z",
      "updatedAt": "2026-01-31T10:30:00.000Z"
    }
  ]
}
```

### Response Field Explanations

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique order identifier |
| `userId` | number | ID of the user who placed the order |
| `netAmount` | decimal | Total amount (sum of all items: quantity × price) |
| `shippingLineOne` | string | Primary address line (e.g., street and number) |
| `shippingLineTwo` | string\|null | Secondary address line (e.g., apartment/suite) |
| `shippingCity` | string | City for delivery |
| `shippingCountry` | string | Country for delivery |
| `shippingPincode` | string | Postal/ZIP code for delivery |
| `createdAt` | ISO datetime | When the order was created |
| `updatedAt` | ISO datetime | When the order was last updated |
| `orderProducts` | array | List of products in this order (see below) |
| `orderEvents` | array | Status history of the order (see below) |

### Order Products (Line Items)

Each item in `orderProducts` contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique line item ID |
| `orderId` | number | The order this item belongs to |
| `productId` | number | ID of the product |
| `name` | string | Product name (snapshot from order time) |
| `price` | decimal | Unit price at time of order |
| `quantity` | number | Quantity ordered |

### Order Events (Status History)

Each item in `orderEvents` contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique event ID |
| `orderId` | number | The order this event belongs to |
| `status` | enum | Order status (see statuses below) |
| `createdAt` | ISO datetime | When this status was set |
| `updatedAt` | ISO datetime | When this status was last updated |

#### Order Status Values

- `PENDING` - Order created, waiting for processing (initial status)
- `ACCEPTED` - Order accepted by the system/store
- `OUT_FOR_DELIVERY` - Order is on its way
- `DELIVERY` - Order delivered
- `CANCELLED` - Order cancelled

---

## Error Responses

### 1. Empty Cart (200 OK with message)

```json
{
  "message": "Cart is empty"
}
```

**Cause:** User tried to create an order with no items in cart

**Solution:** Add items to cart before attempting to create an order

---

### 2. Address Not Found (404)

```json
{
  "statusCode": 404,
  "message": "Address not defined",
  "errorCode": "ADDRESS_NOT_FOUND"
}
```

**Cause:** User doesn't have a default shipping address set

**Solution:** User needs to add and set a default shipping address in their account settings

---

### 3. Unauthorized (401)

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Cause:** Missing or invalid JWT token in Authorization header

**Solution:** Make sure you're including a valid token in the request header

---

### 4. Server Error (500)

```json
{
  "statusCode": 500,
  "message": "Something went wrong"
}
```

**Cause:** Unexpected server error

**Solution:** Check backend logs and retry

---

## What Happens After Order Creation

### Automatic Actions

1. ✅ **Order Created** - New order record with PENDING status
2. ✅ **Cart Cleared** - User's entire shopping cart is emptied
3. ✅ **Order Event Created** - Initial PENDING status event is created
4. ✅ **Address Copied** - Default address is stored with the order

### In Database Transaction

All the above happens in a single database transaction, meaning:
- Either everything succeeds, or everything rolls back (no partial orders)
- No data consistency issues

---

## Complete Frontend Flow Example

```javascript
// 1. User clicks "Place Order" button
async function handlePlaceOrder() {
  try {
    // 2. Show loading state
    setIsLoading(true);

    // 3. Get stored token
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Not authenticated');
    }

    // 4. Call create order API
    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // 5. Parse response
    const data = await response.json();

    // 6. Handle error cases
    if (!response.ok) {
      if (data.message === 'Cart is empty') {
        setError('Your cart is empty. Add items before placing an order.');
      } else if (data.errorCode === 'ADDRESS_NOT_FOUND') {
        setError('Please set a default shipping address first.');
        // Redirect to address settings
        navigate('/settings/addresses');
      } else {
        setError(data.message || 'Failed to create order');
      }
      return;
    }

    // 7. Success - Handle order confirmation
    console.log('Order created:', data);
    
    // Show success message
    setSuccess(`Order #${data.id} placed successfully!`);
    
    // Clear cart from UI
    clearCartUI();
    
    // Redirect to order confirmation
    navigate(`/order-confirmation/${data.id}`);

  } catch (error) {
    console.error('Error creating order:', error);
    setError('Network error. Please try again.');
  } finally {
    setIsLoading(false);
  }
}
```

---

## Important Notes

⚠️ **Cart Clearing**
- The cart is automatically emptied after successful order creation
- Make sure to clear the cart UI state on the frontend as well
- Don't rely on separate cart clearing API calls

📍 **Shipping Address**
- The order uses the user's **default** shipping address
- No address ID parameter is needed
- The address is copied to the order at creation time (snapshot)
- Later address changes won't affect previous orders

💰 **Pricing**
- `netAmount` is calculated on the backend: sum of (quantity × price) for all items
- Prices are stored in the order to maintain historical accuracy
- Frontend should show this amount as the order total

🔄 **Order Status**
- Orders always start with `PENDING` status
- Status can only be changed by admins (via separate endpoint)
- Users can only see their own orders

---

## Testing

### Happy Path Test

```javascript
// Prerequisites:
// 1. User logged in with valid token
// 2. User has items in cart
// 3. User has default shipping address set

const token = 'your-valid-jwt-token';

const response = await fetch('http://localhost:3000/api/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

console.log(response.status); // Should be 200
const order = await response.json();
console.log(order.id); // Should have an order ID
console.log(order.orderProducts.length); // Should have items
console.log(order.orderEvents[0].status); // Should be 'PENDING'
```

---

## Related Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/orders` | List all user's orders |
| `GET` | `/api/orders/:id` | Get specific order details |
| `PUT` | `/api/orders/:id/cancel` | Cancel a pending order |
| `POST` | `/api/cart` | Add items to cart |
| `DELETE` | `/api/cart/:id` | Remove items from cart |

