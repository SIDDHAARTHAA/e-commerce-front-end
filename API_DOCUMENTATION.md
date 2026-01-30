# E-Commerce Backend API Documentation

## Table of Contents
1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)
6. [Examples](#examples)

---

## Getting Started

### Base URL
```
http://localhost:3000/api
```

### Setup Requirements
- Node.js 18+
- npm or yarn
- Backend running on port 3000 (configurable via PORT env variable)

### Backend Startup
```bash
npm install
npm start  # runs with nodemon for development
```

### Key Technologies
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL (via Prisma ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Password Hashing**: bcrypt

---

## Authentication

### JWT Token
All protected endpoints require a JWT token in the request header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Token Information
- **Algorithm**: HS256
- **Secret**: Defined in `JWT_SECRET` environment variable
- **Expiration**: Set based on backend implementation
- **Payload**: Contains user ID and role information

### How Authentication Works
1. User signs up or logs in
2. Backend returns a JWT token
3. Frontend stores the token (localStorage, sessionStorage, or cookies)
4. Frontend includes token in `Authorization` header for subsequent requests
5. Backend validates token on each protected request

---

## API Endpoints

### Authentication Routes (`/auth`)

#### 1. Sign Up
```
POST /api/auth/signup
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `name`: required, string
- `email`: required, valid email format, must be unique
- `password`: required, minimum 6 characters

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

---

#### 2. Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

---

#### 3. Get Current User
```
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "createdAt": "2026-01-30T10:00:00Z",
  "updatedAt": "2026-01-30T10:00:00Z"
}
```

---

### Products Routes (`/products`)

#### 1. List All Products
```
GET /api/products
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
- None (returns all products)

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "tags": "electronics,computers",
    "createdAt": "2026-01-30T10:00:00Z",
    "updatedAt": "2026-01-30T10:00:00Z"
  },
  {
    "id": 2,
    "name": "Mouse",
    "description": "Wireless mouse",
    "price": 29.99,
    "tags": "electronics,accessories",
    "createdAt": "2026-01-30T10:00:00Z",
    "updatedAt": "2026-01-30T10:00:00Z"
  }
]
```

---

#### 2. Get Product by ID
```
GET /api/products/:id
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Parameters:**
- `id`: Product ID (integer)

**Response (200):**
```json
{
  "id": 1,
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "tags": "electronics,computers",
  "createdAt": "2026-01-30T10:00:00Z",
  "updatedAt": "2026-01-30T10:00:00Z"
}
```

---

#### 3. Create Product (Admin Only)
```
POST /api/products
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "name": "Keyboard",
  "description": "Mechanical keyboard with RGB lighting",
  "price": 150.50,
  "tags": ["electronics", "accessories", "gaming"]
}
```

**Validation Rules:**
- `name`: required, minimum 1 character
- `description`: required, minimum 1 character
- `price`: required, must be positive number
- `tags`: required, array with at least 1 tag

**Response (201):**
```json
{
  "id": 3,
  "name": "Keyboard",
  "description": "Mechanical keyboard with RGB lighting",
  "price": 150.50,
  "tags": "electronics,accessories,gaming",
  "createdAt": "2026-01-30T10:00:00Z",
  "updatedAt": "2026-01-30T10:00:00Z"
}
```

---

#### 4. Update Product (Admin Only)
```
PUT /api/products/:id
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Parameters:**
- `id`: Product ID (integer)

**Request Body:**
```json
{
  "name": "Mechanical Keyboard",
  "description": "Updated description",
  "price": 145.99,
  "tags": ["electronics", "accessories"]
}
```

**Response (200):**
```json
{
  "id": 3,
  "name": "Mechanical Keyboard",
  "description": "Updated description",
  "price": 145.99,
  "tags": "electronics,accessories",
  "createdAt": "2026-01-30T10:00:00Z",
  "updatedAt": "2026-01-30T11:00:00Z"
}
```

---

#### 5. Delete Product (Admin Only)
```
DELETE /api/products/:id
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Parameters:**
- `id`: Product ID (integer)

**Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

---

### Cart Routes (`/cart`)

#### 1. Add Item to Cart
```
POST /api/cart
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Validation Rules:**
- `productId`: required, valid product ID
- `quantity`: required, positive integer

**Response (201):**
```json
{
  "id": 5,
  "userId": 1,
  "productId": 1,
  "quantity": 2,
  "product": {
    "id": 1,
    "name": "Laptop",
    "price": 999.99
  },
  "createdAt": "2026-01-30T10:00:00Z",
  "updatedAt": "2026-01-30T10:00:00Z"
}
```

**Note**: If the product already exists in the cart, quantity is updated instead of creating a duplicate.

---

#### 2. Get Cart
```
GET /api/cart
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
{
  "items": [
    {
      "id": 5,
      "userId": 1,
      "productId": 1,
      "quantity": 2,
      "product": {
        "id": 1,
        "name": "Laptop",
        "price": 999.99,
        "description": "High-performance laptop"
      },
      "createdAt": "2026-01-30T10:00:00Z",
      "updatedAt": "2026-01-30T10:00:00Z"
    }
  ],
  "totalPrice": 1999.98,
  "totalQuantity": 2
}
```

---

#### 3. Update Cart Item Quantity
```
PATCH /api/cart/:id
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Parameters:**
- `id`: Cart item ID (integer)

**Request Body:**
```json
{
  "quantity": 5
}
```

**Response (200):**
```json
{
  "id": 5,
  "userId": 1,
  "productId": 1,
  "quantity": 5,
  "product": {
    "id": 1,
    "name": "Laptop",
    "price": 999.99
  },
  "createdAt": "2026-01-30T10:00:00Z",
  "updatedAt": "2026-01-30T11:00:00Z"
}
```

---

#### 4. Remove Item from Cart
```
DELETE /api/cart/:id
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Parameters:**
- `id`: Cart item ID (integer)

**Response (200):**
```json
{
  "message": "Item removed from cart"
}
```

---

### Users Routes (`/users`)

#### 1. Health Check
```
GET /api/users/health
```

**Response (200):**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

#### 2. Add Address
```
POST /api/users/address
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "lineOne": "123 Main Street",
  "lineTwo": "Apt 4B",
  "city": "New York",
  "country": "USA",
  "pincode": "100001"
}
```

**Validation Rules:**
- `lineOne`: required, string
- `lineTwo`: optional, string
- `city`: required, string
- `country`: required, string
- `pincode`: required, exactly 6 characters

**Response (201):**
```json
{
  "id": 1,
  "userId": 1,
  "lineOne": "123 Main Street",
  "lineTwo": "Apt 4B",
  "city": "New York",
  "country": "USA",
  "pincode": "100001",
  "createdAt": "2026-01-30T10:00:00Z",
  "updatedAt": "2026-01-30T10:00:00Z"
}
```

---

#### 3. List User Addresses
```
GET /api/users/address
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "lineOne": "123 Main Street",
    "lineTwo": "Apt 4B",
    "city": "New York",
    "country": "USA",
    "pincode": "100001",
    "createdAt": "2026-01-30T10:00:00Z",
    "updatedAt": "2026-01-30T10:00:00Z"
  }
]
```

---

#### 4. Delete Address
```
DELETE /api/users/address/:id
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Parameters:**
- `id`: Address ID (integer)

**Response (200):**
```json
{
  "message": "Address deleted successfully"
}
```

---

#### 5. Update User Profile
```
POST /api/users/update
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "defaultShippingAddressId": 1
}
```

**Validation Rules:**
- `name`: optional, string
- `defaultShippingAddressId`: optional, valid address ID or null

**Response (200):**
```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "john@example.com",
  "role": "USER",
  "defaultShippingAddressId": 1,
  "createdAt": "2026-01-30T10:00:00Z",
  "updatedAt": "2026-01-30T11:00:00Z"
}
```

