import React, { useState } from "react";
import { FaUserMd, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaDollarSign, FaClock, FaCalendarAlt, FaFileUpload, FaTimes } from "react-icons/fa";
import axios from "axios";
import moment from "moment";

function DoctorList({ doctor, userdata }) {
  const [show,         setShow]         = useState(false);
  const [dateTime,     setDateTime]     = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [msg,          setMsg]          = useState({ text: "", type: "" });

  const handleClose = () => { setShow(false); setMsg({ text: "", type: "" }); setDateTime(""); setDocumentFile(null); };
  const handleShow  = () => setShow(true);

  const today = new Date().toISOString().slice(0, 16);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!dateTime) { setMsg({ text: "Please select a date and time.", type: "error" }); return; }
    setLoading(true);
    try {
      const token    = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("doctorId",   doctor._id);
      formData.append("doctorInfo", JSON.stringify(doctor));
      formData.append("userInfo",   JSON.stringify(userdata));
      formData.append("date",       dateTime);
      if (documentFile) formData.append("document", documentFile);

      const { data } = await axios.post("/api/appointment/bookappointment", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        setMsg({ text: "Appointment booked successfully!", type: "success" });
        setTimeout(() => handleClose(), 2000);
      } else {
        setMsg({ text: data.message || "Booking failed.", type: "error" });
      }
    } catch (err) {
      setMsg({ text: err.response?.data?.message || "Booking failed. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const timingsDisplay = Array.isArray(doctor.timings) && doctor.timings.length === 2
    ? `${doctor.timings[0]} – ${doctor.timings[1]}`
    : doctor.timings || "N/A";

  const infoItems = [
    { icon: FaPhone,        label: "Phone",      value: doctor.phone },
    { icon: FaMapMarkerAlt, label: "Address",    value: doctor.address },
    { icon: FaGraduationCap,label: "Experience", value: `${doctor.experience} yrs` },
    { icon: FaDollarSign,   label: "Fees",       value: `$${doctor.fees}` },
    { icon: FaClock,        label: "Timings",    value: timingsDisplay },
  ];

  return (
    <>
      {/* ── Doctor Card ── */}
      <div className="doctor-card animate-fadeInUp">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1rem" }}>
          <div style={{
            width: 52, height: 52,
            background: "var(--gradient-btn)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: "1.15rem", color: "#fff", flexShrink: 0,
          }}>
            {doctor.fullName?.charAt(0) || "D"}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.2rem" }}>Dr. {doctor.fullName}</div>
            <span style={{
              background: "rgba(14,165,233,0.12)", color: "var(--primary)",
              fontSize: "0.73rem", fontWeight: 600, padding: "0.15rem 0.65rem",
              borderRadius: "50px", border: "1px solid rgba(14,165,233,0.25)",
            }}>
              {doctor.specialisation}
            </span>
          </div>
        </div>

        {/* Info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "1rem" }}>
          {infoItems.map(item => (
            <div key={item.label}>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px", display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "0.1rem" }}>
                <item.icon style={{ fontSize: "0.65rem" }} /> {item.label}
              </div>
              <div style={{ fontSize: "0.83rem", fontWeight: 500, color: "var(--text-secondary)" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <button id={`book-btn-${doctor._id}`} className="btn-medibook-primary w-100"
          style={{ padding: "0.65rem", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
          onClick={handleShow}>
          <FaCalendarAlt /> Book Appointment
        </button>
      </div>

      {/* ── Custom Modal ── */}
      {show && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1rem",
          animation: "fadeIn 0.2s ease",
        }}
        onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>
          <div style={{
            background: "#111827",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "20px",
            width: "100%", maxWidth: "480px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
            animation: "slideUp 0.3s ease",
            overflow: "hidden",
          }}>
            {/* Modal Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <div style={{ width: 36, height: 36, background: "var(--gradient-btn)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>
                  {doctor.fullName?.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Book with Dr. {doctor.fullName}</div>
                  <div style={{ fontSize: "0.73rem", color: "var(--text-muted)" }}>{doctor.specialisation}</div>
                </div>
              </div>
              <button onClick={handleClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.1rem", padding: "0.25rem" }}>
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "1.5rem" }}>
              {/* Doctor info summary */}
              <div style={{
                background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)",
                borderRadius: "12px", padding: "0.85rem 1rem", marginBottom: "1.25rem",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    <FaDollarSign style={{ color: "var(--success)", marginRight: 3 }} />${doctor.fees} consultation
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    <FaClock style={{ marginRight: 3 }} />{timingsDisplay}
                  </span>
                </div>
              </div>

              <form onSubmit={handleBook}>
                {/* Date & Time */}
                <div className="form-group">
                  <label className="form-label">
                    <FaCalendarAlt /> Appointment Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    id={`datetime-${doctor._id}`}
                    className="form-control-dark"
                    value={dateTime}
                    min={today}
                    onChange={e => setDateTime(e.target.value)}
                    required
                  />
                </div>

                {/* Document Upload */}
                <div className="form-group">
                  <label className="form-label">
                    <FaFileUpload /> Upload Document <span style={{ color: "var(--text-muted)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                  </label>
                  <input
                    type="file"
                    id={`document-${doctor._id}`}
                    className="form-control-dark"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    onChange={e => setDocumentFile(e.target.files[0])}
                    style={{ paddingTop: "0.5rem" }}
                  />
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
                    Accepted: JPG, PNG, PDF, DOC (max 5MB)
                  </p>
                </div>

                {/* Message */}
                {msg.text && (
                  <div style={{
                    background: msg.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                    border: `1px solid ${msg.type === "success" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                    borderRadius: "8px", padding: "0.75rem 1rem",
                    color: msg.type === "success" ? "#6ee7b7" : "#fca5a5",
                    fontSize: "0.875rem", marginBottom: "1rem",
                  }}>
                    {msg.type === "success" ? "✅" : "⚠️"} {msg.text}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button type="button" className="btn-medibook-outline"
                    style={{ flex: 1, padding: "0.7rem", textAlign: "center" }} onClick={handleClose}>
                    Cancel
                  </button>
                  <button type="submit" id={`confirm-book-${doctor._id}`} className="btn-medibook-primary"
                    style={{ flex: 1, padding: "0.7rem", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
                    disabled={loading}>
                    {loading
                      ? <><span className="spinner-border spinner-border-sm" /> Booking...</>
                      : <><FaCalendarAlt /> Confirm Booking</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DoctorList;
