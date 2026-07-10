import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="medibook-footer">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="footer-brand mb-2">🏥 MediBook</div>
            <p className="footer-text" style={{ maxWidth: 280 }}>
              Connecting patients with trusted healthcare professionals. Your health journey, simplified.
            </p>
          </div>
          <div className="col-md-2">
            <h6 style={{ fontWeight: 700, marginBottom: "1rem", color: "var(--text-secondary)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Platform
            </h6>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { to: "/", label: "Home" },
                { to: "/login", label: "Sign In" },
                { to: "/register", label: "Register" },
              ].map((link) => (
                <li key={link.to} style={{ marginBottom: "0.5rem" }}>
                  <Link to={link.to} style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }}
                    onMouseEnter={(e) => e.target.style.color = "var(--primary)"}
                    onMouseLeave={(e) => e.target.style.color = "var(--text-muted)"}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-3">
            <h6 style={{ fontWeight: 700, marginBottom: "1rem", color: "var(--text-secondary)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Specialties
            </h6>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {["Cardiology", "Neurology", "Pediatrics", "Dermatology"].map((spec) => (
                <li key={spec} style={{ marginBottom: "0.5rem" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{spec}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-3">
            <h6 style={{ fontWeight: 700, marginBottom: "1rem", color: "var(--text-secondary)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Contact
            </h6>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { icon: "📧", text: "support@medibook.health" },
                { icon: "📞", text: "+1 (800) MEDIBOOK" },
                { icon: "🕐", text: "24/7 Support Available" },
              ].map((c) => (
                <div key={c.text} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ fontSize: "0.875rem" }}>{c.icon}</span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <hr className="footer-divider" />
        <p className="footer-copyright">
          © {new Date().getFullYear()} MediBook. All rights reserved. Built with ❤️ for better healthcare access.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
