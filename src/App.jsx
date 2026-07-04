import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import ScrollToTop from './components/ScrollToTop';
import FloatingWidgets from './components/FloatingWidgets';
import { AppProvider } from './context/AppContext';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminHome from './pages/admin/AdminHome';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBrands from './pages/admin/AdminBrands';
import AdminSettings from './pages/admin/AdminSettings';

import CustomCursor from './components/CustomCursor';

function PublicLayout({ children }) {
  return (
    <>
      {/* ══════════════════════════════════════════════════
          FULL-PAGE ANIMATED BACKGROUND SYSTEM
      ══════════════════════════════════════════════════ */}
      <div className="ambient-background" aria-hidden="true">
        {/* Layer 1: Deep aurora colour wash */}
        <div className="ab-aurora" />

        {/* Layer 2: Moving mesh gradient */}
        <div className="ab-mesh" />

        {/* Layer 3: Large slow orbs */}
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
        <div className="ambient-orb orb-3" />
        <div className="ambient-orb orb-4" />
        <div className="ambient-orb orb-5" />

        {/* Layer 4: Light beams / scanlines */}
        <div className="ab-beam ab-beam-1" />
        <div className="ab-beam ab-beam-2" />
        <div className="ab-beam ab-beam-3" />

        {/* Layer 5: Floating geometric shapes */}
        <div className="ab-shape ab-shape-1" />
        <div className="ab-shape ab-shape-2" />
        <div className="ab-shape ab-shape-3" />
        <div className="ab-shape ab-shape-4" />
        <div className="ab-shape ab-shape-5" />
        <div className="ab-shape ab-shape-6" />

        {/* Layer 6: Particle dots */}
        <div className="ab-particles">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="ab-particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 10}s`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              opacity: 0.2 + Math.random() * 0.5,
            }} />
          ))}
        </div>

        {/* Layer 7: Fine grid */}
        <div className="ambient-grid" />

        {/* Layer 8: Subtle noise texture */}
        <div className="ambient-noise" />
      </div>

      <CustomCursor />
      <Navbar />
      {children}
      <Footer />
      <FloatingWidgets />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes — with Navbar/Footer */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/shop" element={<PublicLayout><Shop /></PublicLayout>} />
          <Route path="/product/:id" element={<PublicLayout><ProductDetails /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
          <Route path="/verify-otp" element={<PublicLayout><VerifyOTP /></PublicLayout>} />
          <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
          <Route path="/profile" element={<PublicLayout><Profile /></PublicLayout>} />
          <Route path="/wishlist" element={<PublicLayout><Wishlist /></PublicLayout>} />
          <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
          <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />

          {/* Admin Routes — no Navbar/Footer, full-page layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="add-product" element={<AdminAddProduct />} />
            <Route path="edit/:id" element={<AdminAddProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}
