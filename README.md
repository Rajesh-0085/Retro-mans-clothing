# RETRO MEN'S CLOTHING — Full MERN E-Commerce Website

A modern, full-stack MERN e-commerce application for **RETRO MEN'S CLOTHING**, selling vintage-inspired menswear, heavyweight Japanese selvedge denim, archival workwear jackets, and streetwear classics.

Designed faithfully from the **Figma Design System** (`#FAF9F6` warm off-white background, `#171717` near-black typography, `#77746F` muted captions, `#E7E4DE` subtle borders, and 3:4 editorial portrait aspect ratios).

---

## 🌟 Key Features

### 🛍️ Customer Experience

- **Figma-Faithful Homepage**:
  - Editorial Hero section with bold typography: _"STYLE THAT LASTS: RETRO FASHION"_ and dual CTAs.
  - Value proposition strip: 100% Organic Cotton, Selvedge Denim, Free Shipping, 15-Day Returns.
  - Curated New Arrivals grid with instant category filter tabs (Jackets, Shirts, Jeans, T-Shirts).
  - Editorial Lookbook Campaign: _"The Heritage Workwear & Denim Edit"_.
  - Curated silhouette department showcase.
  - Live Archive Newsletter subscription banner.
- **Product Catalog & Filters (PLP)**:
  - Category, Price Range slider, Size pills (S, M, L, XL, XXL), and Keyword search.
  - Responsive Offcanvas Drawer for mobile filters.
  - Sorting: Newest Arrivals, Price: Low to High, Price: High to Low, Rating.
- **Product Details Page (PDP)**:
  - Multi-angle editorial image gallery with interactive thumbnail switcher.
  - Size selection with interactive **Size Guide Modal** (with measurements in inches).
  - **Size Selection Validation**: Prevents adding clothing without choosing a required size.
  - Color swatches, stock counter, and quantity controls.
  - Complete the look / Related Products carousel.
- **Interactive Shopping Bag**:
  - Live **Free Delivery Progress Bar** (Unlocks free delivery over ₹2,999).
  - Quantity increment/decrement and item removal.
  - Persistent shopping bag in `localStorage` across page refreshes.
- **Cash on Delivery (COD) Checkout**:
  - Customer details and Pan-India shipping address validation.
  - Real-time server-side order calculation (protects against browser price tampering).
  - Confetti celebration upon successful placement.
- **Customer Order History**:
  - View order status: `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`.
  - Itemized breakdowns and one-click order cancellation for pending orders.
- **Personal Wishlist**:
  - Bookmark favorite items with instant heart icon toggles.
- **Instant Search Modal**:
  - Keyboard-friendly live search modal with instant product previews.

### 🛡️ Admin Dashboard (Protected Access)

- **Store Overview Metrics**:
  - Live Total Revenue (calculated from actual orders in MongoDB).
  - Total Orders, Products, and Customer profiles.
  - Order status distribution counters.
  - Low stock warning alerts.
- **Product Catalog Management**:
  - Add new garments with multiple image URLs, category, price, discount price, sizes, colors, and stock.
  - Edit existing products and toggle "Featured" status.
  - Delete products with safety confirmation.
- **Order Management**:
  - View all customer orders with delivery destinations and contact details.
  - Filter orders by status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
  - Update order delivery status in real-time.

---

## 🎨 Design Tokens & Palette

| Token          | Hex Code  | Purpose                              |
| -------------- | --------- | ------------------------------------ |
| Background     | `#FAF9F6` | Warm off-white canvas                |
| Primary Text   | `#171717` | Near-black editorial typography      |
| Secondary Text | `#77746F` | Muted descriptions and captions      |
| Surface        | `#FFFFFF` | Clean card and modal surfaces        |
| Borders        | `#E7E4DE` | Minimalist subtle divider borders    |
| Accent Tone    | `#EDE8DF` | Editorial lookbook section highlight |

---

## 💻 Tech Stack

- **Frontend**: React 18, Vite, Bootstrap 5, Lucide React, Axios, React Router DOM, Canvas Confetti.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT (JSON Web Tokens), bcryptjs, Morgan, CORS.
- **State Management**: React Context API (`AuthContext`, `CartContext`, `WishlistContext`).

---

## ⚡ Quick Start & Installation

### 1. Prerequisites

- **Node.js** v18+ (tested with v26.7.0)
- **MongoDB** running locally on `mongodb://127.0.0.1:27017` (or MongoDB Atlas)

---

### 2. How to Run the Website (3 Ways)

#### Option A: In VS Code (Recommended)
Press **`F5`** (or go to **Run & Debug** > **Launch Chrome against localhost**).
> The VS Code `preLaunchTask` will automatically start both the backend and frontend dev servers and launch Chrome at `http://localhost:5173/`.

#### Option B: One-Click on Windows
Double-click **`run.bat`** in the project root folder. It boots up both servers simultaneously.

#### Option C: Terminal Single Command
From the root project directory:
```bash
npm start
# or: node run.js
```

---

### 3. Individual Component Commands (Optional)

**Backend:**
```bash
cd backend
npm run seed     # Seeds menswear catalog and admin account (saruksha0@gmail.com)
npm run dev      # Runs Express backend on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm run dev      # Runs Vite React frontend on http://localhost:5173
```

## 🔑 Admin Access

Log in with your administrator account to access the `/admin` dashboard:

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `saruksha0@gmail.com` | `admin123` | Full access to `/admin` dashboard, product CRUD & order management |
| **Customer** | *Register a new account via the `/register` page* | — | Shopping, bag, checkout, and personal order tracking |

---

## 📡 REST API Endpoints

### Authentication

- `POST /api/auth/register` — Register customer
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/profile` — Get authenticated user details

### Products

- `GET /api/products` — Get filtered, searched, paginated catalog
- `GET /api/products/featured` — Get featured items
- `GET /api/products/:idOrSlug` — Get single product & related items
- `POST /api/products` — Create product _(Admin only)_
- `PUT /api/products/:id` — Update product _(Admin only)_
- `DELETE /api/products/:id` — Delete product _(Admin only)_

### Orders

- `POST /api/orders` — Place order _(Customer only, prices calculated on server)_
- `GET /api/orders/my` — Get logged-in customer's orders
- `GET /api/orders/:id` — Get order receipt
- `PUT /api/orders/:id/cancel` — Cancel pending order
- `GET /api/orders` — List all store orders _(Admin only)_
- `PUT /api/orders/:id/status` — Update order status _(Admin only)_

### Admin

- `GET /api/admin/stats` — Store dashboard metrics & sales breakdown _(Admin only)_

---

## 📱 Responsive Testing Viewports

The website is fully responsive and tested for:

- **Mobile**: `375px`, `390px`, `430px` (2-column product grid, collapsible nav drawer, touch targets)
- **Tablet**: `768px`
- **Desktop**: `1024px`, `1280px`, `1440px`
