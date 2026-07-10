import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [showPw,  setShowPw]  = useState(false);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const { data } = await axios.post("/api/user/login", form);
      if (data.success) {
        localStorage.setItem("token",    data.token);
        localStorage.setItem("userData", JSON.stringify(data.userData));
        navigate(data.userData.type === "admin" ? "/adminhome" : "/userhome");
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>

      {/* Navbar */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2.5rem", background: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
        <Link to="/" style={{ textDecoration: "none", fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#e6b800" }}>
          BOOK A DOCTOR
        </Link>
        <Link to="/register" style={{ textDecoration: "none" }}>
          <button style={{ background: "#f5c518", border: "none", borderRadius: "50px", padding: "0.5rem 1.5rem", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", color: "#1a1a1a" }}>
            Register
          </button>
        </Link>
      </nav>

      {/* Main */}
      <div style={{
        flex: 1,
        background: "linear-gradient(135deg, #b8d4cd 0%, #c5ddd7 50%, #d0e6e1 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Doctors image faint behind */}
        <img src="/doctors-group.png" alt="" style={{ position: "absolute", right: 0, bottom: 0, height: "85%", opacity: 0.15, pointerEvents: "none" }} />

        {/* Card */}
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "2.5rem",
          width: "100%", maxWidth: "420px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          position: "relative", zIndex: 1,
          animation: "slideUp 0.4s ease both",
        }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#e6b800", marginBottom: "0.4rem" }}>BOOK A DOCTOR</div>
            <div style={{ fontWeight: 700, fontSize: "1.3rem", color: "#1a1a1a" }}>Welcome Back</div>
            <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.2rem" }}>Sign in to your account</div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#444", marginBottom: "0.4rem" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <FaEnvelope style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontSize: "0.85rem" }} />
                <input id="login-email" type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  style={{ width: "100%", padding: "0.7rem 0.9rem 0.7rem 2.4rem", borderRadius: "10px", border: "1.5px solid #ddd", fontSize: "0.9rem", outline: "none", transition: "border 0.2s", background: "#fafafa" }}
                  onFocus={e => e.target.style.borderColor = "#f5c518"}
                  onBlur={e => e.target.style.borderColor = "#ddd"} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#444", marginBottom: "0.4rem" }}>Password</label>
              <div style={{ position: "relative" }}>
                <FaLock style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontSize: "0.85rem" }} />
                <input id="login-password" type={showPw ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                  placeholder="Enter your password"
                  style={{ width: "100%", padding: "0.7rem 2.5rem 0.7rem 2.4rem", borderRadius: "10px", border: "1.5px solid #ddd", fontSize: "0.9rem", outline: "none", transition: "border 0.2s", background: "#fafafa" }}
                  onFocus={e => e.target.style.borderColor = "#f5c518"}
                  onBlur={e => e.target.style.borderColor = "#ddd"} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: "0.9rem", padding: 0 }}>
                  {showPw ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "0.65rem 0.9rem", color: "#dc2626", fontSize: "0.83rem", marginBottom: "1rem" }}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" id="login-submit" disabled={loading}
              style={{ width: "100%", background: "#f5c518", border: "none", borderRadius: "50px", padding: "0.8rem", fontWeight: 700, fontSize: "1rem", cursor: "pointer", color: "#1a1a1a", boxShadow: "0 4px 15px rgba(245,197,24,0.4)", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#e6b800"}
              onMouseLeave={e => e.currentTarget.style.background = "#f5c518"}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.85rem", color: "#666" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#e6b800", fontWeight: 700, textDecoration: "none" }}>Create one</Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}

export default Login;
