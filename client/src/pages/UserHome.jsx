import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome, FaCalendarAlt, FaUserMd, FaBell, FaSignOutAlt,
  FaHeartbeat, FaStethoscope, FaChevronRight
} from "react-icons/fa";
import axios from "axios";
import DoctorList from "../components/DoctorList";
import ApplyDoctor from "../components/ApplyDoctor";
import Notification from "../components/Notification";
import UserAppointments from "../components/UserAppointments";
import DoctorAppointments from "../components/DoctorAppointments";
import Footer from "../components/Footer";

const MENU = { HOME:"home", APPOINTMENTS:"appointments", APPLY_DOCTOR:"applyDoctor", NOTIFICATIONS:"notifications", DOCTOR_APPOINTMENTS:"doctorAppointments" };

function UserHome() {
  const navigate = useNavigate();
  const [doctors,    setDoctors]    = useState([]);
  const [userdata,   setUserdata]   = useState(null);
  const [activeMenu, setActiveMenu] = useState(MENU.HOME);

  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (stored) setUserdata(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/doctor/getalldoctors", { headers:{ Authorization:`Bearer ${token}` } });
        if (data.success) setDoctors(data.data);
      } catch (err) { console.error(err); }
    };
    fetchDoctors();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/");
  };

  const handleNotifUpdate = (u) => { setUserdata(u); localStorage.setItem("userData", JSON.stringify(u)); };

  const unreadCount = userdata?.notification?.length || 0;
  const initials    = userdata?.fullName ? userdata.fullName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "U";

  const menuItems = [
    { key:MENU.HOME,                icon:FaHome,         label:"Home" },
    { key:MENU.APPOINTMENTS,        icon:FaCalendarAlt,  label:"My Appointments" },
    ...(userdata?.isdoctor  ? [{ key:MENU.DOCTOR_APPOINTMENTS, icon:FaStethoscope, label:"Patient Requests" }] : []),
    ...(!userdata?.isdoctor ? [{ key:MENU.APPLY_DOCTOR,        icon:FaUserMd,      label:"Apply as Doctor"  }] : []),
    { key:MENU.NOTIFICATIONS, icon:FaBell, label:"Notifications", badge:unreadCount },
  ];

  return (
    <div className="dashboard-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <FaHeartbeat style={{ marginRight:6 }} />MediBook
        </div>
        <ul className="sidebar-menu">
          {menuItems.map(item => (
            <li key={item.key} className="sidebar-menu-item">
              <button id={`menu-${item.key}`}
                className={`sidebar-menu-link ${activeMenu===item.key?"active":""}`}
                onClick={() => setActiveMenu(item.key)}>
                <span className="menu-icon"><item.icon /></span>
                <span className="flex-grow-1">{item.label}</span>
                {item.badge > 0 && (
                  <span style={{ background:"var(--danger)", color:"#fff", fontSize:".62rem", fontWeight:700, padding:".1rem .4rem", borderRadius:50 }}>
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <div className="sidebar-logout">
          <button id="logout-btn" className="sidebar-menu-link" onClick={handleLogout} style={{ color:"#f87171" }}>
            <span className="menu-icon"><FaSignOutAlt /></span>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-header-title">
            {userdata?.isdoctor ? "Doctor Dashboard" : "Patient Dashboard"}
          </div>
          <div className="header-user-info">
            <button id="header-notifications" className="notification-bell"
              onClick={() => setActiveMenu(MENU.NOTIFICATIONS)} title="Notifications">
              <FaBell />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>
            <div className="user-avatar">{initials}</div>
            <div>
              <div style={{ fontWeight:600, fontSize:".9rem" }}>
                {userdata?.isdoctor ? "Dr. " : ""}{userdata?.fullName}
              </div>
              <div style={{ fontSize:".72rem", color:"var(--text-muted)" }}>{userdata?.email}</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">

          {activeMenu === MENU.HOME && (
            <div className="animate-fadeIn">
              <div className="section-header">
                <h2>Find a Doctor</h2>
                <p>Browse verified healthcare professionals and book your appointment.</p>
              </div>
              {doctors.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"><FaUserMd /></div>
                  <h5 style={{ color:"var(--text-secondary)" }}>No doctors available yet</h5>
                  <p>Approved doctors will appear here. Ask an admin to approve doctor applications.</p>
                </div>
              ) : (
                <div className="row g-4 stagger-children">
                  {doctors.map(doc => (
                    <div key={doc._id} className="col-md-6 col-lg-4 animate-fadeInUp">
                      <DoctorList doctor={doc} userDoctorId={userdata?._id} userdata={userdata} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeMenu === MENU.APPOINTMENTS        && <UserAppointments />}
          {activeMenu === MENU.DOCTOR_APPOINTMENTS && <DoctorAppointments userId={userdata?._id} />}
          {activeMenu === MENU.APPLY_DOCTOR        && <ApplyDoctor userId={userdata?._id} />}
          {activeMenu === MENU.NOTIFICATIONS       && <Notification onUpdate={handleNotifUpdate} />}
        </div>

        <Footer />
      </main>
    </div>
  );
}

export default UserHome;
