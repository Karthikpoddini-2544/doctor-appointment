import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaDollarSign, FaFileMedical, FaSync, FaUserMd } from "react-icons/fa";
import axios from "axios";
import moment from "moment";

function UserAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/appointment/getuserappointments", { headers:{ Authorization:`Bearer ${token}` } });
      if (data.success) setAppointments(data.data);
      else setError("Failed to fetch appointments.");
    } catch (err) { setError("Error loading your appointments."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const getStatusColor = (status) =>
    status === "approved" ? "#10b981" : status === "rejected" ? "#ef4444" : "#f59e0b";

  const getStatusBadge = (status) => {
    const cls = status === "approved" ? "badge-approved" : status === "rejected" ? "badge-rejected" : "badge-pending";
    return <span className={cls}>{status}</span>;
  };

  return (
    <div className="animate-fadeIn">
      <div className="section-header d-flex justify-content-between align-items-center">
        <div>
          <h2>My Appointments</h2>
          <p>Track all your past and upcoming appointments.</p>
        </div>
        <button className="btn-medibook-outline" style={{ padding:".5rem 1.25rem", fontSize:".85rem", display:"flex", alignItems:"center", gap:4 }} onClick={fetchAppointments}>
          <FaSync />Refresh
        </button>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height:200 }}>
          <div className="spinner-border" style={{ color:"var(--primary)" }} />
        </div>
      ) : error ? (
        <div style={{ background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.3)", borderRadius:"var(--radius-md)", padding:"1rem", color:"#fca5a5" }}>{error}</div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <FaCalendarAlt style={{ fontSize:"2.5rem", marginBottom:".75rem", color:"var(--text-muted)" }} />
          <h5 style={{ color:"var(--text-secondary)" }}>No appointments yet</h5>
          <p>Book your first appointment from the home page.</p>
        </div>
      ) : (
        <div className="row g-3 stagger-children">
          {appointments.map((apt) => (
            <div key={apt._id} className="col-md-6 col-lg-4 animate-fadeInUp">
              <div style={{
                background:"rgba(10,15,30,.85)",
                border:"1px solid var(--border)",
                borderRadius:"var(--radius-lg)",
                padding:"1.25rem",
                transition:"all .3s",
                position:"relative",
                overflow:"hidden",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 12px 32px rgba(0,0,0,.4)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
              >
                {/* Color top bar */}
                <div style={{ position:"absolute", top:0, left:0, width:"100%", height:3, background:`linear-gradient(90deg, ${getStatusColor(apt.status)}, transparent)` }} />

                {/* Doctor info */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ width:40, height:40, background:"var(--gradient-btn)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:".9rem", flexShrink:0 }}>
                      {apt.doctorInfo?.fullName?.charAt(0) || "D"}
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:".95rem" }}>Dr. {apt.doctorInfo?.fullName}</div>
                      <div style={{ fontSize:".75rem", color:"var(--primary)" }}>
                        <FaUserMd style={{ marginRight:3 }} />{apt.doctorInfo?.specialisation}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(apt.status)}
                </div>

                {/* Details grid */}
                <div style={{ display:"grid", gap:".5rem" }}>
                  <div style={{ display:"flex", gap:".6rem", alignItems:"center" }}>
                    <FaCalendarAlt style={{ color:"var(--primary)", fontSize:".85rem", flexShrink:0 }} />
                    <span style={{ fontSize:".85rem", color:"var(--text-secondary)" }}>
                      {moment(apt.date).format("MMMM DD, YYYY")}
                    </span>
                  </div>
                  <div style={{ display:"flex", gap:".6rem", alignItems:"center" }}>
                    <FaClock style={{ color:"var(--accent)", fontSize:".85rem", flexShrink:0 }} />
                    <span style={{ fontSize:".85rem", color:"var(--text-secondary)" }}>
                      {moment(apt.date).format("hh:mm A")}
                    </span>
                  </div>
                  <div style={{ display:"flex", gap:".6rem", alignItems:"center" }}>
                    <FaDollarSign style={{ color:"var(--success)", fontSize:".85rem", flexShrink:0 }} />
                    <span style={{ fontSize:".85rem", color:"var(--text-secondary)" }}>
                      ${apt.doctorInfo?.fees} consultation fee
                    </span>
                  </div>
                  {apt.document && (
                    <div style={{ display:"flex", gap:".6rem", alignItems:"center" }}>
                      <FaFileMedical style={{ color:"#f59e0b", fontSize:".85rem", flexShrink:0 }} />
                      <a href={`/uploads/${apt.document}`} target="_blank" rel="noreferrer"
                        style={{ fontSize:".85rem", color:"var(--primary)", textDecoration:"none" }}>
                        View Document
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserAppointments;
