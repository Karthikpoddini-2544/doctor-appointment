import React, { useEffect, useState } from "react";
import { FaBell, FaCheckDouble, FaTrash, FaInbox } from "react-icons/fa";
import axios from "axios";
import moment from "moment";

function Notification({ onUpdate }) {
  const [userdata,     setUserdata]     = useState(null);
  const [tab,          setTab]          = useState("unread");
  const [loading,      setLoading]      = useState(true);
  const [actionLoad,   setActionLoad]   = useState("");

  const fetchUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post("/api/user/getUserData", {}, { headers:{ Authorization:`Bearer ${token}` } });
      if (data.success) {
        setUserdata(data.data);
        if (onUpdate) onUpdate(data.data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUser(); }, []);

  const handleMarkAllRead = async () => {
    setActionLoad("read");
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post("/api/user/markallread", {}, { headers:{ Authorization:`Bearer ${token}` } });
      if (data.success) { fetchUser(); setTab("read"); }
    } catch (err) { console.error(err); } finally { setActionLoad(""); }
  };

  const handleDeleteRead = async () => {
    setActionLoad("delete");
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post("/api/user/deleteallnotifications", {}, { headers:{ Authorization:`Bearer ${token}` } });
      if (data.success) fetchUser();
    } catch (err) { console.error(err); } finally { setActionLoad(""); }
  };

  const unread = userdata?.notification      || [];
  const read   = userdata?.seennotification  || [];
  const list   = tab === "unread" ? unread : read;

  return (
    <div className="animate-fadeIn">
      <div className="section-header d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h2>Notifications</h2>
          <p>{unread.length} unread notification{unread.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="d-flex gap-2">
          {unread.length > 0 && (
            <button className="btn-medibook-primary" style={{ padding:".5rem 1rem", fontSize:".82rem", display:"flex", alignItems:"center", gap:4 }}
              onClick={handleMarkAllRead} disabled={actionLoad === "read"}>
              {actionLoad === "read" ? <span className="spinner-border spinner-border-sm" /> : <><FaCheckDouble />Mark All Read</>}
            </button>
          )}
          {read.length > 0 && (
            <button className="btn-medibook-danger" style={{ padding:".5rem 1rem", fontSize:".82rem", display:"flex", alignItems:"center", gap:4 }}
              onClick={handleDeleteRead} disabled={actionLoad === "delete"}>
              {actionLoad === "delete" ? <span className="spinner-border spinner-border-sm" /> : <><FaTrash />Clear Read</>}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4">
        {["unread","read"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              padding:".5rem 1.25rem", borderRadius:"var(--radius-md)",
              border:"1px solid", cursor:"pointer", fontSize:".85rem", fontWeight:600,
              background: tab===t ? "var(--primary)" : "transparent",
              borderColor: tab===t ? "var(--primary)" : "var(--border)",
              color: tab===t ? "#fff" : "var(--text-secondary)",
              transition:"all .25s",
              display:"flex", alignItems:"center", gap:6,
            }}>
            <FaBell />
            {t === "unread" ? `Unread (${unread.length})` : `Read (${read.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height:200 }}>
          <div className="spinner-border" style={{ color:"var(--primary)" }} />
        </div>
      ) : list.length === 0 ? (
        <div className="empty-state">
          <FaInbox style={{ fontSize:"2.5rem", marginBottom:".75rem", color:"var(--text-muted)" }} />
          <h5 style={{ color:"var(--text-secondary)" }}>
            {tab === "unread" ? "No unread notifications" : "No read notifications"}
          </h5>
          <p>{tab === "unread" ? "You're all caught up!" : "Mark notifications as read to see them here."}</p>
        </div>
      ) : (
        <div className="stagger-children">
          {list.map((notif, i) => (
            <div key={i} className={`notification-item animate-fadeInUp ${tab === "read" ? "read" : ""}`}>
              <div className="notification-dot" />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:".88rem", color:"var(--text-primary)", lineHeight:1.5 }}>{notif.message}</div>
                <div style={{ fontSize:".72rem", color:"var(--text-muted)", marginTop:".25rem" }}>
                  {notif.onClickPath && (
                    <span style={{ color:"var(--primary)", marginRight:"0.5rem" }}>
                      {notif.onClickPath}
                    </span>
                  )}
                  {moment(notif.createdAt || new Date()).fromNow()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;
