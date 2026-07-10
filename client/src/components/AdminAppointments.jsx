import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaSync, FaUserMd, FaCheckCircle, FaTimesCircle, FaFileMedical } from "react-icons/fa";
import axios from "axios";
import moment from "moment";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/appointment/getallappointments", { headers:{ Authorization:`Bearer ${token}` } });
      if (data.success) setAppointments(data.data);
      else setError("Failed to fetch appointments.");
    } catch (err) { setError("Error loading appointments."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const getStatusBadge = (status) => {
    const cls = status === "approved" ? "badge-approved" : status === "rejected" ? "badge-rejected" : "badge-pending";
    return <span className={cls}>{status}</span>;
  };

  return (
    <div className="animate-fadeIn">
      <div className="section-header d-flex justify-content-between align-items-center">
        <div>
          <h2><FaCalendarAlt style={{ marginRight:8, color:"var(--primary)" }} />All Appointments</h2>
          <p>Overview of all platform appointments.</p>
        </div>
        <button className="btn-medibook-outline" style={{ padding:".5rem 1.25rem", fontSize:".85rem", display:"flex", alignItems:"center", gap:".4rem" }} onClick={fetchAppointments}>
          <FaSync />Refresh
        </button>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height:200 }}>
          <div className="spinner-border" style={{ color:"var(--primary)" }} role="status" />
        </div>
      ) : error ? (
        <div style={{ background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.3)", borderRadius:"var(--radius-md)", padding:"1rem", color:"#fca5a5" }}>{error}</div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <FaCalendarAlt style={{ fontSize:"2.5rem", marginBottom:".75rem", color:"var(--text-muted)" }} />
          <h5 style={{ color:"var(--text-secondary)" }}>No appointments yet</h5>
          <p>Appointments will appear here once users start booking.</p>
        </div>
      ) : (
        <div style={{ overflowX:"auto" }}>
          <table className="medibook-table">
            <thead>
              <tr>
                <th>#</th><th>Patient</th><th>Doctor</th><th>Specialisation</th>
                <th>Date</th><th>Time</th><th>Document</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt, i) => (
                <tr key={apt._id}>
                  <td style={{ color:"var(--text-muted)" }}>{i+1}</td>
                  <td>
                    <div style={{ fontWeight:600 }}>{apt.userInfo?.fullName}</div>
                    <div style={{ fontSize:".73rem", color:"var(--text-muted)" }}>{apt.userInfo?.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight:600 }}>Dr. {apt.doctorInfo?.fullName}</div>
                  </td>
                  <td style={{ color:"var(--text-secondary)" }}>{apt.doctorInfo?.specialisation}</td>
                  <td style={{ color:"var(--text-secondary)", fontSize:".85rem" }}>
                    {moment(apt.date).format("MMM DD, YYYY")}
                  </td>
                  <td style={{ color:"var(--text-secondary)", fontSize:".85rem" }}>
                    {moment(apt.date).format("hh:mm A")}
                  </td>
                  <td>
                    {apt.document
                      ? <a href={`/uploads/${apt.document}`} target="_blank" rel="noreferrer" style={{ color:"var(--primary)", fontSize:".85rem", display:"flex", alignItems:"center", gap:4 }}><FaFileMedical />View</a>
                      : <span style={{ color:"var(--text-muted)", fontSize:".85rem" }}>None</span>}
                  </td>
                  <td>{getStatusBadge(apt.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminAppointments;
