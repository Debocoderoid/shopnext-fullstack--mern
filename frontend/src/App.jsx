import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './pages/about';
import Disclaimer from './pages/disclaimer';
import ReturnPolicy from './pages/ReturnPolicy';
import Login from './pages/login';
import Register from './pages/register';
import ProductDetail from './pages/productDetails';
import Cart from './pages/cart';
import Checkout from './pages/checkout';
import Shop from './pages/shop';
import Home from './pages/home';
import Profile from './pages/profile';
import OrderSuccess from './pages/orderSuccess';
import AdminDashboard from './admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/return" element={<ReturnPolicy />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ordersuccess" element={<OrderSuccess />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* <Route path="/admin/add-product" element={<AddProduct />} /> */}
          {/* <Route path="/admin/products" element={<AdminProducts />} /> */}
          {/* <Route path="/admin/edit-product/:id" element={<EditProduct />} /> */}
          {/* <Route path="/admin/orders" element={<AdminOrders />} /> */}
          {/* <Route path="/admin/users" element={<AdminUsers />} /> */}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;