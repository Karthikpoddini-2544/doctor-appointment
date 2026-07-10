import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaDollarSign, FaFileMedical, FaSync, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import moment from "moment";

function DoctorAppointments() {
  const [appointments,  setAppointments]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error,         setError]         = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/doctor/getdoctorappointments", { headers:{ Authorization:`Bearer ${token}` } });
      if (data.success) setAppointments(data.data);
      else setError("Failed to fetch appointments.");
    } catch (err) { setError("Error loading appointments."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleAction = async (appointmentId, action) => {
    setActionLoading(appointmentId + action);
    try {
      const token    = localStorage.getItem("token");
      const endpoint = action === "approve" ? `/api/doctor/approveappointment/${appointmentId}` : `/api/doctor/rejectappointment/${appointmentId}`;
      const { data } = await axios.post(endpoint, {}, { headers:{ Authorization:`Bearer ${token}` } });
      if (data.success) fetchAppointments();
    } catch (err) { console.error(err); } finally { setActionLoading(null); }
  };

  const getStatusBadge = (status) => {
    const cls = status === "approved" ? "badge-approved" : status === "rejected" ? "badge-rejected" : "badge-pending";
    return <span className={cls}>{status}</span>;
  };

  return (
    <div className="animate-fadeIn">
      <div className="section-header d-flex justify-content-between align-items-center">
        <div>
          <h2>Patient Appointments</h2>
          <p>Review and manage appointment requests from patients.</p>
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
          <FaCalendarAlt style={{ fontSize:"2.5rem", marginBottom:".75rem" }} />
          <h5 style={{ color:"var(--text-secondary)" }}>No appointments yet</h5>
          <p>Appointment requests from patients will appear here.</p>
        </div>
      ) : (
        <div style={{ overflowX:"auto" }}>
          <table className="medibook-table">
            <thead>
              <tr><th>#</th><th>Patient</th><th>Date</th><th>Time</th><th>Document</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {appointments.map((apt, i) => (
                <tr key={apt._id}>
                  <td style={{ color:"var(--text-muted)" }}>{i+1}</td>
                  <td>
                    <div style={{ fontWeight:600 }}>{apt.userInfo?.fullName}</div>
                    <div style={{ fontSize:".72rem", color:"var(--text-muted)" }}>{apt.userInfo?.email}</div>
                  </td>
                  <td>
                    <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:".85rem", color:"var(--text-secondary)" }}>
                      <FaCalendarAlt style={{ color:"var(--primary)", flexShrink:0 }} />
                      {moment(apt.date).format("MMM DD, YYYY")}
                    </div>
                  </td>
                  <td>
                    <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:".85rem", color:"var(--text-secondary)" }}>
                      <FaClock style={{ color:"var(--accent)", flexShrink:0 }} />
                      {moment(apt.date).format("hh:mm A")}
                    </div>
                  </td>
                  <td>
                    {apt.document
                      ? <a href={`/uploads/${apt.document}`} target="_blank" rel="noreferrer" style={{ color:"var(--primary)", fontSize:".85rem", display:"flex", alignItems:"center", gap:4 }}><FaFileMedical />View</a>
                      : <span style={{ color:"var(--text-muted)", fontSize:".85rem" }}>None</span>}
                  </td>
                  <td>{getStatusBadge(apt.status)}</td>
                  <td>
                    {apt.status === "pending" ? (
                      <div className="d-flex gap-2">
                        <button id={`approve-apt-${apt._id}`} className="btn-medibook-success"
                          onClick={() => handleAction(apt._id,"approve")} disabled={actionLoading===apt._id+"approve"}
                          style={{ display:"flex", alignItems:"center", gap:4 }}>
                          {actionLoading===apt._id+"approve" ? <span className="spinner-border spinner-border-sm" /> : <><FaCheckCircle />Approve</>}
                        </button>
                        <button id={`reject-apt-${apt._id}`} className="btn-medibook-danger"
                          onClick={() => handleAction(apt._id,"reject")} disabled={actionLoading===apt._id+"reject"}
                          style={{ display:"flex", alignItems:"center", gap:4 }}>
                          {actionLoading===apt._id+"reject" ? <span className="spinner-border spinner-border-sm" /> : <><FaTimesCircle />Reject</>}
                        </button>
                      </div>
                    ) : <span style={{ color:"var(--text-muted)", fontSize:".85rem" }}>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DoctorAppointments;
