## Project Overview
CrickCart is a full-stack MERN e-commerce platform built for cricket enthusiasts, offering a seamless shopping experience for premium cricket equipment.  
It includes secure authentication, advanced product discovery, cart and wishlist management, order tracking, admin controls, and cloud-based media handling.

---

## Features
- JWT-based authentication with role-based access (user/admin)
- Product search, filter by category, price range, and sort
- Cloudinary image upload for products and categories
- Cart with quantity management and real-time price calculation
- Wishlist with optimistic UI updates
- Multi-step checkout with demo payment simulation
- Order tracking with status management
- Admin dashboard — product, category, order, and user management
- Pagination on product listing and admin tables
- Fully responsive mobile-first design

---

## Tech Stack Diagram
```mermaid
graph LR
    A[Frontend] --> B[React 18]
    A --> C[Tailwind CSS]
    A --> D[Framer Motion]
    A --> E[Context API]

    F[Backend] --> G[Node.js]
    F --> H[Express.js]
    F --> I[MongoDB]
    F --> J[Mongoose]

    K[Services] --> L[Cloudinary]
    K --> M[JWT Authentication]
    K --> N[REST API]
```

---

## System Architecture
```mermaid
flowchart TB
    subgraph Frontend
        A[React App] --> B[Context API]
        B --> C[Auth Context]
        B --> D[Cart Context]
        B --> E[Wishlist Context]
        B --> F[Product State]
    end

    subgraph Backend
        G[Express Server] --> H[Routes]
        H --> I[Controllers]
        I --> J[Models]
        J --> K[(MongoDB)]
        I --> L[Cloudinary]
    end

    A -->|REST API Calls| G

    style A fill:#00a8e8
    style G fill:#00171f,color:#fff
    style K fill:#4db33d
```

---

## User Flow / State Diagram
```mermaid
stateDiagram-v2
    [*] --> Browse
    Browse --> ProductDetails
    ProductDetails --> AddToCart
    ProductDetails --> AddToWishlist

    AddToCart --> Cart
    Cart --> Checkout

    Checkout --> Login: Not Authenticated
    Login --> Checkout

    Checkout --> PlaceOrder
    PlaceOrder --> OrderConfirmed
    OrderConfirmed --> [*]

    AddToWishlist --> Wishlist
    Wishlist --> [*]
```

---

## Backend MVC Structure
```mermaid
flowchart TD
    A[Client Request] --> B[Route]
    B --> C[Controller]
    C --> D[Business Logic]
    D --> E[Model]
    E --> F[(MongoDB)]
    C --> G[Response to Client]
```

---

## Database ER Diagram
```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER ||--o{ CART : has
    USER ||--o{ WISHLIST : has
    ORDER ||--|{ ORDER_ITEM : contains
    PRODUCT ||--o{ ORDER_ITEM : includes
    PRODUCT }o--|| CATEGORY : belongs_to
    PRODUCT }o--|| BRAND : has

    USER {
        string name
        string email
        string password
        string role
    }

    PRODUCT {
        string name
        number price
        number discount
        string category
        string brand
        array images
        number stock
    }

    ORDER {
        string user
        array items
        number totalPrice
        string status
        string paymentMethod
    }
```

---

## Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas
- **Media**: Cloudinary CDN