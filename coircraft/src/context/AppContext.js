"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AppContext = createContext(null);

// Safe defaults — identical on server and client
const EMPTY = {
  user:           null,
  sellerLoggedIn: false,
  cart:           [],
  transactions:   [],
  wishlist:       [],
  reviews:        [],
};

function ls_read(key, fallback) {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function ls_write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* noop */ }
}

export function AppProvider({ children }) {
  const [s, setS] = useState(EMPTY); // always starts as EMPTY — same on server + client

  // Load from localStorage after first client paint — ONE setState, ONE re-render
  useEffect(() => {
    setS({
      user:           ls_read("cc_user",        null),
      sellerLoggedIn: ls_read("cc_seller",       false),
      cart:           ls_read("cc_cart",         []),
      transactions:   ls_read("cc_transactions", []),
      wishlist:       ls_read("cc_wishlist",     []),
      reviews:        ls_read("cc_reviews",      []),
    });
  }, []);

  const patch = useCallback((key, value) => {
    setS((p) => {
      const next = { ...p, [key]: value };
      ls_write({ user:"cc_user", sellerLoggedIn:"cc_seller", cart:"cc_cart", transactions:"cc_transactions", wishlist:"cc_wishlist", reviews:"cc_reviews" }[key], value);
      return next;
    });
  }, []);

  const setUser           = useCallback((v) => patch("user", v),           [patch]);
  const setSellerLoggedIn = useCallback((v) => patch("sellerLoggedIn", v), [patch]);

  const addToCart = useCallback((item) => {
    setS((p) => {
      const found = p.cart.find((i) => i.id === item.id);
      const cart  = found ? p.cart.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...p.cart, { ...item, qty: 1 }];
      ls_write("cc_cart", cart);
      return { ...p, cart };
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setS((p) => { const cart = p.cart.filter((i) => i.id !== id); ls_write("cc_cart", cart); return { ...p, cart }; });
  }, []);

  const updateQty = useCallback((id, qty) => {
    setS((p) => { const cart = p.cart.map((i) => i.id === id ? { ...i, qty } : i); ls_write("cc_cart", cart); return { ...p, cart }; });
  }, []);

  const clearCart = useCallback(() => {
    setS((p) => { ls_write("cc_cart", []); return { ...p, cart: [] }; });
  }, []);

  const addTransaction = useCallback((tx) => {
    setS((p) => { const transactions = [tx, ...p.transactions]; ls_write("cc_transactions", transactions); return { ...p, transactions }; });
  }, []);

  const setTransactions = useCallback((fn) => {
    setS((p) => { const transactions = typeof fn === "function" ? fn(p.transactions) : fn; ls_write("cc_transactions", transactions); return { ...p, transactions }; });
  }, []);

  const markReceived = useCallback((id) => {
    setS((p) => { const transactions = p.transactions.map((t) => t.id === id ? { ...t, status: "Received" } : t); ls_write("cc_transactions", transactions); return { ...p, transactions }; });
  }, []);

  const toggleWishlist = useCallback((productId) => {
    setS((p) => {
      const wishlist = p.wishlist.includes(productId) ? p.wishlist.filter((x) => x !== productId) : [...p.wishlist, productId];
      ls_write("cc_wishlist", wishlist);
      return { ...p, wishlist };
    });
  }, []);

  const isWishlisted      = useCallback((id) => s.wishlist.includes(id), [s.wishlist]);
  const getProductReviews = useCallback((id) => s.reviews.filter((r) => r.productId === id), [s.reviews]);
  const canReview         = useCallback((id) => s.user && s.transactions.some((t) => t.status === "Received" && t.items?.some((i) => i.id === id)), [s.user, s.transactions]);

  const addReview = useCallback((review) => {
    setS((p) => {
      const reviews = [review, ...p.reviews.filter((r) => !(r.productId === review.productId && r.author === review.author))];
      ls_write("cc_reviews", reviews);
      return { ...p, reviews };
    });
  }, []);

  return (
    <AppContext.Provider value={{ ...s, setUser, setSellerLoggedIn, addToCart, removeFromCart, updateQty, clearCart, addTransaction, setTransactions, markReceived, toggleWishlist, isWishlisted, addReview, getProductReviews, canReview }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);