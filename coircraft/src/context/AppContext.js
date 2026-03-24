"use client";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const AppContext = createContext(null);

const INVENTORY_TTL = 5 * 60 * 1000; // 5 minutes

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

// ── Single source of truth for default storefront values ─────────────────
// StorefrontClient.js should import this instead of defining its own copy.
export const DEFAULT_STOREFRONT = {
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
  user:             null,
  sellerLoggedIn:   false,
  cart:             [],
  transactions:     [],
  wishlist:         [],
  reviews:          {},     // { [String(productId)]: review[] } — buyer detail pages
  allReviews:       [],     // flat array — seller reviews dashboard
  inventory:        [],
  inventoryLoaded:  false,
  storefront:       DEFAULT_STOREFRONT,
};

/** Map a raw DB order row → context transaction shape */
function mapOrder(o) {
  return {
    id:         o.id,
    date:       new Date(o.created_at).toLocaleString(),
    created_at: o.created_at,
    items:      typeof o.items === "string" ? JSON.parse(o.items) : (o.items ?? []),
    total:      Number(o.total),
    method:     o.method,
    delivery:   o.delivery,
    address:    o.address,
    status:     o.status,
    user_email: o.user_email,
  };
}

/** Map a raw DB review row → context review shape */
function mapReview(r) {
  return {
    productId:  r.product_id,
    userEmail:  r.user_email,
    author:     r.author,
    rating:     r.rating,
    comment:    r.comment,
    date:       new Date(r.created_at).toLocaleDateString("en-PH", {
                  year: "numeric", month: "long", day: "numeric",
                }),
  };
}

