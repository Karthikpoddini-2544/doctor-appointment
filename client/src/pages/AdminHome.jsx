import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartBar, FaUserMd, FaUsers, FaCalendarAlt, FaBell, FaSignOutAlt,
  FaHeartbeat, FaCheckCircle, FaTimesCircle, FaClock, FaUserCheck
} from "react-icons/fa";
import axios from "axios";
import AdminAppointments from "../components/AdminAppointments";
import Notification from "../components/Notification";
import Footer from "../components/Footer";

const MENU = { DASHBOARD:"dashboard", DOCTORS:"doctors", USERS:"users", APPOINTMENTS:"appointments", NOTIFICATIONS:"notifications" };

function AdminHome() {
  const navigate = useNavigate();
  const [userdata,       setUserdata]       = useState(null);
  const [activeMenu,     setActiveMenu]     = useState(MENU.DASHBOARD);
  const [doctors,        setDoctors]        = useState([]);
  const [users,          setUsers]          = useState([]);
  const [actionLoading,  setActionLoading]  = useState(null);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingUsers,   setLoadingUsers]   = useState(false);
  const [stats,          setStats]          = useState({ totalDoctors:0, pendingDoctors:0, approvedDoctors:0, totalUsers:0 });

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) setUserdata(JSON.parse(stored));
  }, []);

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/doctor/getalldoctorsforadmin", { headers:{ Authorization:`Bearer ${token}` } });
      if (data.success) {
        setDoctors(data.data);
        setStats(s => ({ ...s, totalDoctors:data.data.length, pendingDoctors:data.data.filter(d=>d.status==="pending").length, approvedDoctors:data.data.filter(d=>d.status==="approved").length }));
      }
    } catch (e) { console.error(e); } finally { setLoadingDoctors(false); }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/user/getallusers", { headers:{ Authorization:`Bearer ${token}` } });
      if (data.success) { setUsers(data.data); setStats(s => ({ ...s, totalUsers:data.data.length })); }
    } catch (e) { console.error(e); } finally { setLoadingUsers(false); }
  };

  useEffect(() => { fetchDoctors(); fetchUsers(); }, []);

  const handleDoctorAction = async (doctorId, action) => {
    setActionLoading(doctorId + action);
    try {
      const token    = localStorage.getItem("token");
      const endpoint = action === "approve" ? `/api/doctor/approvedoctor/${doctorId}` : `/api/doctor/rejectdoctor/${doctorId}`;
      const { data } = await axios.post(endpoint, {}, { headers:{ Authorization:`Bearer ${token}` } });
      if (data.success) fetchDoctors();
    } catch (e) { console.error(e); } finally { setActionLoading(null); }
  };

  const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("userData"); navigate("/"); };
  const handleNotifUpdate = (u) => { setUserdata(u); localStorage.setItem("userData", JSON.stringify(u)); };

  const unreadCount = userdata?.notification?.length || 0;
  const initials    = userdata?.fullName ? userdata.fullName.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() : "A";

  const getStatusBadge = (status) => {
    const cls = status === "approved" ? "badge-approved" : status === "rejected" ? "badge-rejected" : "badge-pending";
    return <span className={cls}>{status}</span>;
  };

  const menuItems = [
    { key:MENU.DASHBOARD,     icon:FaChartBar,    label:"Dashboard" },
    { key:MENU.DOCTORS,       icon:FaUserMd,      label:"Doctor Applications" },
    { key:MENU.USERS,         icon:FaUsers,       label:"All Users" },
    { key:MENU.APPOINTMENTS,  icon:FaCalendarAlt, label:"All Appointments" },
    { key:MENU.NOTIFICATIONS, icon:FaBell,        label:"Notifications", badge:unreadCount },
  ];

  const statCards = [
    { label:"Total Users",       value:stats.totalUsers,    icon:FaUsers,       color:"var(--primary)" },
    { label:"Total Doctors",     value:stats.totalDoctors,  icon:FaUserMd,      color:"var(--accent)" },
    { label:"Pending Approvals", value:stats.pendingDoctors, icon:FaClock,      color:"#f59e0b" },
    { label:"Approved Doctors",  value:stats.approvedDoctors,icon:FaUserCheck,  color:"var(--success)" },
  ];

  return (
    <div className="dashboard-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo"><FaHeartbeat style={{ marginRight:6 }} />MediBook Admin</div>
        <ul className="sidebar-menu">
          {menuItems.map(item => (
            <li key={item.key} className="sidebar-menu-item">
              <button id={`admin-menu-${item.key}`}
                className={`sidebar-menu-link ${activeMenu===item.key?"active":""}`}
                onClick={() => setActiveMenu(item.key)}>
                <span className="menu-icon"><item.icon /></span>
                <span className="flex-grow-1">{item.label}</span>
                {item.badge > 0 && (
                  <span style={{ background:"var(--danger)", color:"#fff", fontSize:".62rem", fontWeight:700, padding:".1rem .4rem", borderRadius:50 }}>{item.badge}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <div className="sidebar-logout">
          <button id="admin-logout" className="sidebar-menu-link" onClick={handleLogout} style={{ color:"#f87171" }}>
            <span className="menu-icon"><FaSignOutAlt /></span>Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header-title">Admin Control Panel</div>
          <div className="header-user-info">
            <button className="notification-bell" onClick={() => setActiveMenu(MENU.NOTIFICATIONS)}>
              <FaBell />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            <div className="user-avatar" style={{ background:"linear-gradient(135deg,#f59e0b,#d97706)" }}>{initials}</div>
            <div>
              <div style={{ fontWeight:600, fontSize:".9rem" }}>{userdata?.fullName}</div>
              <div style={{ fontSize:".72rem", color:"var(--text-muted)" }}>Administrator</div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">

          {/* ── DASHBOARD ── */}
          {activeMenu === MENU.DASHBOARD && (
            <div className="animate-fadeIn">
              <div className="section-header">
                <h2>Platform Overview</h2>
                <p>Monitor platform health and activity at a glance.</p>
              </div>
              {/* Stat cards */}
              <div className="row g-4 mb-5 stagger-children">
                {statCards.map(s => (
                  <div key={s.label} className="col-6 col-lg-3 animate-scaleIn">
                    <div style={{ background:"rgba(10,15,30,.8)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)", padding:"1.5rem", transition:"all .3s" }}>
                      <div style={{ width:46, height:46, background:`${s.color}20`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:".75rem", color:s.color, fontSize:"1.2rem" }}>
                        <s.icon />
                      </div>
                      <div style={{ fontSize:"2rem", fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</div>
                      <div style={{ color:"var(--text-muted)", fontSize:".82rem", marginTop:".25rem" }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pending applications */}
              <div className="section-header"><h3 style={{ fontSize:"1.25rem" }}>Pending Doctor Applications</h3></div>
              {doctors.filter(d => d.status==="pending").length === 0 ? (
                <div className="empty-state" style={{ padding:"2rem" }}>
                  <FaCheckCircle style={{ fontSize:"2.5rem", color:"var(--success)", marginBottom:".75rem" }} />
                  <h5 style={{ color:"var(--text-secondary)" }}>All caught up!</h5>
                  <p>No pending applications to review.</p>
                </div>
              ) : (
                <div className="row g-3 stagger-children">
                  {doctors.filter(d => d.status==="pending").map(doc => (
                    <div key={doc._id} className="col-md-6 col-lg-4 animate-fadeInUp">
                      <div style={{ background:"rgba(245,158,11,.05)", border:"1px solid rgba(245,158,11,.2)", borderRadius:"var(--radius-lg)", padding:"1.25rem" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:".75rem" }}>
                          <div style={{ width:40, height:40, background:"var(--gradient-btn)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700 }}>
                            {doc.fullName?.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight:700 }}>Dr. {doc.fullName}</div>
                            <div style={{ fontSize:".78rem", color:"var(--text-muted)" }}>{doc.specialisation} · {doc.experience} yrs</div>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <button id={`dash-approve-${doc._id}`} className="btn-medibook-success flex-fill"
                            onClick={() => handleDoctorAction(doc._id,"approve")} disabled={actionLoading===doc._id+"approve"}>
                            {actionLoading===doc._id+"approve" ? <span className="spinner-border spinner-border-sm" /> : <><FaCheckCircle style={{ marginRight:4 }} />Approve</>}
                          </button>
                          <button id={`dash-reject-${doc._id}`} className="btn-medibook-danger flex-fill"
                            onClick={() => handleDoctorAction(doc._id,"reject")} disabled={actionLoading===doc._id+"reject"}>
                            {actionLoading===doc._id+"reject" ? <span className="spinner-border spinner-border-sm" /> : <><FaTimesCircle style={{ marginRight:4 }} />Reject</>}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── DOCTORS ── */}
          {activeMenu === MENU.DOCTORS && (
            <div className="animate-fadeIn">
              <div className="section-header d-flex justify-content-between align-items-center">
                <div><h2>Doctor Applications</h2><p>Review and manage doctor registration requests.</p></div>
                <button className="btn-medibook-outline" style={{ padding:".5rem 1.25rem", fontSize:".85rem" }} onClick={fetchDoctors}>↻ Refresh</button>
              </div>
              {loadingDoctors ? (
                <div className="d-flex justify-content-center" style={{ height:200, alignItems:"center" }}>
                  <div className="spinner-border" style={{ color:"var(--primary)" }} />
                </div>
              ) : doctors.length === 0 ? (
                <div className="empty-state"><FaUserMd style={{ fontSize:"2.5rem", marginBottom:".75rem" }} /><h5>No applications yet</h5></div>
              ) : (
                <div style={{ overflowX:"auto" }}>
                  <table className="medibook-table">
                    <thead><tr><th>#</th><th>Doctor</th><th>Specialisation</th><th>Experience</th><th>Fees</th><th>Timings</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {doctors.map((doc, i) => (
                        <tr key={doc._id}>
                          <td style={{ color:"var(--text-muted)" }}>{i+1}</td>
                          <td>
                            <div style={{ display:"flex", alignItems:"center", gap:".6rem" }}>
                              <div style={{ width:34, height:34, background:"var(--gradient-btn)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:".8rem", flexShrink:0 }}>
                                {doc.fullName?.charAt(0)}
                              </div>
                              <div>
                                <div style={{ fontWeight:600 }}>Dr. {doc.fullName}</div>
                                <div style={{ fontSize:".72rem", color:"var(--text-muted)" }}>{doc.email}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ color:"var(--text-secondary)" }}>{doc.specialisation}</td>
                          <td style={{ color:"var(--text-secondary)" }}>{doc.experience} yrs</td>
                          <td style={{ color:"var(--text-secondary)" }}>${doc.fees}</td>
                          <td style={{ fontSize:".8rem", color:"var(--text-secondary)" }}>{Array.isArray(doc.timings)?doc.timings.join(" – "):doc.timings}</td>
                          <td>{getStatusBadge(doc.status)}</td>
                          <td>
                            {doc.status === "pending" ? (
                              <div className="d-flex gap-2">
                                <button id={`approve-doc-${doc._id}`} className="btn-medibook-success"
                                  onClick={() => handleDoctorAction(doc._id,"approve")} disabled={actionLoading===doc._id+"approve"}>
                                  {actionLoading===doc._id+"approve" ? <span className="spinner-border spinner-border-sm" /> : <FaCheckCircle />}
                                </button>
                                <button id={`reject-doc-${doc._id}`} className="btn-medibook-danger"
                                  onClick={() => handleDoctorAction(doc._id,"reject")} disabled={actionLoading===doc._id+"reject"}>
                                  {actionLoading===doc._id+"reject" ? <span className="spinner-border spinner-border-sm" /> : <FaTimesCircle />}
                                </button>
                              </div>
                            ) : <span style={{ color:"var(--text-muted)" }}>—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── USERS ── */}
          {activeMenu === MENU.USERS && (
            <div className="animate-fadeIn">
              <div className="section-header d-flex justify-content-between align-items-center">
                <div><h2>All Users</h2><p>View all registered users on the platform.</p></div>
                <button className="btn-medibook-outline" style={{ padding:".5rem 1.25rem", fontSize:".85rem" }} onClick={fetchUsers}>↻ Refresh</button>
              </div>
              {loadingUsers ? (
                <div className="d-flex justify-content-center" style={{ height:200, alignItems:"center" }}>
                  <div className="spinner-border" style={{ color:"var(--primary)" }} />
                </div>
              ) : (
                <div style={{ overflowX:"auto" }}>
                  <table className="medibook-table">
                    <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Is Doctor</th><th>Joined</th></tr></thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr key={u._id}>
                          <td style={{ color:"var(--text-muted)" }}>{i+1}</td>
                          <td>
                            <div style={{ display:"flex", alignItems:"center", gap:".6rem" }}>
                              <div style={{ width:32, height:32, background:"var(--gradient-btn)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:".78rem", flexShrink:0 }}>
                                {u.fullName?.charAt(0)}
                              </div>
                              <span style={{ fontWeight:600 }}>{u.fullName}</span>
                            </div>
                          </td>
                          <td style={{ color:"var(--text-secondary)" }}>{u.email}</td>
                          <td style={{ color:"var(--text-secondary)" }}>{u.phone||"—"}</td>
                          <td>
                            <span style={{ background:u.type==="admin"?"rgba(245,158,11,.15)":"rgba(14,165,233,.12)", color:u.type==="admin"?"#f59e0b":"var(--primary)", border:`1px solid ${u.type==="admin"?"rgba(245,158,11,.3)":"rgba(14,165,233,.25)"}`, padding:".2rem .65rem", borderRadius:50, fontSize:".72rem", fontWeight:600, textTransform:"uppercase", letterSpacing:".3px" }}>
                              {u.type}
                            </span>
                          </td>
                          <td>{u.isdoctor ? <span className="badge-approved">Yes</span> : <span style={{ color:"var(--text-muted)", fontSize:".85rem" }}>No</span>}</td>
                          <td style={{ color:"var(--text-muted)", fontSize:".8rem" }}>
                            {new Date(u.createdAt).toLocaleDateString("en-US",{ year:"numeric", month:"short", day:"numeric" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeMenu === MENU.APPOINTMENTS  && <AdminAppointments />}
          {activeMenu === MENU.NOTIFICATIONS && <Notification onUpdate={handleNotifUpdate} />}
        </div>

        <Footer />
      </main>
    </div>
  );
}

export default AdminHome;
