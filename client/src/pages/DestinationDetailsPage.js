import { useEffect, useState } from "react";

import { DESTINATIONS } from "../data/data";

export default function DestinationDetailsPage({ id, setPage }) {
  const [destination, setDestination] = useState(null);
  const [activeImg, setActiveImg] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const found = DESTINATIONS.find((d) => String(d.id) === String(id));
    setDestination(found || null);
    if (found) setActiveImg(found.image);
    // check wishlist
    const wl = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setSaved(wl.some((d) => String(d.id) === String(id)));
  }, [id]);

  const toggleSave = () => {
    const wl = JSON.parse(localStorage.getItem("wishlist") || "[]");
    let updated;
    if (saved) {
      updated = wl.filter((d) => String(d.id) !== String(id));
    } else {
      updated = [...wl, destination];
    }
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setSaved(!saved);
  };

  if (!destination) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <div style={{ fontSize: 48 }}>🔍</div>
        <h2>Destination not found</h2>
        <button className="card-btn card-btn-primary" onClick={() => setPage?.('Explore')}>
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 60px" }}>
      {/* Back */}
      <button
        onClick={() => setPage?.('Explore')}
        style={{ background: "none", border: "none", cursor: "pointer", color: "#0077B6", fontWeight: 600, fontSize: 14, padding: "20px 0", display: "flex", alignItems: "center", gap: 6 }}
      >
        ← Back
      </button>

      {/* Hero */}
      <div style={{ borderRadius: 20, overflow: "hidden", position: "relative", marginBottom: 28 }}>
        <img src={activeImg || destination.image} alt={destination.name} style={{ width: "100%", height: 360, objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
        <div style={{ position: "absolute", bottom: 28, left: 28, color: "#fff" }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0 }}>{destination.name}</h1>
          <div style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>
            🌍 {destination.country} &nbsp;•&nbsp; ★ {destination.rating} ({destination.reviews.toLocaleString()} reviews)
          </div>
        </div>
        <button
          onClick={toggleSave}
          style={{
            position: "absolute", top: 20, right: 20,
            background: saved ? "#fef3c7" : "rgba(255,255,255,0.9)",
            border: saved ? "1.5px solid #f59e0b" : "1.5px solid #ddd",
            color: saved ? "#b45309" : "#555",
            borderRadius: 40, padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}
        >
          {saved ? "⭐ Saved" : "♡ Save"}
        </button>
      </div>

      {/* Gallery */}
      {destination.gallery?.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>📸 Photo Gallery</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {destination.gallery.map((img, i) => (
              <img
                key={i} src={img} alt="" onClick={() => setActiveImg(img)}
                style={{
                  width: "100%", height: 130, objectFit: "cover", borderRadius: 12, cursor: "pointer",
                  border: activeImg === img ? "3px solid #0077B6" : "3px solid transparent",
                  transition: "transform .2s",
                }}
                onMouseEnter={(e) => e.target.style.transform = "scale(1.03)"}
                onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
              />
            ))}
          </div>
        </div>
      )}

      {/* About */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>About</h2>
        <p style={{ color: "#555", lineHeight: 1.8, fontSize: 15 }}>{destination.description}</p>
      </div>

      {/* Info cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 }}>
        {[
          { icon: "💰", label: "Cost", val: destination.price },
          { icon: "📅", label: "Best Time", val: destination.bestTime },
          { icon: "⏳", label: "Duration", val: destination.duration },
        ].map((info) => (
          <div key={info.label} style={{ background: "#f8fafc", borderRadius: 14, padding: "18px 16px", border: "1px solid #e8edf3" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{info.icon}</div>
            <div style={{ fontSize: 11, color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{info.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", marginTop: 4 }}>{info.val}</div>
          </div>
        ))}
      </div>

      {/* Highlights */}
      {destination.highlights?.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>✨ Highlights</h2>
          <div style={{ display: "grid", gap: 8 }}>
            {destination.highlights.map((h, i) => (
              <div key={i} style={{ display: "flex", gap: 12, background: "#f0f9ff", borderRadius: 10, padding: "12px 16px", border: "1px solid #bae6fd", fontSize: 14, color: "#1a1a2e" }}>
                <span style={{ color: "#0077B6", fontWeight: 800 }}>→</span> {h}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hotels */}
      {destination.hotels?.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>🏨 Recommended Hotels</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {destination.hotels.map((h, i) => (
              <div key={i} style={{ background: "#fff7ed", borderRadius: 10, padding: "12px 16px", border: "1px solid #fed7aa", fontSize: 13, color: "#1a1a2e" }}>
                🏩 {h}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Itinerary */}
      {destination.itinerary?.length > 0 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>🗓️ Day-wise Itinerary</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {destination.itinerary.map((day, i) => (
              <div key={i} style={{ display: "flex", gap: 14, background: "#f8fafc", borderRadius: 12, padding: "14px 18px", border: "1px solid #e8edf3" }}>
                <div style={{ background: "#0077B6", color: "#fff", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: 14, color: "#444", lineHeight: 1.6 }}>{day.replace(/^Day \d+ — /, "")}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