---

#### 6. List All Users (Admin Only)
```
GET /api/users
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2026-01-30T10:00:00Z",
    "updatedAt": "2026-01-30T10:00:00Z"
  }
]
```

---

#### 7. Get User by ID (Admin Only)
```
GET /api/users/:id
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Parameters:**
- `id`: User ID (integer)

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "defaultShippingAddressId": 1,
  "createdAt": "2026-01-30T10:00:00Z",
  "updatedAt": "2026-01-30T10:00:00Z"
}
```

---

#### 8. Change User Role (Admin Only)
```
PUT /api/users/:id/role
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Parameters:**
- `id`: User ID (integer)

**Request Body:**
```json
{
  "role": "ADMIN"
}
```

**Valid Roles:**
- `USER` (default)
- `ADMIN`

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "ADMIN",
  "createdAt": "2026-01-30T10:00:00Z",
  "updatedAt": "2026-01-30T11:00:00Z"
}
```

---

### Orders Routes (`/orders`)

#### 1. Create Order
```
POST /api/orders
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "shippingAddressId": 1
}
```

**Validation Rules:**
- `shippingAddressId`: required, valid address ID
- Cart must not be empty
- All cart items must have valid products

**Response (201):**
```json
{
  "id": 101,
  "userId": 1,
  "netAmount": 1999.98,
  "shippingLineOne": "123 Main Street",
  "shippingLineTwo": "Apt 4B",
  "shippingCity": "New York",
  "shippingCountry": "USA",
  "shippingPincode": "100001",
  "createdAt": "2026-01-30T10:00:00Z",
  "updatedAt": "2026-01-30T10:00:00Z",
  "orderProducts": [
    {
      "id": 1,
      "orderId": 101,
      "productId": 1,
      "name": "Laptop",
      "price": 999.99,
      "quantity": 2
    }
  ],
  "orderEvents": [
    {
      "id": 1,
      "orderId": 101,
      "status": "PENDING",
      "createdAt": "2026-01-30T10:00:00Z"
    }
  ]
}
```

**Note**: After order creation, the user's cart is automatically cleared.

---

#### 2. List User's Orders
```
GET /api/orders
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
[
  {
    "id": 101,
    "userId": 1,
    "netAmount": 1999.98,
    "shippingLineOne": "123 Main Street",
    "shippingLineTwo": "Apt 4B",
    "shippingCity": "New York",
    "shippingCountry": "USA",
    "shippingPincode": "100001",
    "createdAt": "2026-01-30T10:00:00Z",
    "updatedAt": "2026-01-30T10:00:00Z",
    "orderProducts": [
      {
        "id": 1,
        "orderId": 101,
        "productId": 1,
        "name": "Laptop",
        "price": 999.99,
        "quantity": 2
      }
    ],
    "orderEvents": [
      {
        "id": 1,
        "orderId": 101,
        "status": "PENDING",
        "createdAt": "2026-01-30T10:00:00Z"
      }
    ]
  }
]
```

---

