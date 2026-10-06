// AdminPage.js — Admin Modal + Admin Dashboard

import { useState, useEffect } from "react";
import { getAdminStats } from "../hooks/useApi";

export function AdminModal({ onClose, onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    if (user === "admin" && pass === "admin123") {
      onLogin();
      onClose();
    } else {
      setErr("Invalid credentials. Try admin / admin123");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>🔐 Admin Login</h2>
        <p>Access the TourismConnect admin dashboard</p>
        {err && <div className="modal-error">{err}</div>}
        <label className="modal-label">Username</label>
        <input
          className="modal-input"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="admin"
        />
        <label className="modal-label">Password</label>
        <input
          className="modal-input"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="••••••••"
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <div className="modal-actions">
          <button className="modal-btn modal-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn modal-btn-submit" onClick={submit}>
            Login
          </button>
        </div>
        <p style={{ fontSize: 12, color: "#999", marginTop: 12, textAlign: "center" }}>
          Hint: admin / admin123
        </p>
      </div>
    </div>
  );
}

export function AdminDashboard({ onLogout }) {
  const [stats, setStats] = useState({ users: 0, destinations: 0, trips: 0, posts: 0 });

  useEffect(() => {
    getAdminStats()
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => console.error("Error loading admin stats:", err));
  }, []);

  const statItems = [
    { icon: "👤", value: stats.users.toLocaleString(), label: "Total Travelers" },
    { icon: "🌍", value: stats.destinations.toLocaleString(), label: "Destinations" },
    { icon: "✈️", value: stats.trips.toLocaleString(), label: "Group Trips" },
    { icon: "📸", value: stats.posts.toLocaleString(), label: "Posts in Feed" },
  ];

  return (
    <div>
      <div className="admin-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="admin-bar-title">🛡️ Admin Dashboard</span>
          <span className="admin-badge">Super Admin</span>
        </div>
        <button className="admin-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
      <div className="admin-stats">
        {statItems.map((s) => (
          <div className="admin-stat-card" key={s.label}>
            <div className="admin-stat-icon">{s.icon}</div>
            <div className="admin-stat-value">{s.value}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: "24px 32px", background: "#f9f0ff" }}>
        <p style={{ color: "#6b21a8", fontWeight: 600, fontSize: 15 }}>
          ✅ You are logged in as Admin. Full site management is active.
        </p>
      </div>
    </div>
  );
}