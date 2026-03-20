"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { products as defaultProducts } from "@/data/products";

const AppContext = createContext(null);

export const defaultStorefront = {
  name: "CoirCraft Philippines",
  tagline: "Premium eco-friendly coconut coir products from the Philippines.",
  heroTitle: "Sustainable Living\nStarts with Coconut Coir.",
  heroSubtitle:
    "Premium eco-friendly products handcrafted from Philippine coconut husks. Join thousands of happy customers.",
  announcement: "",
  address: "123 Coir Avenue, Quezon City, Metro Manila",
  hours: "Mon–Sat: 8:00 AM – 6:00 PM",
  contactEmail: "admin@coircraft.ph",
  contactPhone: "+63 912 345 6789",
  showTestimonials: true,
  showNewArrivals: true,
  showFeatured: true,
  accentColor: "#A8FF3E",
};

const LS = {
  user:           "cc_user",
  sellerLoggedIn: "cc_seller",
  cart:           "cc_cart",
  transactions:   "cc_transactions",
  wishlist:       "cc_wishlist",
  reviews:        "cc_reviews",
  storefront:     "cc_storefront",
};

const EMPTY = {
  user:             null,
  sellerLoggedIn:   false,
  cart:             [],
  transactions:     [],
  wishlist:         [],
  reviews:          [],
  inventory:        defaultProducts,
  storefront:       defaultStorefront,
  inventoryLoading: false,
};

function ls_read(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function ls_write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function AppProvider({ children }) {
  const [s, setS] = useState(EMPTY);

  // ── 1. Hydrate non-inventory state from localStorage ─────────────────────
  useEffect(() => {
    setS((prev) => ({
      ...prev,
      user:           ls_read(LS.user,           null),
      sellerLoggedIn: ls_read(LS.sellerLoggedIn, false),
      cart:           ls_read(LS.cart,           []),
      transactions:   ls_read(LS.transactions,   []),
      wishlist:       ls_read(LS.wishlist,        []),
      reviews:        ls_read(LS.reviews,         []),
      storefront:     ls_read(LS.storefront,      defaultStorefront),
    }));
  }, []);

  // ── 2. Fetch inventory from DATABASE on mount ─────────────────────────────
  useEffect(() => {
    const fetchInventory = async () => {
      setS((prev) => ({ ...prev, inventoryLoading: true }));
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setS((prev) => ({ ...prev, inventory: data, inventoryLoading: false }));
        } else {
          // DB table is empty — keep default products as fallback
          setS((prev) => ({ ...prev, inventory: defaultProducts, inventoryLoading: false }));
        }
      } catch (err) {
        console.warn("Could not fetch products from DB, using defaults:", err.message);
        setS((prev) => ({ ...prev, inventory: defaultProducts, inventoryLoading: false }));
      }
    };
    fetchInventory();
  }, []);

  // ── 3. Cross-tab sync via storage events ─────────────────────────────────
  useEffect(() => {
    const stateKey = Object.fromEntries(Object.entries(LS).map(([k, v]) => [v, k]));
    const handler = (e) => {
      // Re-fetch inventory when seller saves a change in another tab
      if (e.key === "cc_inventory_updated") {
        fetch("/api/products")
          .then((r) => r.json())
          .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
              setS((p) => ({ ...p, inventory: data }));
            }
          })
          .catch(() => {});
        return;
      }
      const key = stateKey[e.key];
      if (key && e.newValue !== null) {
        try { setS((p) => ({ ...p, [key]: JSON.parse(e.newValue) })); } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // ── Generic localStorage patch (for non-inventory state) ─────────────────
  const patch = useCallback((key, value) => {
    setS((p) => {
      ls_write(LS[key], value);
      return { ...p, [key]: value };
    });
  }, []);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const setUser           = useCallback((v) => patch("user",           v), [patch]);
  const setSellerLoggedIn = useCallback((v) => patch("sellerLoggedIn", v), [patch]);

  // ── Inventory: update local state AND signal other tabs to re-fetch DB ────
  const setInventory = useCallback((newInventory) => {
    setS((p) => ({ ...p, inventory: newInventory }));
    try { localStorage.setItem("cc_inventory_updated", Date.now().toString()); } catch {}
  }, []);

  // ── Storefront ────────────────────────────────────────────────────────────
  const setStorefront = useCallback((v) => patch("storefront", v), [patch]);

  // ── Cart ──────────────────────────────────────────────────────────────────
  const addToCart = useCallback((item) => {
    setS((p) => {
      const found = p.cart.find((i) => i.id === item.id);
      const cart = found
        ? p.cart.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...p.cart, { ...item, qty: 1 }];
      ls_write(LS.cart, cart);
      return { ...p, cart };
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setS((p) => {
      const cart = p.cart.filter((i) => i.id !== id);
      ls_write(LS.cart, cart);
      return { ...p, cart };
    });
  }, []);

  const updateQty = useCallback((id, qty) => {
    setS((p) => {
      const cart = p.cart.map((i) => i.id === id ? { ...i, qty } : i);
      ls_write(LS.cart, cart);
      return { ...p, cart };
    });
  }, []);

  const clearCart = useCallback(() => {
    setS((p) => { ls_write(LS.cart, []); return { ...p, cart: [] }; });
  }, []);

  // ── Transactions ──────────────────────────────────────────────────────────
  const addTransaction = useCallback((tx) => {
    setS((p) => {
      const transactions = [tx, ...p.transactions];
      ls_write(LS.transactions, transactions);
      return { ...p, transactions };
    });
  }, []);

  const setTransactions = useCallback((fn) => {
    setS((p) => {
      const transactions = typeof fn === "function" ? fn(p.transactions) : fn;
      ls_write(LS.transactions, transactions);
      return { ...p, transactions };
    });
  }, []);

  const markReceived = useCallback((id) => {
    setS((p) => {
      const transactions = p.transactions.map((t) =>
        t.id === id ? { ...t, status: "Received" } : t
      );
      ls_write(LS.transactions, transactions);
      return { ...p, transactions };
    });
  }, []);

  // ── Wishlist ──────────────────────────────────────────────────────────────
  const toggleWishlist = useCallback((productId) => {
    setS((p) => {
      const wishlist = p.wishlist.includes(productId)
        ? p.wishlist.filter((x) => x !== productId)
        : [...p.wishlist, productId];
      ls_write(LS.wishlist, wishlist);
      return { ...p, wishlist };
    });
  }, []);

  const isWishlisted = useCallback((id) => s.wishlist.includes(id), [s.wishlist]);

  // ── Reviews ───────────────────────────────────────────────────────────────
  const getProductReviews = useCallback(
    (id) => s.reviews.filter((r) => r.productId === id),
    [s.reviews]
  );

  const canReview = useCallback(
    (id) =>
      s.user &&
      s.transactions.some(
        (t) => t.status === "Received" && t.items?.some((i) => i.id === id)
      ),
    [s.user, s.transactions]
  );

  const addReview = useCallback((review) => {
    setS((p) => {
      const reviews = [
        review,
        ...p.reviews.filter(
          (r) => !(r.productId === review.productId && r.author === review.author)
        ),
      ];
      ls_write(LS.reviews, reviews);
      return { ...p, reviews };
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...s,
        setUser,
        setSellerLoggedIn,
        setInventory,
        setStorefront,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        addTransaction,
        setTransactions,
        markReceived,
        toggleWishlist,
        isWishlisted,
        addReview,
        getProductReviews,
        canReview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);