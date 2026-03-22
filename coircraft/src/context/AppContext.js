"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AppContext = createContext(null);

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

const DEFAULT_STOREFRONT = {
  heroTitle:        "Premium Philippine\nCoconut Coir Products",
  heroSubtitle:     "Eco-friendly, sustainably sourced from the Philippines.",
  announcement:     "",
  tagline:          "Premium eco-friendly coconut coir products made with love by Filipino artisans.",
  name:             "CoirCraft Philippines",
  address:          "123 Coir Avenue, Quezon City, Metro Manila",
  hours:            "Mon–Sat: 8:00 AM – 6:00 PM",
  contactEmail:     "InnoBytes@coircraft.ph",
  contactPhone:     "+63 912 345 6789",
  showFeatured:     true,
  showNewArrivals:  true,
  showTestimonials: true,
};

const DEFAULTS = {
  user:           null,
  sellerLoggedIn: false,
  cart:           [],
  transactions:   [],
  wishlist:       [],
  reviews:        {},
  inventory:      [],
  storefront:     DEFAULT_STOREFRONT,
};

export function AppProvider({ children }) {
  const [state,    setState]    = useState(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  // ── HYDRATE SESSION FROM LOCALSTORAGE ON MOUNT ──
  useEffect(() => {
    const user           = ls_read("cc_user",       null);
    const sellerLoggedIn = ls_read("cc_seller",     false);
    const storefront     = ls_read("cc_storefront", DEFAULT_STOREFRONT);
    setState((p) => ({ ...p, user, sellerLoggedIn, storefront }));
    setHydrated(true);
  }, []);

  // ── LOAD INVENTORY FROM DB ON MOUNT ──
  useEffect(() => {
    loadInventoryFromDB();
  }, []);

  // ── LOAD ALL USER DATA FROM DATABASE WHEN USER LOGS IN ──
  useEffect(() => {
    if (!hydrated) return;
    if (!state.user?.email) {
      setState((p) => ({ ...p, cart: [], transactions: [], wishlist: [], reviews: {} }));
      return;
    }
    const email = state.user.email;
    loadCartFromDB(email);
    loadWishlistFromDB(email);
    loadOrdersFromDB(email);
  }, [state.user?.email, hydrated]);

  // ── DB LOADERS ──
  const loadInventoryFromDB = async () => {
    try {
      const res  = await fetch("/api/products");
      const data = await res.json();
      if (Array.isArray(data)) {
        setState((p) => ({ ...p, inventory: data }));
      }
    } catch {}
  };

  const loadCartFromDB = async (email) => {
    try {
      const res  = await fetch(`/api/cart?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (Array.isArray(data)) setState((p) => ({ ...p, cart: data }));
    } catch {}
  };

  const loadWishlistFromDB = async (email) => {
    try {
      const res  = await fetch(`/api/wishlist?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (Array.isArray(data)) setState((p) => ({ ...p, wishlist: data }));
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

  // ── STOREFRONT ──
  const setStorefront = useCallback((sf) => {
    ls_write("cc_storefront", sf);
    setState((p) => ({ ...p, storefront: sf }));
  }, []);

  // ── INVENTORY ──
  const setInventory = useCallback((updater) => {
    setState((p) => {
      const inventory = typeof updater === "function" ? updater(p.inventory) : updater;
      return { ...p, inventory };
    });
  }, []);

  // ── CART ──
  const addToCart = useCallback(async (item) => {
    const email = state.user?.email;
    if (email) {
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
      if (email) await loadOrdersFromDB(email);
    } catch {
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
      inventory:      state.inventory,
      storefront:     state.storefront,
      setUser, setSellerLoggedIn,
      setStorefront,
      setInventory,
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