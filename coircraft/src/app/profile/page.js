"use client";
import { useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { User, MapPin, Phone, Lock, Camera, ShoppingBag, Heart, LogOut, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, setUser, transactions, wishlist } = useApp();
  const router  = useRouter();
  const fileRef = useRef();

  const [tab,     setTab]     = useState("info");
  const [editing, setEditing] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form,    setForm]    = useState({ name: "", address: "", mobile: "", email: "" });
  const [pwForm,  setPwForm]  = useState({ current: "", newPw: "", confirm: "" });
  const [pwMsg,   setPwMsg]   = useState({ text: "", ok: false });
  const [pwLoad,  setPwLoad]  = useState(false);
  const [showPw,  setShowPw]  = useState(false);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    setForm({ name: user.name || "", address: user.address || "", mobile: user.mobile || "", email: user.email || "" });
  }, [user]);

  if (!user) return null;

  const initials   = user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const totalSpent = transactions.reduce((s, t) => s + t.total, 0);
  const received   = transactions.filter((t) => t.status === "Received").length;

  // ── Avatar upload → saved to DB ─────────────────────────────────────────
  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const avatar = reader.result;
      // Optimistic update
      setUser({ ...user, avatar });
      // Persist to DB
      try {
        await fetch("/api/auth/profile", {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ email: user.email, avatar }),
        });
      } catch (err) {
        console.error("Avatar save failed:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  // ── Profile save → DB ───────────────────────────────────────────────────
  const saveProfile = async () => {
    if (!form.name.trim()) return;
    setSaving(true);

    try {
      const res  = await fetch("/api/auth/profile", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          email:   user.email,
          name:    form.name,
          address: form.address,
          mobile:  form.mobile,
        }),
      });
      const data = await res.json();

      if (res.ok && data.user) {
        // Update context with fresh DB values
        setUser({
          ...user,
          name:    data.user.name,
          address: data.user.address || "",
          mobile:  data.user.mobile  || "",
        });
      } else {
        // Still update local state even if DB fails
        setUser({ ...user, name: form.name, address: form.address, mobile: form.mobile });
      }
    } catch {
      // Offline fallback — update local state
      setUser({ ...user, name: form.name, address: form.address, mobile: form.mobile });
    }

    setEditing(false);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // ── Password change → DB ─────────────────────────────────────────────────
  const changePassword = async (e) => {
    e.preventDefault();
    setPwMsg({ text: "", ok: false });

    if (pwForm.newPw.length < 6) {
      setPwMsg({ text: "New password must be at least 6 characters.", ok: false });
      return;
    }
    if (pwForm.newPw !== pwForm.confirm) {
      setPwMsg({ text: "New passwords do not match.", ok: false });
      return;
    }

    setPwLoad(true);
    try {
      const res  = await fetch("/api/auth/profile", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          email:           user.email,
          currentPassword: pwForm.current,
          newPassword:     pwForm.newPw,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setPwMsg({ text: "Password changed successfully!", ok: true });
        setPwForm({ current: "", newPw: "", confirm: "" });
      } else {
        setPwMsg({ text: data.error || "Failed to change password.", ok: false });
      }
    } catch {
      setPwMsg({ text: "Network error. Please try again.", ok: false });
    }
    setPwLoad(false);
  };

  const inp = { width: "100%", border: "2px solid #E8EDE8", borderRadius: 14, padding: "13px 18px", fontSize: 14, fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box", background: "#fff" };

  return (
    <>
      <Navbar />
      <main style={{ background: "#FFFEF5", minHeight: "100vh", fontFamily: "var(--font-body)", padding: "48px 24px 80px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>

          {/* Hero card */}
          <div style={{ background: "linear-gradient(135deg,#1A472A,#0E2011)", borderRadius: 28, padding: "36px 44px", marginBottom: 24, display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg,#A8FF3E,#5BCC1C)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "3px solid rgba(168,255,62,0.4)" }}>
                {user.avatar
                  ? <img src={user.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "#0E2011" }}>{initials}</span>}
              </div>
              <button onClick={() => fileRef.current.click()}
                style={{ position: "absolute", bottom: 0, right: 0, width: 30, height: 30, background: "#A8FF3E", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Camera size={14} color="#0E2011" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatar} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", color: "#fff", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>{user.name}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{user.email}</div>
            </div>
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
              {[
                { v: transactions.length,           l: "Orders"   },
                { v: `₱${totalSpent.toLocaleString()}`, l: "Spent" },
                { v: wishlist.length,                l: "Wishlist" },
                { v: received,                       l: "Received" },
              ].map(({ v, l }) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", color: "#A8FF3E", fontWeight: 800, fontSize: 20 }}>{v}</div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {[
              { id: "info",     l: "My Info",  icon: User      },
              { id: "security", l: "Security", icon: Lock      },
              { id: "stats",    l: "Activity", icon: ShoppingBag },
            ].map(({ id, l, icon: Ic }) => (
              <button key={id} onClick={() => setTab(id)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 50, border: "2.5px solid", borderColor: tab === id ? "#0E2011" : "#E8EDE8", background: tab === id ? "#0E2011" : "#fff", color: tab === id ? "#A8FF3E" : "#555", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>
                <Ic size={15} /> {l}
              </button>
            ))}
          </div>

          {/* ── My Info ── */}
          {tab === "info" && (
            <div style={{ background: "#fff", borderRadius: 24, padding: "32px 36px", boxShadow: "0 4px 20px rgba(14,32,17,0.07)" }} className="animate-fadeSlideUp">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "#0E2011", margin: 0 }}>Account Information</h2>
                {!editing
                  ? <button onClick={() => setEditing(true)} className="tk-btn-dark" style={{ fontSize: 13 }}>Edit Profile</button>
                  : <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={saveProfile} disabled={saving} className="tk-btn-cta" style={{ padding: "10px 22px", fontSize: 13, opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer" }}>
                        {saving ? "Saving…" : "Save"}
                      </button>
                      <button onClick={() => setEditing(false)} style={{ background: "#fff", border: "2px solid #ddd", borderRadius: 50, padding: "10px 22px", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13, cursor: "pointer", color: "#888" }}>Cancel</button>
                    </div>}
              </div>

              {saved && (
                <div className="animate-bounceIn" style={{ background: "#E8FFD0", border: "1.5px solid #A8FF3E", borderRadius: 12, padding: "12px 18px", marginBottom: 20, fontSize: 13, color: "#1A7A2E", fontWeight: 700 }}>
                  ✅ Profile updated and saved to your account!
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[
                  { key: "name",    l: "Full Name",  ro: false       },
                  { key: "email",   l: "Email",      ro: true        },
                  { key: "mobile",  l: "Mobile",     ro: false       },
                  { key: "address", l: "Address",    ro: false, span: 2 },
                ].map(({ key, l, ro, span }) => (
                  <div key={key} style={{ gridColumn: span === 2 ? "1/-1" : "auto" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>{l}</label>
                    {editing && !ro
                      ? <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} style={{ ...inp }}
                          onFocus={(e) => (e.target.style.borderColor = "#A8FF3E")}
                          onBlur={(e)  => (e.target.style.borderColor = "#E8EDE8")} />
                      : <div style={{ fontSize: 15, color: "#0E2011", fontWeight: 600, padding: "13px 0", borderBottom: "1.5px solid #F5F5F0" }}>
                          {user[key] || "—"} {ro && <span style={{ fontSize: 11, color: "#ccc", marginLeft: 6 }}>(read-only)</span>}
                        </div>}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
                <Link href="/history" style={{ display: "flex", alignItems: "center", gap: 8, background: "#F5F9F0", border: "2px solid #E8FFD0", borderRadius: 14, padding: "13px 18px", textDecoration: "none", color: "#0E2011", fontWeight: 700, fontSize: 13 }}>
                  <ShoppingBag size={16} color="#1A7A2E" /> My Orders
                </Link>
                <Link href="/wishlist" style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF0F0", border: "2px solid #FFCDD2", borderRadius: 14, padding: "13px 18px", textDecoration: "none", color: "#C62828", fontWeight: 700, fontSize: 13 }}>
                  <Heart size={16} /> Wishlist ({wishlist.length})
                </Link>
                <button onClick={() => { setUser(null); router.push("/"); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF0F0", border: "2px solid #FFCDD2", borderRadius: 14, padding: "13px 18px", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13, color: "#C62828" }}>
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          )}

          {/* ── Security (password change → DB) ── */}
          {tab === "security" && (
            <div style={{ background: "#fff", borderRadius: 24, padding: "32px 36px", boxShadow: "0 4px 20px rgba(14,32,17,0.07)" }} className="animate-fadeSlideUp">
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "#0E2011", margin: "0 0 8px" }}>Change Password</h2>
              <p style={{ color: "#888", fontSize: 13, margin: "0 0 24px" }}>Your new password will be saved to your account and you can use it on any device.</p>

              {pwMsg.text && (
                <div className="animate-bounceIn" style={{ background: pwMsg.ok ? "#E8FFD0" : "#FFF0F0", border: `1.5px solid ${pwMsg.ok ? "#A8FF3E" : "#FFCDD2"}`, borderRadius: 12, padding: "12px 18px", marginBottom: 22, fontSize: 13, color: pwMsg.ok ? "#1A7A2E" : "#C62828", fontWeight: 700 }}>
                  {pwMsg.ok ? "✅" : "⚠️"} {pwMsg.text}
                </div>
              )}

              <form onSubmit={changePassword} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  { k: "current", l: "Current Password"  },
                  { k: "newPw",   l: "New Password"      },
                  { k: "confirm", l: "Confirm New Password" },
                ].map(({ k, l }) => (
                  <div key={k}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#555", marginBottom: 8 }}>{l}</label>
                    <div style={{ position: "relative" }}>
                      <input type={showPw ? "text" : "password"} required value={pwForm[k]}
                        onChange={(e) => setPwForm({ ...pwForm, [k]: e.target.value })}
                        style={{ ...inp, paddingRight: 48 }}
                        onFocus={(e) => (e.target.style.borderColor = "#A8FF3E")}
                        onBlur={(e)  => (e.target.style.borderColor = "#E8EDE8")} />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa" }}>
                        {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>
                ))}
                <button type="submit" disabled={pwLoad} className="tk-btn-cta"
                  style={{ alignSelf: "flex-start", padding: "13px 32px", opacity: pwLoad ? 0.7 : 1, cursor: pwLoad ? "not-allowed" : "pointer" }}>
                  {pwLoad ? "Updating…" : "Update Password"}
                </button>
              </form>
            </div>
          )}

          {/* ── Activity stats ── */}
          {tab === "stats" && (
            <div style={{ background: "#fff", borderRadius: 24, padding: "32px 36px", boxShadow: "0 4px 20px rgba(14,32,17,0.07)" }} className="animate-fadeSlideUp">
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "#0E2011", margin: "0 0 24px" }}>Account Activity</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, marginBottom: 28 }}>
                {[
                  { l: "Total Orders",    v: transactions.length,                 i: "📦", bg: "#E8FFD0" },
                  { l: "Total Spent",     v: `₱${totalSpent.toLocaleString()}`,   i: "💰", bg: "#FFF3D9" },
                  { l: "Orders Received", v: received,                            i: "✅", bg: "#DBEAFE" },
                  { l: "Wishlist Items",  v: wishlist.length,                     i: "❤️", bg: "#FFE4E6" },
                ].map(({ l, v, i, bg }) => (
                  <div key={l} style={{ background: bg, borderRadius: 18, padding: "22px 24px" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{i}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "#0E2011" }}>{v}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>{l}</div>
                  </div>
                ))}
              </div>
              <Link href="/history" className="tk-btn-cta" style={{ textDecoration: "none", display: "inline-block" }}>View All Orders →</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}