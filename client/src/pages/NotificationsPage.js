// NotificationsPage.js

const SAMPLE_NOTIFICATIONS = [
  { id: 1, icon: "❤️", text: "Emma Rodriguez liked your post", time: "2 min ago" },
  { id: 2, icon: "💬", text: "James Chen commented on your Bali story", time: "1 hr ago" },
  { id: 3, icon: "👤", text: "Priya Sharma started following you", time: "3 hrs ago" },
  { id: 4, icon: "✈️", text: "New trip available: Northern Lights Hunt — 3 spots left", time: "1 day ago" },
];

export default function NotificationsPage() {
  return (
    <>
      <div className="page-header">
        <h1>🔔 Notifications</h1>
        <p>Stay up to date with your travel community</p>
      </div>
      <div className="section" style={{ maxWidth: 700 }}>
        {SAMPLE_NOTIFICATIONS.map((n) => (
          <div
            key={n.id}
            style={{
              background: "white",
              borderRadius: "var(--radius-sm)",
              padding: "18px 24px",
              marginBottom: 12,
              boxShadow: "var(--shadow)",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span style={{ fontSize: 28 }}>{n.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#333", fontSize: 15 }}>{n.text}</p>
              <p style={{ color: "var(--gray)", fontSize: 12, marginTop: 4 }}>{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}