#### 3. Get Order by ID
```
GET /api/orders/:id
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Parameters:**
- `id`: Order ID (integer)

**Response (200):**
```json
{
  "id": 101,
  "userId": 1,
  "netAmount": 1999.98,
  "shippingLineOne": "123 Main Street",
  "shippingLineTwo": "Apt 4B",
  "shippingCity": "New York",
  "shippingCountry": "USA",
  "shippingPincode": "100001",
  "createdAt": "2026-01-30T10:00:00Z",
  "updatedAt": "2026-01-30T10:00:00Z",
  "orderProducts": [
    {
      "id": 1,
      "orderId": 101,
      "productId": 1,
      "name": "Laptop",
      "price": 999.99,
      "quantity": 2
    }
  ],
  "orderEvents": [
    {
      "id": 1,
      "orderId": 101,
      "status": "PENDING",
      "createdAt": "2026-01-30T10:00:00Z"
    }
  ]
}
```

---

#### 4. List All Orders (Admin Only)
```
GET /api/orders/index
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
[
  {
    "id": 101,
    "userId": 1,
    "netAmount": 1999.98,
    "shippingLineOne": "123 Main Street",
    "shippingLineTwo": "Apt 4B",
    "shippingCity": "New York",
    "shippingCountry": "USA",
    "shippingPincode": "100001",
    "createdAt": "2026-01-30T10:00:00Z",
    "updatedAt": "2026-01-30T10:00:00Z",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

---

#### 5. Change Order Status (Admin Only)
```
PUT /api/orders/:id/status
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Parameters:**
- `id`: Order ID (integer)

**Request Body:**
```json
{
  "status": "OUT_FOR_DELIVERY"
}
```

**Valid Statuses:**
- `PENDING` (initial status)
- `ACCEPTED`
- `OUT_FOR_DELIVERY`
- `DELIVERY` (completed)
- `CANCELLED`

**Response (200):**
```json
{
  "id": 101,
  "userId": 1,
  "netAmount": 1999.98,
  "orderEvents": [
    {
      "id": 1,
      "orderId": 101,
      "status": "PENDING",
      "createdAt": "2026-01-30T10:00:00Z"
    },
    {
      "id": 2,
      "orderId": 101,
      "status": "OUT_FOR_DELIVERY",
      "createdAt": "2026-01-30T11:00:00Z"
    }
  ]
}
```

**Note**: Each status change creates a new OrderEvent entry. The latest event represents the current status.

---

#### 6. Cancel Order
```
PUT /api/orders/:id/cancel
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Parameters:**
- `id`: Order ID (integer)

**Request Body:**
```json
{}
```

**Response (200):**
```json
{
  "id": 101,
  "message": "Order cancelled successfully",
  "orderEvents": [
    {
      "id": 1,
      "orderId": 101,
      "status": "PENDING",
      "createdAt": "2026-01-30T10:00:00Z"
    },
    {
      "id": 3,
      "orderId": 101,
      "status": "CANCELLED",
      "createdAt": "2026-01-30T11:30:00Z"
    }
  ]
}
```

**Note**: Users can only cancel their own orders. Admins can cancel any order.

---

## Data Models

### User
```json
{
  "id": "integer (primary key, auto-increment)",
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed with bcrypt)",
  "role": "USER | ADMIN",
  "defaultShippingAddressId": "integer (nullable, foreign key to Address)",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

### Product
```json
{
  "id": "integer (primary key, auto-increment)",
  "name": "string",
  "description": "string (text)",
  "price": "decimal",
  "tags": "string (comma-separated values)",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

### Address
```json
{
  "id": "integer (primary key, auto-increment)",
  "lineOne": "string",
  "lineTwo": "string (nullable)",
  "city": "string",
  "country": "string",
  "pincode": "string (6 characters)",
  "userId": "integer (foreign key to User)",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

### CartItems
```json
{
  "id": "integer (primary key, auto-increment)",
  "userId": "integer (foreign key to User)",
  "productId": "integer (foreign key to Product)",
  "quantity": "integer",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

### Order
```json
{
  "id": "integer (primary key, auto-increment)",
  "userId": "integer (foreign key to User)",
  "netAmount": "decimal",
  "shippingLineOne": "string",
  "shippingLineTwo": "string (nullable)",
  "shippingCity": "string",
  "shippingCountry": "string",
  "shippingPincode": "string",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

### OrderProduct
```json
{
  "id": "integer (primary key, auto-increment)",
  "orderId": "integer (foreign key to Order)",
  "productId": "integer (foreign key to Product)",
  "name": "string (snapshot of product name at order time)",
  "price": "decimal (snapshot of product price at order time)",
  "quantity": "integer",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

### OrderEvent
```json
{
  "id": "integer (primary key, auto-increment)",
  "orderId": "integer (foreign key to Order)",
  "status": "PENDING | ACCEPTED | OUT_FOR_DELIVERY | DELIVERY | CANCELLED",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

---

## Error Handling

### Error Response Format
```json
{
  "message": "Error description",
  "errorCode": "ERROR_CODE_NAME",
  "statusCode": 400,
  "errors": null
}
```

### HTTP Status Codes

| Status Code | Meaning | Examples |
|-------------|---------|----------|
| 200 | OK | Successful GET, PUT, PATCH requests |
| 201 | Created | Successful POST requests creating resources |
| 400 | Bad Request | Invalid input, validation errors, missing required fields |
| 401 | Unauthorized | Missing or invalid JWT token, user not authenticated |
| 403 | Forbidden | User lacks required permissions (e.g., not admin) |
| 404 | Not Found | Resource (user, product, order, address) does not exist |
| 500 | Internal Server Error | Unexpected server error |

### Common Error Scenarios

#### Invalid JWT Token (401)
```json
{
  "message": "Unauthorized",
  "errorCode": "UNAUTHORIZED",
  "statusCode": 401,
  "errors": null
}
```

#### Missing Required Field (400)
```json
{
  "message": "Validation error",
  "errorCode": "UNPROCESSABLE_ENTITY",
  "statusCode": 400,
  "errors": {
    "fieldName": "Field is required"
  }
}
```

#### Resource Not Found (404)
```json
{
  "message": "Product not found",
  "errorCode": "NOT_FOUND",
  "statusCode": 404,
  "errors": null
}
```

#### Admin-Only Endpoint without Admin Role (403)
```json
{
  "message": "Access denied. Admin role required.",
  "errorCode": "FORBIDDEN",
  "statusCode": 403,
  "errors": null
}
```

#### Email Already Exists (400)
```json
{
  "message": "Email already in use",
  "errorCode": "BAD_REQUEST",
  "statusCode": 400,
  "errors": null
}
```

---

## Examples

### Complete User Flow

#### 1. Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

#### 2. Add Shipping Address
```bash
curl -X POST http://localhost:3000/api/users/address \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "lineOne": "123 Main Street",
    "lineTwo": "Apt 4B",
    "city": "New York",
    "country": "USA",
    "pincode": "100001"
  }'
```

#### 3. Browse Products
```bash
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### 4. Add Product to Cart
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

#### 5. View Cart
```bash
curl -X GET http://localhost:3000/api/cart \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### 6. Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "shippingAddressId": 1
  }'
```

#### 7. View Order Status
```bash
curl -X GET http://localhost:3000/api/orders/101 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## Important Notes for Frontend Developers

1. **Token Storage**: Store JWT tokens securely. Consider using httpOnly cookies for enhanced security.

2. **Token Refresh**: Current implementation doesn't include refresh tokens. Implement a re-login flow when tokens expire.

3. **CORS**: If frontend is on a different domain, ensure CORS is configured on the backend.

4. **Validation**: Frontend should validate all inputs before sending to backend. Backend also validates with Zod.

5. **Cart Behavior**:
   - Only one cart entry per product per user
   - Cart items are automatically cleared after successful order creation
   - Quantity is updated if adding an existing product to cart

6. **Order Status**: Monitor `orderEvents` array for latest status. Most recent event represents current state.

7. **Admin Functionality**: Only users with role `ADMIN` can:
   - Create, update, delete products
   - View all users and their details
   - Change user roles
   - View all orders
   - Change order status

8. **Default Shipping Address**: Users can set a default address via the update user endpoint to streamline checkout.

9. **Product Tags**: Tags are stored as comma-separated values in the database. Send as array in requests.

10. **Error Handling**: Always handle both network errors and API error responses in frontend.

---

## Environment Variables Required

```
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your_secret_key
PORT=3000
```

---

For questions or clarifications about the API, contact the backend team.
