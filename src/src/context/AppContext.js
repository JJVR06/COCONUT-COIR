"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext({});

export function AppProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [cart, setCart] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [sellerLoggedIn, setSellerLoggedInState] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("cc_user");
    const c = localStorage.getItem("cc_cart");
    const t = localStorage.getItem("cc_transactions");
    const s = localStorage.getItem("cc_seller");
    if (u) setUserState(JSON.parse(u));
    if (c) setCart(JSON.parse(c));
    if (t) setTransactions(JSON.parse(t));
    if (s) setSellerLoggedInState(JSON.parse(s));
  }, []);

  const setUser = (u) => {
    setUserState(u);
    localStorage.setItem("cc_user", JSON.stringify(u));
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
    localStorage.setItem("cc_cart", JSON.stringify([]));
  };

  const addTransaction = (t) => {
    setTransactions((prev) => {
      const updated = [t, ...prev];
      localStorage.setItem("cc_transactions", JSON.stringify(updated));
      return updated;
    });
  };

  const setSellerLoggedIn = (v) => {
    setSellerLoggedInState(v);
    localStorage.setItem("cc_seller", JSON.stringify(v));
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      cart, addToCart, removeFromCart, updateQty, clearCart,
      transactions, addTransaction,
      sellerLoggedIn, setSellerLoggedIn
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);