import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Navbar ── */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2.5rem",
        background: "#fff",
        boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 800,
          fontSize: "1.4rem",
          color: "#e6b800",
          letterSpacing: "0.5px",
        }}>
          BOOK A DOCTOR
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button style={{
              background: "#f5c518",
              border: "none",
              borderRadius: "50px",
              padding: "0.55rem 1.75rem",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              color: "#1a1a1a",
              transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(245,197,24,0.35)",
            }}
            onMouseEnter={e => e.target.style.background = "#e6b800"}
            onMouseLeave={e => e.target.style.background = "#f5c518"}>
              Login
            </button>
          </Link>
          <Link to="/register" style={{ textDecoration: "none" }}>
            <button style={{
              background: "#f5c518",
              border: "none",
              borderRadius: "50px",
              padding: "0.55rem 1.75rem",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              color: "#1a1a1a",
              transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(245,197,24,0.35)",
            }}
            onMouseEnter={e => e.target.style.background = "#e6b800"}
            onMouseLeave={e => e.target.style.background = "#f5c518"}>
              Register
            </button>
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section style={{
        flex: 1,
        background: "linear-gradient(135deg, #b8d4cd 0%, #c5ddd7 40%, #d0e6e1 100%)",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        minHeight: "85vh",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          padding: "0 2.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>

          {/* Left — Doctors Image */}
          <div style={{
            flex: "0 0 52%",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-start",
            animation: "slideInLeft 0.8s ease both",
          }}>
            <img
              src="/doctors-group.png"
              alt="Doctors"
              style={{
                maxHeight: "78vh",
                maxWidth: "100%",
                objectFit: "contain",
                objectPosition: "bottom",
                filter: "drop-shadow(8px 0 24px rgba(0,0,0,0.12))",
                animation: "floatDocs 5s ease-in-out infinite",
              }}
            />
          </div>

          {/* Right — Text + CTA */}
          <div style={{
            flex: "0 0 42%",
            textAlign: "center",
            animation: "slideInRight 0.8s ease both",
          }}>
            <h1 style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
              color: "#1a1a1a",
              lineHeight: 1.3,
              marginBottom: "1rem",
            }}>
              Effortlessly schedule your doctor
            </h1>
            <p style={{
              fontSize: "1.05rem",
              color: "#444",
              lineHeight: 1.7,
              marginBottom: "2rem",
            }}>
              appointments with just a few clicks,<br />
              putting your health in your hands.
            </p>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <button style={{
                background: "#f5c518",
                border: "none",
                borderRadius: "50px",
                padding: "0.85rem 2.5rem",
                fontWeight: 700,
                fontSize: "1.05rem",
                cursor: "pointer",
                color: "#1a1a1a",
                boxShadow: "0 6px 20px rgba(245,197,24,0.45)",
                transition: "all 0.25s",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={e => { e.currentTarget.style.background="#e6b800"; e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 10px 30px rgba(245,197,24,0.55)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#f5c518"; e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 6px 20px rgba(245,197,24,0.45)"; }}>
                Book your Doctor
              </button>
            </Link>

            {/* Trust badges */}
            <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "2.5rem" }}>
              {[
                { num: "500+", label: "Doctors" },
                { num: "10K+", label: "Patients" },
                { num: "98%",  label: "Satisfaction" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "#1a1a1a" }}>{s.num}</div>
                  <div style={{ fontSize: "0.78rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features strip ── */}
      <section style={{ background: "#fff", padding: "3rem 2.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { icon: "🩺", title: "Find Specialists",    desc: "Browse verified doctors by specialty and availability." },
              { icon: "📅", title: "Book Instantly",      desc: "Schedule appointments in seconds with instant confirmation." },
              { icon: "📂", title: "Upload Documents",    desc: "Securely share medical records with your doctor." },
              { icon: "🔔", title: "Get Notified",        desc: "Real-time alerts for confirmations and updates." },
            ].map(f => (
              <div key={f.title} style={{
                flex: "1 1 200px",
                background: "#f9f9f9",
                borderRadius: "16px",
                padding: "1.5rem",
                textAlign: "center",
                border: "1px solid #eee",
                transition: "all 0.25s",
                cursor: "default",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-5px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor="#f5c518"; }}
              onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; e.currentTarget.style.borderColor="#eee"; }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1a1a1a", marginBottom: "0.35rem" }}>{f.title}</div>
                <div style={{ fontSize: "0.82rem", color: "#666", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#1a1a1a", color: "#aaa", textAlign: "center", padding: "1.25rem", fontSize: "0.82rem" }}>
        © {new Date().getFullYear()} Book a Doctor. All rights reserved.
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes slideInLeft {
          from { opacity:0; transform:translateX(-60px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity:0; transform:translateX(60px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes floatDocs {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }
        @media (max-width: 768px) {
          section > div { flex-direction: column !important; text-align: center; }
          section > div > div:first-child { flex: none !important; max-height: 45vh; }
          section > div > div:last-child  { flex: none !important; }
        }
      `}</style>
    </div>
  );
}

export default Home;
