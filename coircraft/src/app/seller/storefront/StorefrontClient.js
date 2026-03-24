"use client";
import { useState, useEffect } from "react";
import SellerSidebar from "@/components/SellerSidebar";
import { useApp, DEFAULT_STOREFRONT } from "@/context/AppContext";
import {
  Save,
  RefreshCw,
  Megaphone,
  Info,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
} from "lucide-react";

// ── FIX: Import DEFAULT_STOREFRONT from AppContext instead of duplicating it.
// The local `defaultStorefront` constant has been removed entirely.

const SECTIONS = [
  { key: "heroTitle",    label: "Hero Title",          type: "textarea", help: "Main heading on home page (use \\n for line break)" },
  { key: "heroSubtitle", label: "Hero Subtitle",       type: "textarea", help: "Subtext below hero title" },
  { key: "announcement", label: "Announcement Banner", type: "text",     help: "Shown as a top banner on buyer pages (leave blank to hide)" },
  { key: "tagline",      label: "Store Tagline",       type: "text",     help: "Short description shown on footer and meta" },
  { key: "name",         label: "Store Name",          type: "text",     help: "Displayed in navbar and footer" },
  { key: "address",      label: "Store Address",       type: "text",     help: "Physical address shown on storefront" },
  { key: "hours",        label: "Business Hours",      type: "text",     help: 'e.g. "Mon–Sat: 8:00 AM – 6:00 PM"' },
  { key: "contactEmail", label: "Contact Email",       type: "email",    help: "Shown in footer contact section" },
  { key: "contactPhone", label: "Contact Phone",       type: "tel",      help: "Shown in footer contact section" },
];

const TOGGLES = [
  { key: "showFeatured",     label: "Show Featured Products section" },
  { key: "showNewArrivals",  label: "Show New Arrivals section" },
  { key: "showTestimonials", label: "Show Testimonials section" },
];

