"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AppContext = createContext(null);

// localStorage helpers — only for session (user login + seller)
function ls_read(key, fallback) {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function ls_write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function ls_remove(key) {
  try { localStorage.removeItem(key); } catch {}
}

const DEFAULTS = {
  user:           null,
  sellerLoggedIn: false,
  cart:           [],
  transactions:   [],
  wishlist:       [],
  reviews:        {},
};

export function AppProvider({ children }) {
  const [state,   setState]   = useState(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  // ── HYDRATE SESSION FROM LOCALSTORAGE ON MOUNT ──
  useEffect(() => {
    const user           = ls_read("cc_user",   null);
    const sellerLoggedIn = ls_read("cc_seller", false);
    setState((p) => ({ ...p, user, sellerLoggedIn }));
    setHydrated(true);
  }, []);

  // ── LOAD ALL USER DATA FROM DATABASE WHEN USER LOGS IN ──
  useEffect(() => {
    if (!hydrated) return;
    if (!state.user?.email) {
      // Clear all data on logout
      setState((p) => ({ ...p, cart: [], transactions: [], wishlist: [], reviews: {} }));
      return;
    }
    const email = state.user.email;
    loadCartFromDB(email);
    loadWishlistFromDB(email);
    loadOrdersFromDB(email);
  }, [state.user?.email, hydrated]);

  // ── DB LOADERS ──
  const loadCartFromDB = async (email) => {
    try {
      const res  = await fetch(`/api/cart?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setState((p) => ({ ...p, cart: data }));
      }
    } catch {}
  };

  const loadWishlistFromDB = async (email) => {
    try {
      const res  = await fetch(`/api/wishlist?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setState((p) => ({ ...p, wishlist: data }));
      }
    } catch {}
  };

  const loadOrdersFromDB = async (email) => {
    try {
      const res  = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const txs = data.map((o) => ({
          id:       o.id,
          date:     new Date(o.created_at).toLocaleString(),
          items:    typeof o.items === "string" ? JSON.parse(o.items) : o.items,
          total:    Number(o.total),
          method:   o.method,
          delivery: o.delivery,
          address:  o.address,
          status:   o.status,
        }));
        setState((p) => ({ ...p, transactions: txs }));
      }
    } catch {}
  };

  // ── USER ──
  const setUser = useCallback((u) => {
    ls_write("cc_user", u);
    setState((p) => ({ ...p, user: u }));
  }, []);

  const setSellerLoggedIn = useCallback((v) => {
    ls_write("cc_seller", v);
    setState((p) => ({ ...p, sellerLoggedIn: v }));
  }, []);

  // ── CART — all DB, fallback to local for guests ──
  const addToCart = useCallback(async (item) => {
    const email = state.user?.email;

    if (email) {
      // Logged in — save to DB
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, ...item }),
        });
        await loadCartFromDB(email);
        return;
      } catch {}
    }

    // Guest — save to localStorage
    setState((p) => {
      const found = p.cart.find((i) => i.id === item.id);
      const cart  = found
        ? p.cart.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...p.cart, { ...item, qty: 1 }];
      ls_write("cc_cart", cart);
      return { ...p, cart };
    });
  }, [state.user?.email]);

  const removeFromCart = useCallback(async (id) => {
    const email = state.user?.email;
    if (email) {
      try {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, id }),
        });
        await loadCartFromDB(email);
        return;
      } catch {}
    }
    setState((p) => {
      const cart = p.cart.filter((i) => i.id !== id);
      ls_write("cc_cart", cart);
      return { ...p, cart };
    });
  }, [state.user?.email]);

  const updateQty = useCallback(async (id, qty) => {
    const email = state.user?.email;
    if (email) {
      try {
        await fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, id, qty }),
        });
        await loadCartFromDB(email);
        return;
      } catch {}
    }
    setState((p) => {
      const cart = p.cart.map((i) => i.id === id ? { ...i, qty } : i);
      ls_write("cc_cart", cart);
      return { ...p, cart };
    });
  }, [state.user?.email]);

  const clearCart = useCallback(async () => {
    const email = state.user?.email;
    if (email) {
      try {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, id: "all" }),
        });
      } catch {}
    }
    ls_remove("cc_cart");
    setState((p) => ({ ...p, cart: [] }));
  }, [state.user?.email]);

  // ── ORDERS ──
  const addTransaction = useCallback(async (tx) => {
    const email = state.user?.email || "";
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id:         tx.id,
          user_email: email,
          items:      tx.items,
          total:      tx.total,
          method:     tx.method,
          delivery:   tx.delivery,
          address:    tx.address || "",
          status:     "Pending",
        }),
      });
      // Reload orders from DB to stay in sync
      if (email) await loadOrdersFromDB(email);
    } catch {
      // Fallback to local state
      setState((p) => ({ ...p, transactions: [tx, ...p.transactions] }));
    }
  }, [state.user?.email]);

  const setTransactions = useCallback((updater) => {
    setState((p) => {
      const transactions = typeof updater === "function" ? updater(p.transactions) : updater;
      return { ...p, transactions };
    });
  }, []);

  const markReceived = useCallback(async (txId) => {
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: txId, status: "Received" }),
      });
      // Reload from DB
      if (state.user?.email) await loadOrdersFromDB(state.user.email);
    } catch {
      setState((p) => ({
        ...p,
        transactions: p.transactions.map((t) =>
          t.id === txId ? { ...t, status: "Received" } : t
        ),
      }));
    }
  }, [state.user?.email]);

  // ── WISHLIST ──
  const toggleWishlist = useCallback(async (productId) => {
    const email = state.user?.email;
    if (email) {
      try {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, productId }),
        });
        await loadWishlistFromDB(email);
        return;
      } catch {}
    }
    // Guest fallback
    setState((p) => ({
      ...p,
      wishlist: p.wishlist.includes(productId)
        ? p.wishlist.filter((id) => id !== productId)
        : [...p.wishlist, productId],
    }));
  }, [state.user?.email]);

  const isWishlisted = useCallback(
    (productId) => state.wishlist.includes(Number(productId)) || state.wishlist.includes(String(productId)),
    [state.wishlist]
  );

  // ── REVIEWS ──
  const addReview = useCallback(async (review) => {
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId:  review.productId,
          userEmail:  state.user?.email || "",
          author:     review.author,
          rating:     review.rating,
          comment:    review.comment || "",
        }),
      });
      // Refresh reviews from DB
      await getProductReviews(review.productId);
    } catch {}
  }, [state.user?.email]);

  const getProductReviews = useCallback(async (productId) => {
    try {
      const res  = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped = data.map((r) => ({
          productId: r.product_id,
          author:    r.author,
          rating:    r.rating,
          comment:   r.comment,
          date:      new Date(r.created_at).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }),
        }));
        setState((p) => ({ ...p, reviews: { ...p.reviews, [productId]: mapped } }));
        return mapped;
      }
    } catch {}
    return state.reviews[productId] || [];
  }, []);

  const getProductReviewsSync = useCallback(
    (productId) => state.reviews[productId] || [],
    [state.reviews]
  );

  const canReview = useCallback(
    (productId) => {
      if (!state.user) return false;
      return state.transactions.some(
        (t) => t.status === "Received" && t.items?.some((i) => Number(i.id) === Number(productId))
      );
    },
    [state.user, state.transactions]
  );

  return (
    <AppContext.Provider value={{
      user:           state.user,
      sellerLoggedIn: state.sellerLoggedIn,
      cart:           state.cart,
      transactions:   state.transactions,
      wishlist:       state.wishlist,
      reviews:        state.reviews,
      setUser, setSellerLoggedIn,
      addToCart, removeFromCart, updateQty, clearCart,
      addTransaction, setTransactions, markReceived,
      toggleWishlist, isWishlisted,
      addReview, getProductReviews, getProductReviewsSync, canReview,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);