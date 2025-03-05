# StockPulse Platform Documentation

## Introduction

StockPulse is a platform developed by team Int main to manage warehouses, store managers, and store staff effectively. This documentation provides instructions on how to use the platform, its users, and the available endpoints for each model.

## Users and Roles

1.  **ADMIN:**

    *   The administrator has full control over the platform.
    *   Can add warehouses, update warehouse details, and assign store managers to warehouses.
    *   Responsible for overall system management.
2.  **STORE\_MANAGER:**

    *   Manages the stock quantity at a specific warehouse.
    *   Can change the shift (day/night) of store staff assigned to their warehouse.
    *   Responsible for inventory management and staff scheduling.
3.  **STORE\_STAFF:**

    *   Updates the preparation status of orders (pending, packing, completed).
    *   Decreases the stock level of products after a sale is made.
    *   Responsible for order fulfillment and stock maintenance.
4.  **USER:**

    *   A regular user of the platform.
    *   Can view products, add items to the cart, and place orders.
    *   Has limited access compared to the other roles.

## Models and Endpoints

### 1. User Model

*   **Description:** Manages user information, roles, and authentication.
*   **Endpoints:**
    *   `POST /api/user/register`: Register a new user.
    *   `POST /api/user/login`: Login an existing user.
    *   `GET /api/user/logout`: Logout the current user (requires authentication).
    *   `PUT /api/user/upload-avatar`: Upload user avatar (requires authentication).
    *   `PUT /api/user/update-user`: Update user details (requires authentication).
    *   `POST /api/user/refresh-token`: Refresh access token.
    *   `GET /api/user/user-details`: Get user details (requires authentication).

### 2. Warehouse Model

*   **Description:** Manages warehouse information, stock levels, store managers, and store staff.
*   **Endpoints:**
    *   `POST /api/warehouse/add-warehouse`: Add a new warehouse (requires ADMIN role).
    *   `PUT /api/warehouse/update-warehouse/:warehouseId`: Update warehouse details (requires ADMIN role).
    *   `POST /api/warehouse/assign-store-manager`: Assign a store manager to a warehouse (requires ADMIN role).
    *   `PUT /api/warehouse/update-stock-quantity`: Update stock quantity in the warehouse (requires STORE\_MANAGER role).
    *   `PUT /api/warehouse/change-staff-shift`: Change the shift of a store staff (requires STORE\_MANAGER role).
    *   `PUT /api/warehouse/update-order-preparation-status`: Update order preparation status (requires STORE\_STAFF role).
    *   `PUT /api/warehouse/decrease-stock-level`: Decrease stock level after a sale (requires STORE\_STAFF role).

### 3. Category Model

*   **Description:** Manages product categories.
*   **Endpoints:**
    *   `POST   /api/category/create-category` - CREATE
    *   `GET    /api/category/get-category` - READ
    *   `GET    /api/category/get-category/:id` - READ
    *   `PUT    /api/category/update-category/:id` - UPDATE
    *   `DELETE /api/category/delete-category/:id` - DELETE

### 4. SubCategory Model

*   **Description:** Manages product subcategories.
*   **Endpoints:**
    *   `POST   /api/subcategory/create-subcategory` - CREATE
    *   `GET    /api/subcategory/get-subcategory` - READ
    *   `GET    /api/subcategory/get-subcategory/:id` - READ
    *   `PUT    /api/subcategory/update-subcategory/:id` - UPDATE
    *   `DELETE /api/subcategory/delete-subcategory/:id` - DELETE

### 5. Product Model

*   **Description:** Manages product information and inventory.
*   **Endpoints:**
    *   `POST   /api/product/create-product` - CREATE
    *   `GET    /api/product/get-product` - READ
    *   `GET    /api/product/get-product/:id` - READ
    *   `PUT    /api/product/update-product/:id` - UPDATE
    *   `DELETE /api/product/delete-product/:id` - DELETE

### 6. Cart Model

*   **Description:** Manages user shopping carts.
*   **Endpoints:**
    *   `POST   /api/cart/create-cart` - CREATE
    *   `GET    /api/cart/get-cart` - READ
    *   `GET    /api/cart/get-cart/:id` - READ
    *   `PUT    /api/cart/update-cart/:id` - UPDATE
    *   `DELETE /api/cart/delete-cart/:id` - DELETE

### 7. Address Model

*   **Description:** Manages user addresses.
*   **Endpoints:**
    *   `POST   /api/address/create-address` - CREATE
    *   `GET    /api/address/get-address` - READ
    *   `GET    /api/address/get-address/:id` - READ
    *   `PUT    /api/address/update-address/:id` - UPDATE
    *   `DELETE /api/address/delete-address/:id` - DELETE

### 8. Order Model

*   **Description:** Manages user orders.
*   **Endpoints:**
    *   `POST   /api/order/create-order` - CREATE
    *   `GET    /api/order/get-order` - READ
    *   `GET    /api/order/get-order/:id` - READ
    *   `PUT    /api/order/update-order/:id` - UPDATE
    *   `DELETE /api/order/delete-order/:id` - DELETE

## Middleware

### 1. Authentication Middleware (`auth.js`)

*   **Description:** Verifies user authentication tokens.
*   **Usage:** Applied to routes that require authentication.

### 2. Admin Middleware (`Admin.js`)

*   **Description:** Checks if the user has the ADMIN role.
*   **Usage:** Applied to routes that only admins can access.


## Team

*   Int main

## Contact

For any issues or inquiries, please contact the team through COntact provided on github.com
