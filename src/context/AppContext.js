"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext({});

export function AppProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [cart, setCart] = useState([]);
  const [sellerLoggedIn, setSellerLoggedInState] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const u = localStorage.getItem("cc_user");
    const c = localStorage.getItem("cc_cart");
    const s = localStorage.getItem("cc_seller");
    if (u) setUserState(JSON.parse(u));
    if (c) setCart(JSON.parse(c));
    if (s) setSellerLoggedInState(JSON.parse(s));
  }, []);

  const setUser = (u) => {
    setUserState(u);
    if (u) localStorage.setItem("cc_user", JSON.stringify(u));
    else localStorage.removeItem("cc_user");
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const updated = existing
        ? prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...item, qty: 1 }];
      localStorage.setItem("cc_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      localStorage.setItem("cc_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const updateQty = (id, qty) => {
    setCart((prev) => {
      const updated = prev.map((i) => i.id === id ? { ...i, qty } : i);
      localStorage.setItem("cc_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cc_cart");
  };

  const setSellerLoggedIn = (v) => {
    setSellerLoggedInState(v);
    localStorage.setItem("cc_seller", JSON.stringify(v));
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      cart, addToCart, removeFromCart, updateQty, clearCart,
      sellerLoggedIn, setSellerLoggedIn
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);