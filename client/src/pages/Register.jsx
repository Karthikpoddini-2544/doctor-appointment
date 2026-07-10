import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserShield, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

function Register() {
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ fullName: "", email: "", password: "", phone: "", type: "user" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [showPw,  setShowPw]  = useState(false);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.phone) { setError("Please fill in all required fields."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const { data } = await axios.post("/api/user/register", form);
      if (data.success) {
        setSuccess("Account created! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1800);
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (focused) => ({
    width: "100%", padding: "0.7rem 0.9rem 0.7rem 2.4rem",
    borderRadius: "10px", border: `1.5px solid ${focused ? "#f5c518" : "#ddd"}`,
    fontSize: "0.9rem", outline: "none", background: "#fafafa", transition: "border 0.2s",
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>

      {/* Navbar */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2.5rem", background: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
        <Link to="/" style={{ textDecoration: "none", fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#e6b800" }}>
          BOOK A DOCTOR
        </Link>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <button style={{ background: "#f5c518", border: "none", borderRadius: "50px", padding: "0.5rem 1.5rem", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", color: "#1a1a1a" }}>
            Login
          </button>
        </Link>
      </nav>

      {/* Main */}
      <div style={{
        flex: 1,
        background: "linear-gradient(135deg, #b8d4cd 0%, #c5ddd7 50%, #d0e6e1 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "2rem",
        position: "relative", overflow: "hidden",
      }}>
        <img src="/doctors-group.png" alt="" style={{ position: "absolute", right: 0, bottom: 0, height: "85%", opacity: 0.12, pointerEvents: "none" }} />

        <div style={{
          background: "#fff", borderRadius: "20px", padding: "2rem 2.5rem",
          width: "100%", maxWidth: "480px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          position: "relative", zIndex: 1,
          animation: "slideUp 0.4s ease both",
        }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#e6b800", marginBottom: "0.3rem" }}>BOOK A DOCTOR</div>
            <div style={{ fontWeight: 700, fontSize: "1.25rem", color: "#1a1a1a" }}>Create Account</div>
            <div style={{ fontSize: "0.83rem", color: "#666", marginTop: "0.2rem" }}>Join free — takes 2 minutes</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", marginBottom: "0.85rem" }}>
              {/* Full Name */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#444", marginBottom: "0.35rem" }}>Full Name *</label>
                <div style={{ position: "relative" }}>
                  <FaUser style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontSize: "0.8rem" }} />
                  <input id="reg-fullname" type="text" name="fullName" value={form.fullName} onChange={handleChange}
                    placeholder="John Smith"
                    style={{ width: "100%", padding: "0.7rem 0.9rem 0.7rem 2.4rem", borderRadius: "10px", border: "1.5px solid #ddd", fontSize: "0.9rem", outline: "none", background: "#fafafa" }}
                    onFocus={e => e.target.style.borderColor = "#f5c518"} onBlur={e => e.target.style.borderColor = "#ddd"} />
                </div>
              </div>

              {/* Email */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#444", marginBottom: "0.35rem" }}>Email Address *</label>
                <div style={{ position: "relative" }}>
                  <FaEnvelope style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontSize: "0.8rem" }} />
                  <input id="reg-email" type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="you@example.com"
                    style={{ width: "100%", padding: "0.7rem 0.9rem 0.7rem 2.4rem", borderRadius: "10px", border: "1.5px solid #ddd", fontSize: "0.9rem", outline: "none", background: "#fafafa" }}
                    onFocus={e => e.target.style.borderColor = "#f5c518"} onBlur={e => e.target.style.borderColor = "#ddd"} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#444", marginBottom: "0.35rem" }}>Password *</label>
                <div style={{ position: "relative" }}>
                  <FaLock style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontSize: "0.8rem" }} />
                  <input id="reg-password" type={showPw ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                    placeholder="Min. 6 chars"
                    style={{ width: "100%", padding: "0.7rem 2.2rem 0.7rem 2.4rem", borderRadius: "10px", border: "1.5px solid #ddd", fontSize: "0.9rem", outline: "none", background: "#fafafa" }}
                    onFocus={e => e.target.style.borderColor = "#f5c518"} onBlur={e => e.target.style.borderColor = "#ddd"} />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    style={{ position: "absolute", right: "0.7rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: "0.85rem", padding: 0 }}>
                    {showPw ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#444", marginBottom: "0.35rem" }}>Phone *</label>
                <div style={{ position: "relative" }}>
                  <FaPhone style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontSize: "0.8rem" }} />
                  <input id="reg-phone" type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+1 234 567 8900"
                    style={{ width: "100%", padding: "0.7rem 0.9rem 0.7rem 2.4rem", borderRadius: "10px", border: "1.5px solid #ddd", fontSize: "0.9rem", outline: "none", background: "#fafafa" }}
                    onFocus={e => e.target.style.borderColor = "#f5c518"} onBlur={e => e.target.style.borderColor = "#ddd"} />
                </div>
              </div>

              {/* Account Type */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#444", marginBottom: "0.35rem" }}>Account Type *</label>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {["user", "admin"].map(t => (
                    <button key={t} type="button" onClick={() => setForm({ ...form, type: t })}
                      style={{
                        flex: 1, padding: "0.65rem", borderRadius: "10px",
                        border: `2px solid ${form.type === t ? "#f5c518" : "#ddd"}`,
                        background: form.type === t ? "#fffbeb" : "#fafafa",
                        fontWeight: 600, fontSize: "0.85rem",
                        color: form.type === t ? "#b45309" : "#666",
                        cursor: "pointer", transition: "all 0.2s",
                        textTransform: "capitalize",
                      }}>
                      {t === "user" ? "👤 Patient" : "🛡️ Admin"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "0.65rem 0.9rem", color: "#dc2626", fontSize: "0.83rem", marginBottom: "0.85rem" }}>
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "0.65rem 0.9rem", color: "#16a34a", fontSize: "0.83rem", marginBottom: "0.85rem" }}>
                ✅ {success}
              </div>
            )}

            <button type="submit" id="register-submit" disabled={loading}
              style={{ width: "100%", background: "#f5c518", border: "none", borderRadius: "50px", padding: "0.8rem", fontWeight: 700, fontSize: "1rem", cursor: "pointer", color: "#1a1a1a", boxShadow: "0 4px 15px rgba(245,197,24,0.4)", transition: "all 0.2s", marginTop: "0.25rem" }}
              onMouseEnter={e => e.currentTarget.style.background = "#e6b800"}
              onMouseLeave={e => e.currentTarget.style.background = "#f5c518"}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.1rem", fontSize: "0.85rem", color: "#666" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#e6b800", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}

export default Register;
