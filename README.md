# 🛒 ShopVerse - MERN E-Commerce Platform

ShopVerse is a full-stack e-commerce web application built using the MERN Stack. It allows users to browse products, manage their shopping cart, place orders, and provides an admin panel for product management.

---

# 🚀 Features

## 👤 User Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Logout

---

## 🛍️ Product Management

- View All Products
- View Product Details
- Product Categories
- Product Search
- Admin Product Management

---

## 🛒 Shopping Cart

- Add Product to Cart
- Update Quantity
- Remove Product
- Cart Total Calculation

---

## 📦 Orders

- Place Orders
- Shipping Address
- Order Summary
- View User Orders
- View Single Order

---

## 👨‍💼 Admin Features

- Create Products
- Update Products
- Delete Products
- View All Orders
- Manage Users

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- React Router DOM
- Redux Toolkit
- Axios
- CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

---

# 📂 Project Structure

```text
ShopVerse
│
├── backend
│   ├── src
│   │
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── config
│   └── server.js
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   ├── redux
│   ├── services
│   ├── utils
│   └── App.jsx
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/ShopVerse.git
```

Go inside project

```bash
cd ShopVerse
```

---

# Backend Setup

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY
```

Run Backend

```bash
npm run dev
```

---

# Frontend Setup

Open another terminal

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run Frontend

```bash
npm run dev
```

---

# 📌 API Endpoints

## Authentication

- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

## Products

- GET `/api/products`
- GET `/api/products/:id`
- POST `/api/products`
- PUT `/api/products/:id`
- DELETE `/api/products/:id`

## Cart

- POST `/api/cart`
- GET `/api/cart`
- PUT `/api/cart/:id`
- DELETE `/api/cart/:id`

## Orders

- POST `/api/orders`
- GET `/api/orders`
- GET `/api/orders/:id`

---

# 📸 Screenshots

Add screenshots after uploading them to your repository.

Suggested screenshots:

- Home Page
- Product Listing
- Product Details
- Shopping Cart
- Checkout
- Orders Page

---

# 🎯 Learning Outcomes

- MERN Stack Development
- REST API Development
- JWT Authentication
- MongoDB Database Design
- CRUD Operations
- Shopping Cart Logic
- Order Management
- React Routing
- Redux State Management

---

# 👨‍💻 Author

**Aditya Raj**

GitHub:
https://github.com/YOUR_GITHUB_USERNAME

---

# 📄 License

This project was developed for educational and learning purposes.
