"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

const fields = [
  { key: "name",            label: "Complete Name",    type: "text",     placeholder: "Juan dela Cruz",            span: 2 },
  { key: "email",           label: "Email Address",    type: "email",    placeholder: "you@email.com",              span: 2 },
  { key: "address",         label: "Address",          type: "text",     placeholder: "123 Street, City, Province", span: 2 },
  { key: "mobile",          label: "Mobile Number",    type: "tel",      placeholder: "09XX XXX XXXX",              span: 1 },
  { key: "password",        label: "Password",         type: "password", placeholder: "Min. 6 characters",          span: 1 },
  { key: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat your password",       span: 2 },
];

export default function RegisterPage() {
  const { setUser } = useApp();
  const router = useRouter();

  const [form,     setForm]     = useState({ name:"", email:"", address:"", mobile:"", password:"", confirmPassword:"" });
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const getStrength = (pw) => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 6)          s++;
    if (/[A-Z]/.test(pw))        s++;
    if (/[0-9]/.test(pw))        s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const strength      = getStrength(form.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#E74C3C", "#FF8C00", "#1A7A2E", "#A8FF3E"][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:     form.name,
          email:    form.email.trim().toLowerCase(),
          password: form.password,
          address:  form.address,
          mobile:   form.mobile,
        }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        // Auto login after registration
        setUser({
          name:    data.user.name,
          email:   data.user.email,
          address: data.user.address || "",
          mobile:  data.user.mobile  || "",
        });
        setSuccess(true);
        setTimeout(() => router.push("/store"), 2000);
        return;
      }

      setError(data.error || "Registration failed. Please try again.");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const inp = {
    width: "100%", border: "2px solid #E8EDE8", borderRadius: 14,
    padding: "13px 18px", fontSize: 14, fontFamily: "var(--font-body)",
    outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "#FFFEF5", minHeight: "100vh", fontFamily: "var(--font-body)", padding: "48px 16px" }}>
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
          <div style={{ position: "absolute", top: -100, right: -80, width: 500, height: 500, background: "radial-gradient(circle,rgba(168,255,62,0.07) 0%,transparent 70%)", borderRadius: "50%" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 560, margin: "0 auto" }}>
          <div style={{ background: "#fff", borderRadius: 28, boxShadow: "0 20px 60px rgba(14,32,17,0.12)", padding: "clamp(28px,5vw,48px) clamp(20px,5vw,44px)" }}>

            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 68, height: 68, background: "linear-gradient(135deg,#A8FF3E,#1A472A)", borderRadius: 20, fontSize: 32, marginBottom: 16, boxShadow: "0 8px 24px rgba(168,255,62,0.35)" }}>🥥</div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "#0E2011", margin: "0 0 6px" }}>Create Account</h1>
              <p style={{ color: "#888", fontSize: 14 }}>Join the CoirCraft community today</p>
            </div>

            {success && (
              <div style={{ background: "#E8FFD0", border: "1.5px solid #A8FF3E", borderRadius: 14, padding: "14px 18px", marginBottom: 20, fontSize: 13, color: "#1A7A2E", textAlign: "center", fontWeight: 700 }}>
                ✅ Account created! Taking you to the store...
              </div>
            )}
            {error && (
              <div style={{ background: "#FFF0F0", border: "1.5px solid #FFCDD2", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#C62828" }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {fields.map(({ key, label, type, placeholder, span }) => (
                  <div key={key} style={{ gridColumn: span === 2 ? "1 / -1" : "auto" }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#0E2011", marginBottom: 7 }}>{label}</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={type === "password" ? (showPass ? "text" : "password") : type}
                        required
                        value={form[key]}
                        onChange={(e) => { setForm({ ...form, [key]: e.target.value }); setError(""); }}
                        placeholder={placeholder}
                        style={inp}
                        onFocus={(e) => (e.target.style.borderColor = "#A8FF3E")}
                        onBlur={(e)  => (e.target.style.borderColor = "#E8EDE8")}
                      />
                      {(key === "password" || key === "confirmPassword") && (
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa" }}>
                          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      )}
                    </div>

                    {/* Password strength bar */}
                    {key === "password" && form.password && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                          {[1,2,3,4].map((i) => (
                            <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i <= strength ? strengthColor : "#E8EDE8", transition: "background 0.3s" }} />
                          ))}
                        </div>
                        <div style={{ fontSize: 11, color: strengthColor, fontWeight: 700 }}>{strengthLabel}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button type="submit" disabled={loading || success}
                style={{ width: "100%", background: loading ? "#D4F5A0" : "linear-gradient(135deg,#A8FF3E,#5BCC1C)", color: "#0E2011", border: "none", padding: "15px", borderRadius: 50, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 20px rgba(168,255,62,0.4)", marginTop: 22, transition: "all 0.2s" }}>
                {loading ? "Creating Account..." : "Create Account →"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#888" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#1A7A2E", fontWeight: 700, textDecoration: "none" }}>Sign in here</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}