export default function StorefrontClient() {
  const { storefront, setStorefront, inventory, sellerLoggedIn } = useApp();

  const [form,      setForm]      = useState(storefront);
  const [saved,     setSaved]     = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [dirty,     setDirty]     = useState(false);
  // FIX: New state to track DB save failures and surface them in the UI
  const [saveError, setSaveError] = useState(false);
  const [tab,       setTab]       = useState("content"); // content | visibility | preview

  // Keep form in sync when context loads from localStorage
  useEffect(() => {
    setForm(storefront);
  }, [storefront]);

  if (!sellerLoggedIn) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  const handleChange = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
    setSaved(false);
    setSaveError(false); // clear any previous error when the user edits
  };

  // FIX: handleSave is now async and awaits setStorefront so it can catch
  // the error thrown by AppContext when the DB write fails.
  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setSaved(false);
    setSaveError(false);

    try {
      await setStorefront(form);
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Storefront save failed:", err);
      // Changes are already saved to localStorage by setStorefront,
      // so the buyer will see them — but we flag the DB failure.
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  };

  // Allow the user to retry after a failure without having to re-edit
  const handleRetry = () => {
    setSaveError(false);
    handleSave();
  };

  const handleReset = () => {
    setForm(DEFAULT_STOREFRONT);
    setDirty(true);
    setSaved(false);
    setSaveError(false);
  };

  const inp = {
    width: "100%", border: "2px solid #E8EDE8", borderRadius: 12,
    padding: "11px 14px", fontSize: 13, fontFamily: "var(--font-body)",
    outline: "none", boxSizing: "border-box", background: "#fff",
    transition: "border-color 0.2s",
  };
  const focus = (e) => (e.target.style.borderColor = "#A8FF3E");
  const blur  = (e) => (e.target.style.borderColor = "#E8EDE8");

  const featured = (inventory || []).filter((p) => ["Best Seller", "Featured"].includes(p.tag)).slice(0, 4);

  // ── Determine Save button appearance based on state ─────────────────────
  const saveBtn = (() => {
    if (saving)    return { label: "Saving…",         bg: "#D4F5A0",  color: "#555",    cursor: "not-allowed", shadow: "none" };
    if (saveError) return { label: "⚠ Save Failed — Retry", bg: "#FFCDD2", color: "#C62828", cursor: "pointer",    shadow: "none" };
    if (saved)     return { label: "✓ Saved!",        bg: "#A8FF3E",  color: "#0E2011", cursor: "default",    shadow: "0 4px 16px rgba(168,255,62,0.35)" };
    if (dirty)     return { label: "Save Changes",    bg: "linear-gradient(135deg,#A8FF3E,#5BCC1C)", color: "#0E2011", cursor: "pointer", shadow: "0 4px 16px rgba(168,255,62,0.35)" };
    return               { label: "Save Changes",    bg: "#E8F0E8",  color: "#aaa",    cursor: "not-allowed", shadow: "none" };
  })();

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <SellerSidebar />

      <main
        className="seller-page-main"
        style={{ flex: 1, background: "#F8F9FA", padding: 28, overflowY: "auto" }}
      >
        <style>{`
          @media (max-width: 1023px) {
            .seller-page-main { padding-top: 76px !important; padding-bottom: 88px !important; }
            .sf-layout { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, gap: 14, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, color: "#0E2011", margin: "0 0 4px" }}>
              🏪 Storefront Editor
            </h1>
            <p style={{ color: "#888", fontSize: 13, margin: 0 }}>
              Changes are saved to the database and reflected on buyer pages after their next page load.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={handleReset}
              disabled={saving}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "#fff", border: "2px solid #E8EDE8", borderRadius: 50,
                padding: "10px 18px", fontFamily: "var(--font-body)",
                fontWeight: 700, fontSize: 12, color: "#888",
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              <RefreshCw size={13} /> Reset Defaults
            </button>

            {/* FIX: Button becomes a "Retry" button on failure */}
            <button
              onClick={saveError ? handleRetry : handleSave}
              disabled={saving || (!dirty && !saveError)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: saveBtn.bg,
                color: saveBtn.color,
                border: saveError ? "2px solid #FFCDD2" : "none",
                borderRadius: 50, padding: "10px 22px",
                fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13,
                cursor: saveBtn.cursor,
                boxShadow: saveBtn.shadow,
                transition: "all 0.2s",
              }}
            >
              {saveError ? <AlertTriangle size={14} /> : <Save size={14} />}
              {saveBtn.label}
            </button>
          </div>
        </div>

        {/* ── FIX: DB save failure banner ── */}
        {saveError && (
          <div style={{
            background: "#FFF5F5",
            border: "1.5px solid #FFCDD2",
            borderRadius: 12, padding: "12px 16px", marginBottom: 18,
            fontSize: 13, color: "#C62828", fontWeight: 600,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>
              Could not save to database. Your changes are saved locally — click{" "}
              <button
                onClick={handleRetry}
                style={{ background: "none", border: "none", color: "#C62828", fontWeight: 800, cursor: "pointer", textDecoration: "underline", fontSize: 13, padding: 0, fontFamily: "var(--font-body)" }}
              >
                Save to retry
              </button>.
            </span>
          </div>
        )}

        {/* ── Success flash ── */}
        {saved && (
          <div style={{
            background: "#E8FFD0", border: "1.5px solid #A8FF3E",
            borderRadius: 12, padding: "12px 16px", marginBottom: 18,
            fontSize: 13, color: "#1A7A2E", fontWeight: 700,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            ✅ Storefront updated! Buyer pages are now showing the new content.
          </div>
        )}

        {/* ── Announcement banner preview ── */}
        {form.announcement && (
          <div style={{
            background: "linear-gradient(135deg,#0E2011,#1A472A)",
            borderRadius: 12, padding: "12px 16px", marginBottom: 18,
            fontSize: 13, color: "#A8FF3E", fontWeight: 700,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <Megaphone size={16} /> Preview: {form.announcement}
          </div>
        )}

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
          {[
            { key: "content",    label: "📝 Content"    },
            { key: "visibility", label: "👁️ Visibility" },
            { key: "preview",    label: "🖼️ Preview"    },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: "10px 20px", borderRadius: 50,
                border: "2px solid",
                borderColor: tab === key ? "#0E2011" : "#E8EDE8",
                background:  tab === key ? "#0E2011" : "#fff",
                color:       tab === key ? "#A8FF3E" : "#555",
                fontFamily: "var(--font-body)", fontWeight: 700,
                fontSize: 12, cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════
            CONTENT TAB
        ════════════════════════════════ */}
        {tab === "content" && (
          <div
            className="sf-layout"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            {SECTIONS.map(({ key, label, type, help }) => (
              <div
                key={key}
                style={{
                  background: "#fff", borderRadius: 16,
                  padding: "18px", boxShadow: "0 2px 10px rgba(14,32,17,0.05)",
                }}
              >
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#1A7A2E", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>
                  {label}
                </label>
                {type === "textarea" ? (
                  <textarea
                    value={form[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    rows={3}
                    style={{ ...inp, resize: "vertical" }}
                    onFocus={focus} onBlur={blur}
                  />
                ) : (
                  <input
                    type={type}
                    value={form[key] || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    style={inp}
                    onFocus={focus} onBlur={blur}
                  />
                )}
                {help && (
                  <div style={{ fontSize: 11, color: "#bbb", marginTop: 6, display: "flex", alignItems: "flex-start", gap: 4 }}>
                    <Info size={11} style={{ marginTop: 1, flexShrink: 0 }} />
                    {help}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ════════════════════════════════
            VISIBILITY TAB
        ════════════════════════════════ */}
        {tab === "visibility" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ color: "#888", fontSize: 13, margin: "0 0 6px" }}>
              Toggle which sections appear on the buyer home page.
            </p>
            {TOGGLES.map(({ key, label }) => {
              const on = form[key];
              return (
                <div
                  key={key}
                  style={{
                    background: "#fff", borderRadius: 16, padding: "18px 20px",
                    boxShadow: "0 2px 10px rgba(14,32,17,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                    border: `2px solid ${on ? "#A8FF3E" : "#E8EDE8"}`,
                    transition: "border-color 0.2s",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#0E2011" }}>{label}</div>
                    <div style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}>
                      Currently: <strong style={{ color: on ? "#1A7A2E" : "#888" }}>{on ? "Visible" : "Hidden"}</strong>
                    </div>
                  </div>
                  <button
                    onClick={() => handleChange(key, !on)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0, color: on ? "#1A7A2E" : "#ccc" }}
                  >
                    {on
                      ? <ToggleRight size={44} strokeWidth={1.5} />
                      : <ToggleLeft  size={44} strokeWidth={1.5} />}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ════════════════════════════════
            PREVIEW TAB
        ════════════════════════════════ */}
        {tab === "preview" && (
          <div>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>
              This is how the home page hero will appear to buyers based on your current settings.
            </p>

            {/* Hero preview */}
            <div style={{
              background: "linear-gradient(135deg,#0E2011,#1A472A)",
              borderRadius: 20, padding: "clamp(28px,5vw,48px) clamp(20px,4vw,40px)",
              position: "relative", overflow: "hidden", marginBottom: 16,
            }}>
              <div style={{ position: "absolute", top: "-20%", right: "-5%", width: "300px", height: "300px", background: "radial-gradient(circle,rgba(168,255,62,0.1) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
              {form.announcement && (
                <div style={{ background: "rgba(168,255,62,0.13)", border: "1px solid rgba(168,255,62,0.28)", borderRadius: 8, padding: "6px 14px", display: "inline-block", color: "#A8FF3E", fontSize: 12, fontWeight: 700, marginBottom: 18 }}>
                  📢 {form.announcement}
                </div>
              )}
              <h2 style={{
                fontFamily: "var(--font-display)", fontWeight: 800, color: "#fff",
                fontSize: "clamp(22px,4vw,38px)", margin: "0 0 12px", lineHeight: 1.1,
              }}>
                {(form.heroTitle || "").split("\n").map((line, i) => (
                  <span key={i}>{i > 0 && <br />}{line}</span>
                ))}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(12px,2vw,15px)", lineHeight: 1.7, maxWidth: 520, margin: "0 0 24px" }}>
                {form.heroSubtitle}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div style={{ background: "linear-gradient(135deg,#A8FF3E,#5BCC1C)", color: "#0E2011", borderRadius: 999, padding: "11px 28px", fontWeight: 800, fontSize: 13, fontFamily: "var(--font-display)" }}>Create Account — Free</div>
                <div style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "2px solid rgba(255,255,255,0.35)", borderRadius: 999, padding: "10px 26px", fontWeight: 700, fontSize: 13 }}>Sign In</div>
              </div>
            </div>

            {/* Section visibility indicators */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
              {TOGGLES.map(({ key, label }) => (
                <div
                  key={key}
                  style={{
                    background: form[key] ? "#E8FFD0" : "#F5F5F5",
                    border: `2px solid ${form[key] ? "#A8FF3E" : "#ddd"}`,
                    borderRadius: 12, padding: "12px 14px", textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{form[key] ? "✅" : "🚫"}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: form[key] ? "#1A7A2E" : "#888" }}>
                    {label.replace("Show ", "")}
                  </div>
                </div>
              ))}
            </div>

            {/* Featured products preview */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "20px", boxShadow: "0 2px 12px rgba(14,32,17,0.06)" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "#0E2011", margin: "0 0 16px" }}>
                Featured Products Preview
              </h3>
              {featured.length === 0 ? (
                <p style={{ color: "#aaa", fontSize: 13 }}>No featured products yet. Tag products as "Best Seller" or "Featured" in Inventory.</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                  {featured.map((p) => (
                    <div key={p.id} style={{ borderRadius: 14, overflow: "hidden", border: "1.5px solid #E8EDE8" }}>
                      <div style={{ height: 100, background: "#E8FFD0", overflow: "hidden" }}>
                        {p.image && (
                          <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => { e.target.style.display = "none"; }} />
                        )}
                      </div>
                      <div style={{ padding: "10px 12px" }}>
                        <div style={{ fontWeight: 700, fontSize: 12, color: "#0E2011", marginBottom: 3 }}>{p.name}</div>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#1A7A2E", fontSize: 14 }}>₱{p.price.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Store info / footer preview */}
            <div style={{ background: "#0E2011", borderRadius: 16, padding: "20px", marginTop: 16, color: "#fff" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "#A8FF3E", marginBottom: 12 }}>Footer Preview</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Store</div>
                  <div style={{ fontWeight: 700 }}>{form.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", marginTop: 4, fontSize: 12 }}>{form.tagline}</div>
                </div>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Contact</div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>{form.address}</div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 }}>{form.hours}</div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 }}>{form.contactEmail}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="seller-mobile-bottom-spacer" />
      </main>
    </div>
  );
}   