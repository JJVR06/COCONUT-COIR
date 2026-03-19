"use client";
import { useState, useRef } from "react";
import SellerSidebar from "@/components/SellerSidebar";
import { products as sourceProducts } from "@/data/products";

const CATEGORIES = ["Garden", "Home", "Construction", "Crafts", "Other"];

function loadProducts() {
  try {
    const saved = localStorage.getItem("cc_inventory");
    return saved ? JSON.parse(saved) : sourceProducts;
  } catch {
    return sourceProducts;
  }
}

const EMPTY_FORM = { name: "", price: "", stock: "", category: "Garden", description: "", image: "" };

export default function InventoryClient() {
  const [products,   setProducts]   = useState(loadProducts);
  const [editing,    setEditing]    = useState(null);   // id of row being edited
  const [editForm,   setEditForm]   = useState({});
  const [showAdd,    setShowAdd]    = useState(false);  // add-product panel
  const [addForm,    setAddForm]    = useState(EMPTY_FORM);
  const [search,     setSearch]     = useState("");
  const [catFilter,  setCatFilter]  = useState("All");
  const [flash,      setFlash]      = useState("");     // success message

  const editImgRef = useRef();
  const addImgRef  = useRef();

  const persist = (updated) => {
    setProducts(updated);
    try { localStorage.setItem("cc_inventory", JSON.stringify(updated)); } catch {}
  };

  const showFlash = (msg) => {
    setFlash(msg);
    setTimeout(() => setFlash(""), 2500);
  };

  /* ── filter ─────────────────────────────── */
  const visible = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter === "All" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  /* ── image helpers ──────────────────────── */
  const readImage = (file, cb) => {
    const reader = new FileReader();
    reader.onload = () => cb(reader.result);
    reader.readAsDataURL(file);
  };

  /* ── ADD product ────────────────────────── */
  const handleAdd = (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) return;
    const newProduct = {
      ...addForm,
      id:    Date.now(),
      price: Number(addForm.price) || 0,
      stock: Number(addForm.stock) || 0,
      tag:   "New",
      specs: {},
      features: [],
    };
    const updated = [newProduct, ...products];
    persist(updated);
    setAddForm(EMPTY_FORM);
    setShowAdd(false);
    showFlash(`✅ "${newProduct.name}" added to inventory!`);
  };

  /* ── EDIT product ───────────────────────── */
  const startEdit = (p) => {
    setEditing(p.id);
    setEditForm({ name: p.name, price: p.price, stock: p.stock, category: p.category, description: p.description, image: p.image });
  };

  const saveEdit = (id) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, ...editForm, price: Number(editForm.price), stock: Number(editForm.stock) } : p
    );
    persist(updated);
    setEditing(null);
    showFlash("✅ Product updated!");
  };

  /* ── DELETE product ─────────────────────── */
  const deleteProduct = (id, name) => {
    if (!confirm(`Remove "${name}" from inventory?`)) return;
    persist(products.filter((p) => p.id !== id));
    showFlash(`🗑️ "${name}" removed.`);
  };

  /* ── stock badge ────────────────────────── */
  const stockBadge = (stock) => {
    if (stock === 0)  return { bg: "#FFE4E6", color: "#9F1239", label: "Out of Stock" };
    if (stock < 10)   return { bg: "#FFF9C4", color: "#856404", label: "Low Stock"    };
    return              { bg: "#DCFCE7", color: "#166534", label: "In Stock"      };
  };

  /* ── shared input style ─────────────────── */
  const inp = { width: "100%", border: "2px solid #E8EDE8", borderRadius: 10, padding: "9px 13px", fontSize: 13, fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box", background: "#fff", transition: "border-color 0.2s" };
  const focus = (e) => (e.target.style.borderColor = "#A8FF3E");
  const blur  = (e) => (e.target.style.borderColor = "#E8EDE8");

  /* ── image upload section ───────────────── */
  const ImageUpload = ({ src, onUpload, onClear, inputRef }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
      <div style={{ width: 80, height: 80, borderRadius: 12, overflow: "hidden", background: "#E8FFD0", border: "2px solid #E8EDE8", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>
        {src
          ? <img src={src} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
          : "🌿"}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        <button type="button" onClick={() => inputRef.current.click()}
          style={{ background: "#0E2011", color: "#A8FF3E", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)" }}>
          📷 Upload Photo
        </button>
        {src && (
          <button type="button" onClick={onClear}
            style={{ background: "#fff", color: "#888", border: "2px solid #ddd", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)" }}>
            Remove
          </button>
        )}
        <span style={{ fontSize: 10, color: "#bbb" }}>JPG / PNG / WEBP</span>
        <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files[0]; if (f) readImage(f, onUpload); }} />
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <SellerSidebar />
      <main style={{ flex: 1, background: "#F8F9FA", padding: 32, overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "#0E2011", margin: "0 0 4px" }}>Inventory</h1>
            <p style={{ color: "#888", fontSize: 14, margin: 0 }}>Add new products and manage existing stock.</p>
          </div>
          <button onClick={() => { setShowAdd(!showAdd); setAddForm(EMPTY_FORM); }}
            style={{ background: showAdd ? "#fff" : "linear-gradient(135deg,#A8FF3E,#5BCC1C)", color: showAdd ? "#888" : "#0E2011", border: showAdd ? "2px solid #ddd" : "none", borderRadius: 50, padding: "11px 24px", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: showAdd ? "none" : "0 4px 16px rgba(168,255,62,0.35)", transition: "all 0.2s" }}>
            {showAdd ? "✕ Cancel" : "+ Add New Product"}
          </button>
        </div>

        {/* Flash message */}
        {flash && (
          <div style={{ background: "#E8FFD0", border: "1.5px solid #A8FF3E", borderRadius: 12, padding: "11px 16px", marginBottom: 18, fontSize: 13, color: "#1A7A2E", fontWeight: 700 }}>
            {flash}
          </div>
        )}

        {/* ── ADD NEW PRODUCT PANEL ── */}
        {showAdd && (
          <div style={{ background: "#fff", borderRadius: 20, padding: "26px 28px", marginBottom: 24, boxShadow: "0 4px 24px rgba(14,32,17,0.1)", border: "2px solid #A8FF3E" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "#0E2011", margin: "0 0 20px" }}>
              ➕ New Product
            </h2>
            <form onSubmit={handleAdd}>
              <ImageUpload
                src={addForm.image}
                onUpload={(img) => setAddForm((f) => ({ ...f, image: img }))}
                onClear={() => setAddForm((f) => ({ ...f, image: "" }))}
                inputRef={addImgRef}
              />

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
                {/* Product name */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Product Name *</label>
                  <input required value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Coco Peat Block 1kg" style={inp} onFocus={focus} onBlur={blur} />
                </div>
                {/* Category */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Category *</label>
                  <select required value={addForm.category} onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value }))}
                    style={{ ...inp, cursor: "pointer" }} onFocus={focus} onBlur={blur}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {/* Price */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Price (₱) *</label>
                  <input required type="number" min="0" value={addForm.price} onChange={(e) => setAddForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="0" style={inp} onFocus={focus} onBlur={blur} />
                </div>
                {/* Stock */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Stock Qty *</label>
                  <input required type="number" min="0" value={addForm.stock} onChange={(e) => setAddForm((f) => ({ ...f, stock: e.target.value }))}
                    placeholder="0" style={inp} onFocus={focus} onBlur={blur} />
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Description</label>
                <textarea value={addForm.description} onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the product..." rows={2} style={{ ...inp, resize: "vertical" }} onFocus={focus} onBlur={blur} />
              </div>

              <button type="submit"
                style={{ background: "linear-gradient(135deg,#A8FF3E,#5BCC1C)", color: "#0E2011", border: "none", borderRadius: 50, padding: "12px 28px", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 16px rgba(168,255,62,0.35)" }}>
                Save Product to Inventory
              </button>
            </form>
          </div>
        )}

        {/* ── FILTERS ── */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Search..."
            style={{ ...inp, width: 200, borderRadius: 50, padding: "9px 18px" }} onFocus={focus} onBlur={blur} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["All", ...CATEGORIES].map((cat) => (
              <button key={cat} onClick={() => setCatFilter(cat)}
                style={{ padding: "7px 16px", borderRadius: 50, border: "2px solid", borderColor: catFilter === cat ? "#0E2011" : "#ddd", background: catFilter === cat ? "#0E2011" : "#fff", color: catFilter === cat ? "#A8FF3E" : "#555", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 11, cursor: "pointer", transition: "all 0.15s" }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Summary row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 22 }}>
          {[
            { label: "Total Products", value: products.length,                                             color: "#1A7A2E" },
            { label: "Low Stock",      value: products.filter((p) => p.stock > 0 && p.stock < 10).length, color: "#856404" },
            { label: "Out of Stock",   value: products.filter((p) => p.stock === 0).length,                color: "#9F1239" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 14, padding: "14px 18px", boxShadow: "0 2px 10px rgba(14,32,17,0.05)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── PRODUCTS TABLE ── */}
        <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 12px rgba(14,32,17,0.06)", overflow: "hidden" }}>

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr 1fr", background: "#F5F9F0", borderBottom: "1px solid #eee", padding: "12px 20px" }}>
            {["Product","Category","Price","Stock","Status","Actions"].map((h) => (
              <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "#1A7A2E", letterSpacing: 1, textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>

          {visible.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#aaa" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
              <p>No products match your search.</p>
            </div>
          )}

          {visible.map((p) => {
            const badge  = stockBadge(p.stock);
            const isEdit = editing === p.id;

            return (
              <div key={p.id} style={{ borderBottom: "1px solid #F0F0EC" }}>

                {/* View row */}
                {!isEdit ? (
                  <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr 1fr", padding: "13px 20px", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 10, overflow: "hidden", background: "#E8FFD0", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                        {p.image
                          ? <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
                          : "🌿"}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 13, color: "#0E2011" }}>{p.name}</span>
                    </div>
                    <span style={{ background: "#E8FFD0", color: "#1A7A2E", borderRadius: 50, padding: "4px 10px", fontSize: 11, fontWeight: 700, display: "inline-block" }}>{p.category}</span>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#1A7A2E" }}>₱{p.price.toLocaleString()}</div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{p.stock}</div>
                    <span style={{ background: badge.bg, color: badge.color, borderRadius: 50, padding: "4px 12px", fontSize: 11, fontWeight: 700, display: "inline-block" }}>{badge.label}</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => startEdit(p)}
                        style={{ background: "#0E2011", color: "#A8FF3E", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.15s" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#1A7A2E"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#0E2011"}>
                        Edit
                      </button>
                      <button onClick={() => deleteProduct(p.id, p.name)}
                        style={{ background: "#FFF0F0", color: "#C62828", border: "1.5px solid #FFCDD2", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.15s" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#FFCDD2"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#FFF0F0"}>
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Edit panel */
                  <div style={{ padding: "20px 24px", background: "#F5F9F0", borderLeft: "4px solid #A8FF3E" }}>
                    <ImageUpload
                      src={editForm.image}
                      onUpload={(img) => setEditForm((f) => ({ ...f, image: img }))}
                      onClear={() => setEditForm((f) => ({ ...f, image: "" }))}
                      inputRef={editImgRef}
                    />
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 14, marginBottom: 12 }}>
                      {[
                        { key: "name",     label: "Product Name", type: "text"   },
                        { key: "price",    label: "Price (₱)",    type: "number" },
                        { key: "stock",    label: "Stock Qty",    type: "number" },
                      ].map(({ key, label, type }) => (
                        <div key={key}>
                          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>{label}</label>
                          <input type={type} value={editForm[key] ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                            style={inp} onFocus={focus} onBlur={blur} />
                        </div>
                      ))}
                      <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Category</label>
                        <select value={editForm.category} onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                          style={{ ...inp, cursor: "pointer" }} onFocus={focus} onBlur={blur}>
                          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Description</label>
                      <textarea value={editForm.description ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                        rows={2} style={{ ...inp, resize: "vertical" }} onFocus={focus} onBlur={blur} />
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={() => saveEdit(p.id)}
                        style={{ background: "linear-gradient(135deg,#A8FF3E,#5BCC1C)", color: "#0E2011", border: "none", borderRadius: 50, padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                        Save Changes
                      </button>
                      <button onClick={() => setEditing(null)}
                        style={{ background: "#fff", color: "#888", border: "2px solid #ddd", borderRadius: 50, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}