import React, { useState } from "react";
import axios from "axios";

const SPECIALISATIONS = [
  "Cardiologist", "Dermatologist", "ENT Specialist", "Gastroenterologist",
  "General Physician", "Gynecologist", "Neurologist", "Ophthalmologist",
  "Orthopedic", "Pediatrician", "Psychiatrist", "Pulmonologist",
  "Radiologist", "Urologist", "Other"
];

function ApplyDoctor({ userId }) {
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", address: "",
    specialisation: "", experience: "", fees: "",
    timingsFrom: "09:00", timingsTo: "17:00",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ["fullName", "email", "phone", "address", "specialisation", "experience", "fees"];
    for (const field of required) {
      if (!form[field]) {
        setMsg({ text: `Please fill in all required fields (missing: ${field}).`, type: "error" });
        return;
      }
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...form,
        userId,
        fees: Number(form.fees),
        timings: [form.timingsFrom, form.timingsTo],
      };
      const { data } = await axios.post("/api/doctor/applydoctor", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setMsg({ text: "Application submitted! An admin will review it shortly.", type: "success" });
        setForm({ fullName: "", email: "", phone: "", address: "", specialisation: "", experience: "", fees: "", timingsFrom: "09:00", timingsTo: "17:00" });
      } else {
        setMsg({ text: data.message || "Application failed.", type: "error" });
      }
    } catch (err) {
      setMsg({ text: err.response?.data?.message || "Application failed. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { marginBottom: "1rem" };

  return (
    <div className="apply-doctor-page">
      <div className="apply-doctor-card">
        <div className="section-header mb-4">
          <h2>🩺 Apply as a Doctor</h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Fill out this form to request a doctor account. Our admin team will review your application.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section: Personal Details */}
          <div style={{
            background: "rgba(14,165,233,0.05)",
            border: "1px solid rgba(14,165,233,0.15)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}>
            <h5 style={{ fontWeight: 700, marginBottom: "1.25rem", color: "var(--primary)" }}>
              👤 Personal Details
            </h5>
            <div className="row g-3">
              <div className="col-md-6" style={inputStyle}>
                <label className="form-label">Full Name *</label>
                <input name="fullName" type="text" className="form-control-dark"
                  placeholder="Dr. John Smith" value={form.fullName} onChange={handleChange} />
              </div>
              <div className="col-md-6" style={inputStyle}>
                <label className="form-label">Phone Number *</label>
                <input name="phone" type="tel" className="form-control-dark"
                  placeholder="+1 234 567 8900" value={form.phone} onChange={handleChange} />
              </div>
              <div className="col-md-6" style={inputStyle}>
                <label className="form-label">Email Address *</label>
                <input name="email" type="email" className="form-control-dark"
                  placeholder="doctor@example.com" value={form.email} onChange={handleChange} />
              </div>
              <div className="col-md-6" style={inputStyle}>
                <label className="form-label">Clinic / Hospital Address *</label>
                <input name="address" type="text" className="form-control-dark"
                  placeholder="123 Medical Center, City" value={form.address} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Section: Professional Details */}
          <div style={{
            background: "rgba(139,92,246,0.05)",
            border: "1px solid rgba(139,92,246,0.15)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}>
            <h5 style={{ fontWeight: 700, marginBottom: "1.25rem", color: "var(--accent)" }}>
              🎓 Professional Details
            </h5>
            <div className="row g-3">
              <div className="col-md-6" style={inputStyle}>
                <label className="form-label">Specialisation *</label>
                <select name="specialisation" className="form-select-dark" value={form.specialisation} onChange={handleChange}>
                  <option value="">-- Select Specialisation --</option>
                  {SPECIALISATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-md-6" style={inputStyle}>
                <label className="form-label">Years of Experience *</label>
                <input name="experience" type="number" min="0" max="60" className="form-control-dark"
                  placeholder="e.g. 5" value={form.experience} onChange={handleChange} />
              </div>
              <div className="col-md-6" style={inputStyle}>
                <label className="form-label">Consultation Fees (USD) *</label>
                <input name="fees" type="number" min="0" className="form-control-dark"
                  placeholder="e.g. 100" value={form.fees} onChange={handleChange} />
              </div>
              <div className="col-md-6" style={inputStyle}>
                <label className="form-label">Available Timings *</label>
                <div className="d-flex gap-2 align-items-center">
                  <input type="time" name="timingsFrom" className="form-control-dark"
                    value={form.timingsFrom} onChange={handleChange} />
                  <span style={{ color: "var(--text-muted)" }}>to</span>
                  <input type="time" name="timingsTo" className="form-control-dark"
                    value={form.timingsTo} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          {msg.text && (
            <div style={{
              background: msg.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
              border: `1px solid ${msg.type === "success" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
              borderRadius: "var(--radius-sm)",
              padding: "0.75rem 1rem",
              color: msg.type === "success" ? "#6ee7b7" : "#fca5a5",
              fontSize: "0.875rem",
              marginBottom: "1rem",
            }}>
              {msg.type === "success" ? "✅" : "⚠️"} {msg.text}
            </div>
          )}

          <button
            type="submit"
            id="apply-doctor-submit"
            className="btn-medibook-primary"
            style={{ padding: "0.85rem 2.5rem", fontSize: "1rem" }}
            disabled={loading}
          >
            {loading ? <><span className="spinner-border spinner-border-sm me-2" />Submitting...</> : "Submit Application →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ApplyDoctor;
