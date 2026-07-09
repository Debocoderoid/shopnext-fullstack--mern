<div align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" alt="ShopNext Logo" width="80" />
  <h1>ShopNext — Full-Stack MERN E-Commerce Platform</h1>
  <p>A full-stack e-commerce application built with <b>React + Redux + Node.js/Express + MongoDB</b>, featuring product browsing, cart & checkout, Razorpay payments, order tracking, and a full admin dashboard for managing products, orders, and users.</p>

  ![Node](https://img.shields.io/badge/Node.js-≥18-339933?logo=node.js&logoColor=white)
  ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
  ![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
  ![Razorpay](https://img.shields.io/badge/Payments-Razorpay-0C2451?logo=razorpay&logoColor=white)
</div>

<img width="1873" height="693" alt="image" src="https://github.com/user-attachments/assets/cad60270-8b80-4ee0-9686-9e9653210a58" />
<img width="1883" height="902" alt="image" src="https://github.com/user-attachments/assets/b35ba45a-f9d9-4031-88ff-041a8777322a" />
<img width="1886" height="908" alt="image" src="https://github.com/user-attachments/assets/ab3301e6-534a-472c-b245-34d00c014b7a" />


---

## 🚀 Setup Instructions

### Prerequisites
- Node.js ≥ 18
- MongoDB (Atlas or local)
- A Cloudinary account (for product image uploads)
- A Razorpay account (for payments)
- Git

---

### 1. Clone the Repository
```bash
git clone https://github.com/Debocoderoid/shopnext-fullstack--mern.git
cd shopnext-fullstack--mern
```

### 2. Install Dependencies
This repo has a root, backend, and frontend `package.json`. You can install everything in one shot:
```bash
npm run install-all
```

### 3. Configure Environment Variables
Create a `.env` file inside `backend/` (use `backend/.env.example` as a starting point):
```bash
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
PORT=5000

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Run in Development
From the project root, this starts backend (nodemon) and frontend (React dev server) together:
```bash
npm run dev
```
- Backend → `http://localhost:5000`
- Frontend → `http://localhost:3000`

Or run them separately:
```bash
npm run start:backend    # backend only
npm run start:frontend   # frontend only
```

### 5. Seed the Database (optional)
Populates the DB with an admin user, a sample user, and demo products, then wipes and re-inserts on every run:
```bash
npm run seed
```
> **Seed Admin Login:** `admin@shopnext.com` / `123456`
> **Seed User Login:** `debo@example.com` / `123456`

### 6. Production Build
```bash
npm run build     # builds the frontend
npm start          # serves backend (and built frontend, if NODE_ENV=production)
```

---

## ✅ Features Implemented

### Customer-Facing
- **Auth** — Register/login with JWT, email/OTP verification (`verified` flag on User model)
- **Product Browsing** — Shop page, product details, category/brand info, ratings & review count
- **Cart** — Redux-powered cart (`cartSlice`) with persistent state across the session
- **Checkout & Payments** — Razorpay order creation + payment verification flow
- **Order Tracking** — Order success page, "My Orders" (`/api/order/myorders`)
- **Profile Management** — User profile page
- **Static Pages** — About, Return Policy, Disclaimer

### Admin Dashboard
- **Product Management** — Add / edit / delete products, image upload via Multer → Cloudinary
- **Order Management** — View all orders, update order status (`Pending → Processing → Shipped → Delivered → Cancelled`)
- **User Management** — View registered users (admin-only, role-gated)
- **Analytics** — Admin stats endpoint for dashboard insights

### Backend Architecture
- **Role-based access control** — `protect` (JWT auth) + `admin` (role-check) middleware chain on sensitive routes
- **Image uploads** — Multer (local temp storage) → Cloudinary (persistent hosting)
- **Email** — Nodemailer integration for verification/notifications
- **CORS** — Configured for local + deployed frontend origins

---
## ☁️ Deploying on Vercel (Frontend + Backend as Two Projects)
 
Vercel now supports deploying Express apps directly (zero-config), but it runs them as **serverless functions**, not a persistent server. That means:
- The filesystem is read-only (except `/tmp`, which doesn't persist) — this repo's image upload path has already been updated to upload directly from memory to Cloudinary instead of writing to disk, so it works on Vercel.
- `express.static()` doesn't serve files on Vercel, so the "serve the React build from Express" block in `server.js` is a no-op there — deploy the frontend as its **own** Vercel project instead.
- MongoDB connections are cached across warm invocations (already handled in `backend/src/config/db.js`) to avoid exhausting Atlas's connection limit.
### 1. Deploy the backend
1. In Vercel, **Add New Project** → import this repo.
2. Set **Root Directory** to `backend`.
3. Framework preset: Vercel auto-detects Express — no `vercel.json` needed.
4. Add environment variables (Project Settings → Environment Variables):
```
   MONGO_URI=...
   JWT_SECRET=...
   EMAIL_USER=...
   EMAIL_PASS=...
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   RAZORPAY_KEY_ID=...
   RAZORPAY_KEY_SECRET=...
   FRONTEND_URL=https://your-frontend-project.vercel.app
   NODE_ENV=production
```
5. In MongoDB Atlas → Network Access, allow `0.0.0.0/0` (Vercel functions run from dynamic IPs).
6. Deploy. You'll get a URL like `https://shopnext-backend.vercel.app`.
### 2. Deploy the frontend
1. **Add New Project** again → same repo, but set **Root Directory** to `frontend`.
2. Vercel auto-detects Create React App (`react-scripts`).
3. Add an environment variable pointing at your deployed backend, e.g. `REACT_APP_API_URL=https://shopnext-backend.vercel.app/api`, and make sure your frontend's API calls use it instead of the CRA `proxy` field (the `proxy` setting in `frontend/package.json` only works in local dev, not in production builds).
4. Deploy. You'll get a URL like `https://shopnext.vercel.app`.
### 3. Connect the two
- Update the backend's `FRONTEND_URL` env var to match the deployed frontend URL, then redeploy the backend (this feeds into the CORS `origin` list in `server.js`).

---

## 📁 Project Structure
```
shopnext-fullstack--mern/
├── backend/
│   ├── src/
│   │   ├── config/            db.js (Mongoose connection), cloudinary.js
│   │   ├── controllers/       auth, product, order, payment, analytics
│   │   ├── middlewares/       auth.middleware (JWT), admin.middleware (role check)
│   │   ├── models/            User, Product, Order (Mongoose schemas)
│   │   ├── routes/            /api/auth, /api/products, /api/order, /api/payment, /api/analytics
│   │   └── utils/             sendEmail.js
│   ├── uploads/                temp storage before Cloudinary upload
│   ├── seed.js                 DB seeding script
│   └── server.js                Express app entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── admin/              AdminDashboard, AdminProducts, AdminOrders, AdminUsers, AddProduct, EditProduct
│   │   ├── components/         Navbar, Footer, ProductCard
│   │   ├── context/             AuthContext.jsx
│   │   ├── pages/               home, shop, productDetails, cart, checkout, login, register, profile, orderSuccess, about, ReturnPolicy, disclaimer
│   │   ├── redux/               store.js, cartSlice.js
│   │   └── styles/               global.css, auth.css, cart.css, navbar.css, product.css
│   └── public/
│
└── package.json                  root scripts (install-all, dev, build, seed)
```

---

## 📮 API Reference

Base URL: `http://localhost:5000/api`

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login, returns JWT |
| POST | `/verify-email` | Public | Verify email via OTP |
| GET | `/users` | Admin | List all users |

### Products — `/api/products`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Public | List all products |
| GET | `/:id` | Public | Get single product |
| POST | `/` | Admin | Create product (with image upload) |
| PUT | `/:id` | Admin | Update product (with image upload) |
| DELETE | `/:id` | Admin | Delete product |

### Orders — `/api/order`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | User | Create order |
| GET | `/` | Admin | List all orders |
| GET | `/myorders` | User | Get logged-in user's orders |
| PUT | `/:id/status` | Admin | Update order status |

### Payment — `/api/payment`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/order` | User | Create a Razorpay order |
| POST | `/verify-payment` | User | Verify Razorpay payment signature |

### Analytics — `/api/analytics`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Admin | Get admin dashboard stats |

---

## 🗃️ Data Models

**User**: `name`, `email` (unique), `password` (hashed), `role` (`user`/`admin`), `otp`, `otpExpiry`, `verified`, timestamps

**Product**: `name`, `description`, `price`, `category`, `brand`, `stock`, `image` (`{ public_id, url }` from Cloudinary), `ratings`, `numOfReviews`, timestamps

**Order**: `userId` (ref User), `products[]` (`productId`, `quantity`, `price`), `totalAmount`, `shippingAddress` (`fullName`, `phone`, `address`, `city`, `state`, `postalCode`, `country`), `paymentID`, `status` (enum), timestamps

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router 7, Redux Toolkit, React Redux, Context API (auth) |
| Backend | Node.js, Express 5 |
| Database | MongoDB + Mongoose 9 |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Payments | Razorpay |
| Media | Multer (upload) → Cloudinary (storage) |
| Email | Nodemailer |
| Dev Tooling | Nodemon, Concurrently (monorepo dev script) |

---

## 👤 Author
**Debojyoti Roy**
