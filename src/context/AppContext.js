"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext({});

export function AppProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [cart, setCart] = useState([]);
  const [sellerLoggedIn, setSellerLoggedInState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const u = localStorage.getItem("cc_user");
      const c = localStorage.getItem("cc_cart");
      const s = localStorage.getItem("cc_seller");
      if (u) setUserState(JSON.parse(u));
      if (c) setCart(JSON.parse(c));
      if (s) setSellerLoggedInState(JSON.parse(s));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }, []);

  const setUser = (u) => {
    setUserState(u);
    try {
      if (u) localStorage.setItem("cc_user", JSON.stringify(u));
      else localStorage.removeItem("cc_user");
    } catch (e) {}
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const updated = existing
        ? prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...item, qty: 1 }];
      try { localStorage.setItem("cc_cart", JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      try { localStorage.setItem("cc_cart", JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  const updateQty = (id, qty) => {
    setCart((prev) => {
      const updated = prev.map((i) => i.id === id ? { ...i, qty } : i);
      try { localStorage.setItem("cc_cart", JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    try { localStorage.removeItem("cc_cart"); } catch (e) {}
  };

  const setSellerLoggedIn = (v) => {
    setSellerLoggedInState(v);
    try { localStorage.setItem("cc_seller", JSON.stringify(v)); } catch (e) {}
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      cart, addToCart, removeFromCart, updateQty, clearCart,
      sellerLoggedIn, setSellerLoggedIn,
      mounted
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);