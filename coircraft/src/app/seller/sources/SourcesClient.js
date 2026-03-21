"use client";
import { useState, useEffect } from "react";
import SellerSidebar from "@/components/SellerSidebar";

const CATEGORIES = ["Image", "Image Platform", "Framework", "Library", "Font", "Database", "Hosting", "Other"];
const EMPTY = { category: "Image", title: "", url: "", description: "" };

export default function SourcesClient() {
  const [sources,  setSources]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showAdd,  setShowAdd]  = useState(false);
  const [addForm,  setAddForm]  = useState(EMPTY);
  const [editing,  setEditing]  = useState(null);
  const [editForm, setEditForm] = useState({});
  const [flash,    setFlash]    = useState("");

  const load = async () => {
    try {
      const res  = await fetch("/api/sources");
      const data = await res.json();
      setSources(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showFlash = (msg) => { setFlash(msg); setTimeout(() => setFlash(""), 2500); };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!addForm.title.trim()) return;
    try {
      const res = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      if (res.ok) { await load(); setAddForm(EMPTY); setShowAdd(false); showFlash("✅ Source added!"); }
    } catch { showFlash("❌ Failed to add"); }
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch("/api/sources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editForm }),
      });
      if (res.ok) { await load(); setEditing(null); showFlash("✅ Source updated!"); }
    } catch { showFlash("❌ Failed to update"); }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Remove "${title}"?`)) return;
    try {
      const res = await fetch("/api/sources", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) { await load(); showFlash(`🗑️ "${title}" removed.`); }
    } catch { showFlash("❌ Failed to delete"); }
  };

  const inp = { width: "100%", border: "2px solid #E8EDE8", borderRadius: 10, padding: "9px 13px", fontSize: 13, fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box", background: "#fff", transition: "border-color 0.2s" };
  const focus = (e) => (e.target.style.borderColor = "#A8FF3E");
  const blur  = (e) => (e.target.style.borderColor = "#E8EDE8");

  // Group by category for display
  const grouped = sources.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <SellerSidebar />
      <main style={{ flex: 1, background: "#F8F9FA", padding: 32, overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "#0E2011", margin: "0 0 4px" }}>
              Sources & Credits
            </h1>
            <p style={{ color: "#888", fontSize: 14, margin: 0 }}>
              Manage what appears on the public <strong>/about</strong> page.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="/about" target="_blank"
              style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "2px solid #E8EDE8", borderRadius: 50, padding: "10px 18px", textDecoration: "none", fontWeight: 700, fontSize: 13, color: "#0E2011", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#A8FF3E"; e.currentTarget.style.background = "#F5F9F0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8EDE8"; e.currentTarget.style.background = "#fff"; }}>
              🌐 Preview About Page
            </a>
            <button onClick={() => { setShowAdd(!showAdd); setAddForm(EMPTY); }}
              style={{ background: showAdd ? "#fff" : "linear-gradient(135deg,#A8FF3E,#5BCC1C)", color: showAdd ? "#888" : "#0E2011", border: showAdd ? "2px solid #ddd" : "none", borderRadius: 50, padding: "10px 22px", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: showAdd ? "none" : "0 4px 16px rgba(168,255,62,0.35)" }}>
              {showAdd ? "✕ Cancel" : "+ Add Source"}
            </button>
          </div>
        </div>

        {/* Flash */}
        {flash && (
          <div style={{ background: "#E8FFD0", border: "1.5px solid #A8FF3E", borderRadius: 12, padding: "11px 16px", marginBottom: 18, fontSize: 13, color: "#1A7A2E", fontWeight: 700 }}>
            {flash}
          </div>
        )}

        {/* Add form */}
        {showAdd && (
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", marginBottom: 24, boxShadow: "0 4px 24px rgba(14,32,17,0.08)", border: "2px solid #A8FF3E" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 800, color: "#0E2011", margin: "0 0 18px" }}>
              ➕ Add New Source
            </h2>
            <form onSubmit={handleAdd}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Category *</label>
                  <select required value={addForm.category} onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value }))}
                    style={{ ...inp, cursor: "pointer" }} onFocus={focus} onBlur={blur}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Title *</label>
                  <input required value={addForm.title} onChange={(e) => setAddForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Unsplash" style={inp} onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>URL</label>
                  <input type="url" value={addForm.url} onChange={(e) => setAddForm((f) => ({ ...f, url: e.target.value }))}
                    placeholder="https://..." style={inp} onFocus={focus} onBlur={blur} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Description</label>
                <textarea value={addForm.description} onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of how this resource is used..." rows={2}
                  style={{ ...inp, resize: "vertical" }} onFocus={focus} onBlur={blur} />
              </div>
              <button type="submit"
                style={{ background: "linear-gradient(135deg,#A8FF3E,#5BCC1C)", color: "#0E2011", border: "none", borderRadius: 50, padding: "11px 26px", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
                Save Source
              </button>
            </form>
          </div>
        )}

        {/* Sources list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#aaa" }}>
            <div style={{ width: 36, height: 36, border: "4px solid #E8EDE8", borderTopColor: "#A8FF3E", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 14px" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p>Loading sources...</p>
          </div>
        ) : sources.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", background: "#fff", borderRadius: 18, color: "#aaa" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p>No sources yet. Click "+ Add Source" to get started.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {Object.entries(grouped).sort().map(([cat, items]) => (
              <div key={cat} style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 12px rgba(14,32,17,0.06)" }}>

                {/* Category header */}
                <div style={{ background: "#F5F9F0", padding: "14px 20px", borderBottom: "1px solid #E8F0E0" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, color: "#0E2011" }}>
                    {cat} <span style={{ color: "#aaa", fontWeight: 600, fontSize: 13 }}>({items.length})</span>
                  </div>
                </div>

                {/* Source rows */}
                {items.map((s) => (
                  <div key={s.id} style={{ borderBottom: "1px solid #F5F5F0" }}>
                    {editing !== s.id ? (
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "14px 20px", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#0E2011", marginBottom: 3 }}>{s.title}</div>
                          {s.description && <div style={{ fontSize: 12, color: "#888", marginBottom: 5 }}>{s.description}</div>}
                          {s.url && (
                            <a href={s.url} target="_blank" rel="noopener noreferrer"
                              style={{ fontSize: 11, color: "#1A7A2E", fontWeight: 700, textDecoration: "none", wordBreak: "break-all" }}>
                              🔗 {s.url}
                            </a>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                          <button onClick={() => { setEditing(s.id); setEditForm({ category: s.category, title: s.title, url: s.url, description: s.description }); }}
                            style={{ background: "#0E2011", color: "#A8FF3E", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(s.id, s.title)}
                            style={{ background: "#FFF0F0", color: "#C62828", border: "1.5px solid #FFCDD2", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: "16px 20px", background: "#FAFFF5", borderLeft: "4px solid #A8FF3E" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 10 }}>
                          <div>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Category</label>
                            <select value={editForm.category} onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                              style={{ ...inp, cursor: "pointer" }} onFocus={focus} onBlur={blur}>
                              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Title</label>
                            <input value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                              style={inp} onFocus={focus} onBlur={blur} />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>URL</label>
                            <input value={editForm.url} onChange={(e) => setEditForm((f) => ({ ...f, url: e.target.value }))}
                              style={inp} onFocus={focus} onBlur={blur} />
                          </div>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Description</label>
                          <textarea value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                            rows={2} style={{ ...inp, resize: "vertical" }} onFocus={focus} onBlur={blur} />
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                          <button onClick={() => handleSave(s.id)}
                            style={{ background: "linear-gradient(135deg,#A8FF3E,#5BCC1C)", color: "#0E2011", border: "none", borderRadius: 50, padding: "9px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                            Save
                          </button>
                          <button onClick={() => setEditing(null)}
                            style={{ background: "#fff", color: "#888", border: "2px solid #ddd", borderRadius: 50, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)" }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}