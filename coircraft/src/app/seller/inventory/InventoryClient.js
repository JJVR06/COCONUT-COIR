"use client";
import { useState, useRef } from "react";
import SellerSidebar from "@/components/SellerSidebar";
import { useApp } from "@/context/AppContext";

const CATEGORIES = ["Garden", "Home", "Construction", "Crafts", "Other"];
const EMPTY_FORM  = { name: "", price: "", stock: "", category: "Garden", description: "", image: "", tag: "New" };

export default function InventoryClient() {
  const { inventory, setInventory } = useApp();
  const products = Array.isArray(inventory) ? inventory : [];

  const [editing,   setEditing]   = useState(null);
  const [editForm,  setEditForm]  = useState({});
  const [showAdd,   setShowAdd]   = useState(false);
  const [addForm,   setAddForm]   = useState(EMPTY_FORM);
  const [search,    setSearch]    = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [flash,     setFlash]     = useState({ msg: "", ok: true });
  const [saving,    setSaving]    = useState(false);

  const editImgRef = useRef();
  const addImgRef  = useRef();

  const showFlash = (msg, ok = true) => {
    setFlash({ msg, ok });
    setTimeout(() => setFlash({ msg: "", ok: true }), 3000);
  };

  /* ── filter ─────────────────────────────── */
  const visible = products.filter((p) => {
    const matchSearch = (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
                        (p.category || "").toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter === "All" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  /* ── image helper ───────────────────────── */
  const readImage = (file, cb) => {
    const reader = new FileReader();
    reader.onload = () => cb(reader.result);
    reader.readAsDataURL(file);
  };

  /* ── ADD product → POST /api/products ──── */
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/products", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:        addForm.name,
          price:       Number(addForm.price) || 0,
          stock:       Number(addForm.stock) || 0,
          category:    addForm.category,
          tag:         addForm.tag || "New",
          description: addForm.description,
          image:       addForm.image,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add product");

      // Update local state with the DB-returned product (has real id)
      setInventory([data, ...products]);
      setAddForm(EMPTY_FORM);
      setShowAdd(false);
      showFlash(`✅ "${data.name}" added! Visible on buyer store now.`);
    } catch (err) {
      showFlash(`❌ Error: ${err.message}`, false);
    } finally {
      setSaving(false);
    }
  };

  /* ── EDIT product → PATCH /api/products/[id] ── */
  const startEdit = (p) => {
    setEditing(p.id);
    setEditForm({
      name:        p.name,
      price:       p.price,
      stock:       p.stock,
      category:    p.category,
      tag:         p.tag,
      description: p.description,
      image:       p.image,
    });
  };

  const saveEdit = async (id) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:        editForm.name,
          price:       Number(editForm.price),
          stock:       Number(editForm.stock),
          category:    editForm.category,
          tag:         editForm.tag,
          description: editForm.description,
          image:       editForm.image,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");

      setInventory(products.map((p) => p.id === id ? data : p));
      setEditing(null);
      showFlash("✅ Product updated! Changes are live on the buyer store.");
    } catch (err) {
      showFlash(`❌ Error: ${err.message}`, false);
    } finally {
      setSaving(false);
    }
  };

  /* ── DELETE product → DELETE /api/products/[id] ── */
  const deleteProduct = async (id, name) => {
    if (!confirm(`Remove "${name}" from inventory?`)) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");

      setInventory(products.filter((p) => p.id !== id));
      showFlash(`🗑️ "${name}" removed.`);
    } catch (err) {
      showFlash(`❌ Error: ${err.message}`, false);
    } finally {
      setSaving(false);
    }
  };

  /* ── stock badge ────────────────────────── */
  const stockBadge = (stock) => {
    if (stock === 0) return { bg: "#FFE4E6", color: "#9F1239", label: "Out of Stock" };
    if (stock < 10)  return { bg: "#FFF9C4", color: "#856404", label: "Low Stock"    };
    return             { bg: "#DCFCE7", color: "#166534", label: "In Stock"      };
  };

  /* ── shared input style ─────────────────── */
  const inp = {
    width: "100%", border: "2px solid #E8EDE8", borderRadius: 10,
    padding: "9px 13px", fontSize: 13, fontFamily: "var(--font-body)",
    outline: "none", boxSizing: "border-box", background: "#fff",
    transition: "border-color 0.2s",
  };
  const focus = (e) => (e.target.style.borderColor = "#A8FF3E");
  const blur  = (e) => (e.target.style.borderColor = "#E8EDE8");

  /* ── image upload ───────────────────────── */
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
        <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files[0]; if (f) readImage(f, onUpload); }} />
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <SellerSidebar />

      <main className="seller-page-main" style={{ flex: 1, background: "#F8F9FA", padding: 28, overflowY: "auto" }}>
        <style>{`
          @media (max-width: 1023px) {
            .seller-page-main { padding-top: 76px !important; padding-bottom: 88px !important; }
            .inv-header { flex-direction: column !important; align-items: flex-start !important; }
            .inv-add-grid { grid-template-columns: 1fr 1fr !important; }
            .inv-summary { grid-template-columns: 1fr 1fr !important; }
            .inv-table-wrap { overflow-x: auto; }
          }
          @media (max-width: 479px) {
            .inv-add-grid { grid-template-columns: 1fr !important; }
            .inv-summary { grid-template-columns: 1fr 1fr 1fr !important; }
          }
        `}</style>

        {/* Header */}
        <div className="inv-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, color: "#0E2011", margin: "0 0 4px" }}>
              Inventory
            </h1>
            <p style={{ color: "#888", fontSize: 13, margin: 0 }}>
              Changes are saved to the <strong style={{ color: "#1A7A2E" }}>database</strong> and reflected instantly.
            </p>
          </div>
          <button
            onClick={() => { setShowAdd(!showAdd); setAddForm(EMPTY_FORM); }}
            style={{
              background: showAdd ? "#fff" : "linear-gradient(135deg,#A8FF3E,#5BCC1C)",
              color: showAdd ? "#888" : "#0E2011",
              border: showAdd ? "2px solid #ddd" : "none",
              borderRadius: 50, padding: "11px 22px",
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: 13, cursor: "pointer", whiteSpace: "nowrap",
              boxShadow: showAdd ? "none" : "0 4px 16px rgba(168,255,62,0.35)",
            }}
          >
            {showAdd ? "✕ Cancel" : "+ Add Product"}
          </button>
        </div>

        {/* Flash message */}
        {flash.msg && (
          <div style={{
            background: flash.ok ? "#E8FFD0" : "#FFE4E6",
            border: `1.5px solid ${flash.ok ? "#A8FF3E" : "#FFCDD2"}`,
            borderRadius: 12, padding: "11px 16px", marginBottom: 16,
            fontSize: 13, color: flash.ok ? "#1A7A2E" : "#C62828", fontWeight: 700,
          }}>
            {flash.msg}
          </div>
        )}

        {/* Saving indicator */}
        {saving && (
          <div style={{ background: "#FFF9C4", border: "1.5px solid #FCD34D", borderRadius: 12, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "#856404", fontWeight: 700 }}>
            ⏳ Saving to database...
          </div>
        )}

        {/* ── ADD PANEL ── */}
        {showAdd && (
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 22, boxShadow: "0 4px 24px rgba(14,32,17,0.1)", border: "2px solid #A8FF3E" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 800, color: "#0E2011", margin: "0 0 18px" }}>
              ➕ New Product
            </h2>
            <form onSubmit={handleAdd}>
              <ImageUpload
                src={addForm.image}
                onUpload={(img) => setAddForm((f) => ({ ...f, image: img }))}
                onClear={() => setAddForm((f) => ({ ...f, image: "" }))}
                inputRef={addImgRef}
              />
              <div className="inv-add-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Product Name *</label>
                  <input required value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Coco Peat Block" style={inp} onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Category</label>
                  <select required value={addForm.category} onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value }))} style={{ ...inp, cursor: "pointer" }} onFocus={focus} onBlur={blur}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Tag</label>
                  <select value={addForm.tag} onChange={(e) => setAddForm((f) => ({ ...f, tag: e.target.value }))} style={{ ...inp, cursor: "pointer" }} onFocus={focus} onBlur={blur}>
                    {["New", "Best Seller", "Trending", "Featured"].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Price (₱)</label>
                  <input required type="number" min="0" value={addForm.price} onChange={(e) => setAddForm((f) => ({ ...f, price: e.target.value }))} placeholder="0" style={inp} onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Stock Qty</label>
                  <input required type="number" min="0" value={addForm.stock} onChange={(e) => setAddForm((f) => ({ ...f, stock: e.target.value }))} placeholder="0" style={inp} onFocus={focus} onBlur={blur} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Description</label>
                <textarea value={addForm.description} onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))} placeholder="Describe the product..." rows={2} style={{ ...inp, resize: "vertical" }} onFocus={focus} onBlur={blur} />
              </div>
              <button type="submit" disabled={saving}
                style={{ background: saving ? "#D4F5A0" : "linear-gradient(135deg,#A8FF3E,#5BCC1C)", color: "#0E2011", border: "none", borderRadius: 50, padding: "12px 28px", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, cursor: saving ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(168,255,62,0.35)" }}>
                {saving ? "Saving..." : "Save to Database"}
              </button>
            </form>
          </div>
        )}

        {/* ── Filters ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Search products..." style={{ ...inp, width: 200, borderRadius: 50, padding: "9px 18px" }} onFocus={focus} onBlur={blur} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["All", ...CATEGORIES].map((cat) => (
              <button key={cat} onClick={() => setCatFilter(cat)}
                style={{ padding: "7px 14px", borderRadius: 50, border: "2px solid", borderColor: catFilter === cat ? "#0E2011" : "#ddd", background: catFilter === cat ? "#0E2011" : "#fff", color: catFilter === cat ? "#A8FF3E" : "#555", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 11, cursor: "pointer", transition: "all 0.15s" }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Summary ── */}
        <div className="inv-summary" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Total Products", value: products.length,                                              color: "#1A7A2E" },
            { label: "Low Stock",      value: products.filter((p) => p.stock > 0 && p.stock < 10).length, color: "#856404" },
            { label: "Out of Stock",   value: products.filter((p) => p.stock === 0).length,                color: "#9F1239" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 12, padding: "13px 16px", boxShadow: "0 2px 8px rgba(14,32,17,0.05)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── Products table ── */}
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(14,32,17,0.06)", overflow: "hidden" }}>
          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr 1fr", background: "#F5F9F0", borderBottom: "1px solid #eee", padding: "11px 18px" }}>
            {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "#1A7A2E", letterSpacing: 1, textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>

          {visible.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#aaa" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
              <p>No products match your search.</p>
            </div>
          )}

          {visible.map((p) => {
            const badge  = stockBadge(p.stock);
            const isEdit = editing === p.id;

            return (
              <div key={p.id} style={{ borderBottom: "1px solid #F0F0EC" }}>
                {!isEdit ? (
                  <div className="inv-table-wrap">
                    <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr 1fr", padding: "12px 18px", alignItems: "center", minWidth: 520 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, overflow: "hidden", background: "#E8FFD0", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                          {p.image ? <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} /> : "🌿"}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: "#0E2011" }}>{p.name}</div>
                          {p.tag && <div style={{ fontSize: 10, color: "#1A7A2E", fontWeight: 700 }}>{p.tag}</div>}
                        </div>
                      </div>
                      <span style={{ background: "#E8FFD0", color: "#1A7A2E", borderRadius: 50, padding: "3px 9px", fontSize: 11, fontWeight: 700, display: "inline-block" }}>{p.category}</span>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#1A7A2E" }}>₱{Number(p.price || 0).toLocaleString()}</div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{p.stock}</div>
                      <span style={{ background: badge.bg, color: badge.color, borderRadius: 50, padding: "3px 10px", fontSize: 11, fontWeight: 700, display: "inline-block" }}>{badge.label}</span>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => startEdit(p)} disabled={saving}
                          style={{ background: "#0E2011", color: "#A8FF3E", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                          Edit
                        </button>
                        <button onClick={() => deleteProduct(p.id, p.name)} disabled={saving}
                          style={{ background: "#FFF0F0", color: "#C62828", border: "1.5px solid #FFCDD2", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                          Del
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Edit panel */
                  <div style={{ padding: "18px 22px", background: "#F5F9F0", borderLeft: "4px solid #A8FF3E" }}>
                    <ImageUpload
                      src={editForm.image}
                      onUpload={(img) => setEditForm((f) => ({ ...f, image: img }))}
                      onClear={() => setEditForm((f) => ({ ...f, image: "" }))}
                      inputRef={editImgRef}
                    />
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 12, marginBottom: 10 }}>
                      {[
                        { key: "name",  label: "Product Name", type: "text"   },
                        { key: "price", label: "Price (₱)",    type: "number" },
                        { key: "stock", label: "Stock Qty",    type: "number" },
                      ].map(({ key, label, type }) => (
                        <div key={key}>
                          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>{label}</label>
                          <input type={type} value={editForm[key] ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))} style={inp} onFocus={focus} onBlur={blur} />
                        </div>
                      ))}
                      <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Category</label>
                        <select value={editForm.category} onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))} style={{ ...inp, cursor: "pointer" }} onFocus={focus} onBlur={blur}>
                          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Tag</label>
                        <select value={editForm.tag || "New"} onChange={(e) => setEditForm((f) => ({ ...f, tag: e.target.value }))} style={{ ...inp, cursor: "pointer" }} onFocus={focus} onBlur={blur}>
                          {["New", "Best Seller", "Trending", "Featured"].map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Description</label>
                      <textarea value={editForm.description ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} rows={2} style={{ ...inp, resize: "vertical" }} onFocus={focus} onBlur={blur} />
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={() => saveEdit(p.id)} disabled={saving}
                        style={{ background: saving ? "#D4F5A0" : "linear-gradient(135deg,#A8FF3E,#5BCC1C)", color: "#0E2011", border: "none", borderRadius: 50, padding: "10px 22px", fontSize: 13, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "var(--font-body)" }}>
                        {saving ? "Saving..." : "Save to Database"}
                      </button>
                      <button onClick={() => setEditing(null)} disabled={saving}
                        style={{ background: "#fff", color: "#888", border: "2px solid #ddd", borderRadius: 50, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="seller-mobile-bottom-spacer" />
      </main>
    </div>
  );
}