export function AppProvider({ children }) {
  const [state,    setState]    = useState(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);
  const stateRef   = useRef(state);
  stateRef.current = state;

  // ── HYDRATE FROM LOCALSTORAGE ON MOUNT ──────────────────────────────────
  useEffect(() => {
    const user           = ls_read("cc_user",       null);
    const sellerLoggedIn = ls_read("cc_seller",     false);
    const cachedSf       = ls_read("cc_storefront", DEFAULT_STOREFRONT);

    // Immediately show cached inventory so the homepage is never blank
    const cached = ls_read("cc_inventory_cache", null);
    const cachedInventory = (cached?.data && Array.isArray(cached.data) && cached.data.length > 0)
      ? cached.data : [];

    setState((p) => ({
      ...p,
      user,
      sellerLoggedIn,
      storefront: { ...DEFAULT_STOREFRONT, ...cachedSf },
      inventory:  cachedInventory,
    }));
    setHydrated(true);
  }, []);

  // ── DB LOADERS ──────────────────────────────────────────────────────────

  const loadInventoryFromDB = useCallback(async () => {
    try {
      const cached = ls_read("cc_inventory_cache", null);
      const now    = Date.now();
      if (
        cached?.ts &&
        (now - cached.ts) < INVENTORY_TTL &&
        Array.isArray(cached.data) &&
        cached.data.length > 0
      ) {
        setState((p) => ({ ...p, inventory: cached.data, inventoryLoaded: true }));
        return;
      }
      const res  = await fetch("/api/products");
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      if (Array.isArray(data)) {
        ls_write("cc_inventory_cache", { ts: now, data });
        setState((p) => ({ ...p, inventory: data, inventoryLoaded: true }));
      } else {
        setState((p) => ({ ...p, inventoryLoaded: true }));
      }
    } catch {
      // Mark as loaded even on error so the UI doesn't hang forever
      setState((p) => ({ ...p, inventoryLoaded: true }));
    }
  }, []);

  const loadStorefrontFromDB = useCallback(async () => {
    try {
      const res  = await fetch("/api/storefront");
      if (!res.ok) return;
      const data = await res.json();
      const merged = { ...DEFAULT_STOREFRONT, ...data };
      ls_write("cc_storefront", merged);
      setState((p) => ({ ...p, storefront: merged }));
    } catch {}
  }, []);

  const loadCartFromDB = useCallback(async (email) => {
    try {
      const res  = await fetch(`/api/cart?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (Array.isArray(data)) setState((p) => ({ ...p, cart: data }));
    } catch {}
  }, []);

  const loadWishlistFromDB = useCallback(async (email) => {
    try {
      const res  = await fetch(`/api/wishlist?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      // Normalise all IDs to numbers for consistency
      if (Array.isArray(data)) {
        setState((p) => ({ ...p, wishlist: data.map(Number) }));
      }
    } catch {}
  }, []);

  /** Load orders for a specific buyer */
  const loadOrdersFromDB = useCallback(async (email) => {
    try {
      const res  = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setState((p) => ({ ...p, transactions: data.map(mapOrder) }));
      }
    } catch {}
  }, []);

  /** Load ALL orders from every buyer — seller only */
  const loadAllOrdersFromDB = useCallback(async () => {
    try {
      const res  = await fetch("/api/orders?seller=true");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        setState((p) => ({ ...p, transactions: data.map(mapOrder) }));
      }
    } catch {}
  }, []);

  /** Load ALL reviews from every product — seller only */
  const loadAllReviewsFromDB = useCallback(async () => {
    try {
      const res  = await fetch("/api/reviews?all=true");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        setState((p) => ({ ...p, allReviews: data.map(mapReview) }));
      }
    } catch {}
  }, []);

  // ── BOOT LOADERS ─────────────────────────────────────────────────────────
  useEffect(() => {
    loadInventoryFromDB();
    loadStorefrontFromDB();
  }, [loadInventoryFromDB, loadStorefrontFromDB]);

  // When seller logs in, load ALL orders + reviews (and poll every 30 s)
  useEffect(() => {
    if (!hydrated || !state.sellerLoggedIn) return;
    loadAllOrdersFromDB();
    loadAllReviewsFromDB();

    const interval = setInterval(() => {
      loadAllOrdersFromDB();
      loadAllReviewsFromDB();
    }, 30_000);

    // Also reload when the tab becomes visible again (user switches tabs)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadAllOrdersFromDB();
        loadAllReviewsFromDB();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [hydrated, state.sellerLoggedIn, loadAllOrdersFromDB, loadAllReviewsFromDB]);

  // Load buyer-specific data when user session is established
  useEffect(() => {
    if (!hydrated) return;
    if (!state.user?.email) {
      setState((p) => ({ ...p, cart: [], transactions: [], wishlist: [], reviews: {} }));
      return;
    }
    const email = state.user.email;
    Promise.all([
      loadCartFromDB(email),
      loadWishlistFromDB(email),
      loadOrdersFromDB(email),
    ]);
  }, [state.user?.email, hydrated, loadCartFromDB, loadWishlistFromDB, loadOrdersFromDB]);

  // ── USER ─────────────────────────────────────────────────────────────────
  const setUser = useCallback((u) => {
    ls_write("cc_user", u);
    setState((p) => ({ ...p, user: u }));
  }, []);

  const setSellerLoggedIn = useCallback((v) => {
    ls_write("cc_seller", v);
    setState((p) => ({ ...p, sellerLoggedIn: v }));
  }, []);

  // ── STOREFRONT ───────────────────────────────────────────────────────────
  // FIX: This function now re-throws on failure so StorefrontClient
  // can catch it and show the "Save Failed" error state correctly.
  const setStorefront = useCallback(async (sf) => {
    // Always persist locally first so buyer pages update immediately
    ls_write("cc_storefront", sf);
    setState((p) => ({ ...p, storefront: sf }));

    // Now attempt to save to DB — throws on failure so callers can handle it
    const res = await fetch("/api/storefront", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(sf),
    });

    if (!res.ok) {
      let message = "DB save failed";
      try {
        const data = await res.json();
        if (data?.error) message = data.error;
      } catch {}
      throw new Error(message);
    }
  }, []);

  // ── INVENTORY ────────────────────────────────────────────────────────────
  const setInventory = useCallback((updater) => {
    setState((p) => {
      const inventory = typeof updater === "function" ? updater(p.inventory) : updater;
      ls_write("cc_inventory_cache", { ts: Date.now(), data: inventory });
      return { ...p, inventory, inventoryLoaded: true };
    });
  }, []);

  // ── CART ─────────────────────────────────────────────────────────────────
  const addToCart = useCallback(async (item) => {
    const email = stateRef.current.user?.email;
    setState((p) => {
      const found = p.cart.find((i) => i.id === item.id);
      const cart  = found
        ? p.cart.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...p.cart, { ...item, qty: 1 }];
      return { ...p, cart };
    });
    if (email) {
      fetch("/api/cart", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, ...item }),
      }).catch(() => {});
    } else {
      ls_write("cc_cart", stateRef.current.cart);
    }
  }, []);

  const removeFromCart = useCallback(async (id) => {
    const email = stateRef.current.user?.email;
    setState((p) => ({ ...p, cart: p.cart.filter((i) => i.id !== id) }));
    if (email) {
      fetch("/api/cart", {
        method:  "DELETE",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, id }),
      }).catch(() => {});
    } else {
      ls_write("cc_cart", stateRef.current.cart);
    }
  }, []);

  const updateQty = useCallback(async (id, qty) => {
    const email = stateRef.current.user?.email;
    setState((p) => ({
      ...p,
      cart: qty <= 0
        ? p.cart.filter((i) => i.id !== id)
        : p.cart.map((i) => i.id === id ? { ...i, qty } : i),
    }));
    if (email) {
      fetch("/api/cart", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, id, qty }),
      }).catch(() => {});
    } else {
      ls_write("cc_cart", stateRef.current.cart);
    }
  }, []);

  const clearCart = useCallback(async () => {
    const email = stateRef.current.user?.email;
    setState((p) => ({ ...p, cart: [] }));
    ls_remove("cc_cart");
    if (email) {
      fetch("/api/cart", {
        method:  "DELETE",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, id: "all" }),
      }).catch(() => {});
    }
  }, []);

  // ── ORDERS ───────────────────────────────────────────────────────────────
  const addTransaction = useCallback(async (tx) => {
    const email = stateRef.current.user?.email || "";
    try {
      await fetch("/api/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
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
  }, [loadOrdersFromDB]);

  const setTransactions = useCallback((updater) => {
    setState((p) => {
      const transactions = typeof updater === "function" ? updater(p.transactions) : updater;
      return { ...p, transactions };
    });
  }, []);

  const markReceived = useCallback(async (txId) => {
    setState((p) => ({
      ...p,
      transactions: p.transactions.map((t) =>
        t.id === txId ? { ...t, status: "Received" } : t
      ),
    }));
    fetch("/api/orders", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id: txId, status: "Received" }),
    }).catch(async () => {
      const email = stateRef.current.user?.email;
      if (email) await loadOrdersFromDB(email);
    });
  }, [loadOrdersFromDB]);

  // Expose so seller pages can manually trigger a refresh
  const refreshSellerData = useCallback(async () => {
    await Promise.all([loadAllOrdersFromDB(), loadAllReviewsFromDB()]);
  }, [loadAllOrdersFromDB, loadAllReviewsFromDB]);

  // ── WISHLIST ─────────────────────────────────────────────────────────────
  // FIX: All wishlist IDs are normalised to numbers to prevent
  // duplicate entries from mixed string/number toggling.
  const toggleWishlist = useCallback(async (productId) => {
    const email    = stateRef.current.user?.email;
    const numId    = Number(productId);
    setState((p) => ({
      ...p,
      wishlist: p.wishlist.includes(numId)
        ? p.wishlist.filter((id) => id !== numId)
        : [...p.wishlist, numId],
    }));
    if (email) {
      fetch("/api/wishlist", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, productId }),
      }).catch(() => {});
    }
  }, []);

  // FIX: Always compare as numbers since wishlist is now normalised.
  const isWishlisted = useCallback(
    (productId) => state.wishlist.includes(Number(productId)),
    [state.wishlist]
  );

  // ── REVIEWS ──────────────────────────────────────────────────────────────
  // FIX: Always use String(productId) as the map key so that numeric
  // product IDs from inventory and string IDs from useParams() both hit
  // the same entry.
  const getProductReviews = useCallback(async (productId) => {
    const key = String(productId);
    try {
      const res  = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped = data.map(mapReview);
        setState((p) => ({ ...p, reviews: { ...p.reviews, [key]: mapped } }));
        return mapped;
      }
    } catch {}
    return stateRef.current.reviews[key] || [];
  }, []);

  const getProductReviewsSync = useCallback(
    (productId) => state.reviews[String(productId)] || [],
    [state.reviews]
  );

  const addReview = useCallback(async (review) => {
    try {
      await fetch("/api/reviews", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          productId:  review.productId,
          userEmail:  stateRef.current.user?.email || "",
          author:     review.author,
          rating:     review.rating,
          comment:    review.comment || "",
        }),
      });
      // Refresh all reviews for seller if they're logged in
      if (stateRef.current.sellerLoggedIn) {
        loadAllReviewsFromDB();
      }
    } catch {}
  }, [loadAllReviewsFromDB]);

  const canReview = useCallback(
    (productId) => {
      if (!state.user) return false;
      return state.transactions.some(
        (t) =>
          t.status === "Received" &&
          t.items?.some((i) => Number(i.id) === Number(productId))
      );
    },
    [state.user, state.transactions]
  );

  return (
    <AppContext.Provider value={{
      user:             state.user,
      sellerLoggedIn:   state.sellerLoggedIn,
      cart:             state.cart,
      transactions:     state.transactions,
      wishlist:         state.wishlist,
      reviews:          state.reviews,
      allReviews:       state.allReviews,
      inventory:        state.inventory,
      inventoryLoaded:  state.inventoryLoaded,
      storefront:       state.storefront,
      setUser, setSellerLoggedIn,
      setStorefront,
      setInventory,
      addToCart, removeFromCart, updateQty, clearCart,
      addTransaction, setTransactions, markReceived,
      toggleWishlist, isWishlisted,
      addReview, getProductReviews, getProductReviewsSync, canReview,
      refreshSellerData,
      loadAllOrdersFromDB,
      loadAllReviewsFromDB,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);