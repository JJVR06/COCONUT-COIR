import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BuyerLayout from "./components/BuyerLayout";

/* Buyer pages */
import Home from "./buyer/Home";
import Register from "./buyer/Register";
import Login from "./buyer/Login";
import Storefront from "./buyer/Storefront";
import Cart from "./buyer/Cart";
import Checkout from "./buyer/Checkout";
import History from "./buyer/History";

/* Seller pages */
import SellerLogin from "./seller/SellerLogin";
import Dashboard from "./seller/Dashboard";
import Inventory from "./seller/Inventory";
import Reports from "./seller/Reports";
import SellerStorefront from "./seller/Storefront";

function App() {
  return (
    <Router>

      <Routes>

        {/* ================= SELLER ROUTES ================= */}
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/seller/dashboard" element={<Dashboard />} />
        <Route path="/seller/inventory" element={<Inventory />} />
        <Route path="/seller/storefront" element={<SellerStorefront />} />
        <Route path="/seller/reports" element={<Reports />} />
        <Route path="/seller" element={<SellerLogin />} />

        {/* ================= BUYER ROUTES ================= */}
        <Route element={<BuyerLayout />}>

          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Storefront />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/history" element={<History />} />
          <Route path="/login" element={<Login />} />

        </Route>

      </Routes>

    </Router>
  );
}

export default App;