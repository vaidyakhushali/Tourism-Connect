import { useState, useEffect } from "react";
import { CATEGORIES, COUNTRIES, BUDGETS, DESTINATIONS } from "../data/data";

function saveToWishlist(dest) {
  const current = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const already = current.find((d) => d.id === dest.id);
  if (already) return false; // already saved
  localStorage.setItem("wishlist", JSON.stringify([...current, dest]));
  return true;
}

export default function ExplorePage() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("All Countries");
  const [budget, setBudget] = useState("All Budgets");
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [toast, setToast] = useState("");
  const [activeGalleryImg, setActiveGalleryImg] = useState(null);

  useEffect(() => {
    setDestinations(DESTINATIONS);
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setSavedIds(saved.map((d) => d.id));
  }, []);

  const handleSave = (e, dest) => {
    e.stopPropagation();
    const added = saveToWishlist(dest);
    if (added) {
      setSavedIds((prev) => [...prev, dest.id]);
      showToast(`✅ ${dest.name} added to wishlist!`);
    } else {
      showToast(`⭐ Already in your wishlist`);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const filtered = destinations.filter((d) => {
    const matchSearch =
      (d.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (d.description || "").toLowerCase().includes(search.toLowerCase());
    const matchCountry = country === "All Countries" || d.country === country;
    const matchBudget = budget === "All Budgets" || d.budget === budget;
    const matchCat = cat === "All" || d.category === cat;
    return matchSearch && matchCountry && matchBudget && matchCat;
  });

  return (
    <>
      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: "#1a1a2e", color: "#fff", padding: "12px 24px",
          borderRadius: 40, fontSize: 14, fontWeight: 600, zIndex: 9999,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)", whiteSpace: "nowrap",
          animation: "fadeInUp .25s ease",
        }}>
          {toast}
        </div>
      )}

      <div className="page-header">
        <h1>🗺️ Explore Destinations</h1>
        <p>Discover incredible places around the world</p>
      </div>

      <div className="section">
        {/* ── Filters ── */}
        <div className="explore-filters">
          <input
            className="filter-input"
            placeholder="🔍 Search destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="filter-select" value={country} onChange={(e) => setCountry(e.target.value)}>
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={budget} onChange={(e) => setBudget(e.target.value)}>
            {BUDGETS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>

        <div className="pill-row">
          {CATEGORIES.map((c) => (
            <button key={c} className={`pill${cat === c ? " active" : ""}`} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "var(--gray)" }}>
            <div style={{ fontSize: 48 }}>🔍</div>
            <p>No destinations found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map((d) => (
              <div className="card" key={d.id}>
                <img className="card-img" src={d.image} alt={d.name} style={{ cursor: "pointer" }} onClick={() => { setSelected(d); setActiveGalleryImg(null); }} />
                <div className="card-body">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span className="card-badge">{d.category}</span>
                    <span className="card-rating">★ {d.rating} ({d.reviews.toLocaleString()})</span>
                  </div>
                  <div className="card-title">{d.name}</div>
                  <div className="card-desc">{d.description}</div>
                  <div className="card-tags">
                    {d.tags.map((t) => <span key={t} className="card-tag">{t}</span>)}
                  </div>
                  <div className="card-meta" style={{ marginTop: 12 }}>
                    <span>💰 {d.budget}</span>
                    <span>🌍 {d.country}</span>
                  </div>
                  <div className="card-actions">
                    <button className="card-btn card-btn-primary" onClick={() => { setSelected(d); setActiveGalleryImg(null); }}>
                      Explore
                    </button>
                    <button
                      className="card-btn card-btn-secondary"
                      onClick={(e) => handleSave(e, d)}
                      style={savedIds.includes(d.id) ? { background: "#fef3c7", borderColor: "#f59e0b", color: "#b45309" } : {}}
                    >
                      {savedIds.includes(d.id) ? "⭐ Saved" : "♡ Save"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selected && (
        <div className="trip-modal-overlay" onClick={() => setSelected(null)}>
          <div
            className="trip-modal"
            style={{ maxWidth: 780, maxHeight: "90vh", overflowY: "auto", padding: 0, borderRadius: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hero image */}
            <div style={{ position: "relative" }}>
              <img
                src={activeGalleryImg || selected.image}
                alt={selected.name}
                style={{ width: "100%", height: 280, objectFit: "cover", borderRadius: "20px 20px 0 0", display: "block" }}
              />
              <div style={{
                position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
                borderRadius: "20px 20px 0 0",
              }} />
              <div style={{ position: "absolute", bottom: 20, left: 24, color: "#fff" }}>
                <div style={{ fontSize: 26, fontWeight: 800 }}>{selected.name}</div>
                <div style={{ fontSize: 14, opacity: 0.85 }}>🌍 {selected.country} &nbsp;•&nbsp; ★ {selected.rating} ({selected.reviews.toLocaleString()} reviews)</div>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.5)",
                  color: "#fff", border: "none", borderRadius: "50%", width: 36, height: 36,
                  fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "24px 28px 32px" }}>
              {/* Tags & Save */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {selected.tags.map((t) => <span key={t} className="card-tag">{t}</span>)}
                </div>
                <button
                  className="card-btn card-btn-secondary"
                  style={savedIds.includes(selected.id) ? { background: "#fef3c7", borderColor: "#f59e0b", color: "#b45309" } : {}}
                  onClick={(e) => handleSave(e, selected)}
                >
                  {savedIds.includes(selected.id) ? "⭐ Saved to Wishlist" : "♡ Save to Wishlist"}
                </button>
              </div>

              {/* Description */}
              <p style={{ color: "#444", lineHeight: 1.7, marginBottom: 24 }}>{selected.description}</p>

              {/* Trip Info */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
                {[
                  { icon: "💰", label: "Cost", val: selected.price },
                  { icon: "📅", label: "Best Time", val: selected.bestTime },
                  { icon: "⏳", label: "Duration", val: selected.duration },
                ].map((info) => (
                  <div key={info.label} style={{
                    background: "#f8fafc", borderRadius: 12, padding: "14px 16px",
                    border: "1px solid #e8edf3",
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{info.icon}</div>
                    <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{info.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", marginTop: 2 }}>{info.val}</div>
                  </div>
                ))}
              </div>

              {/* Gallery */}
              {selected.gallery?.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "#1a1a2e" }}>📸 Photo Gallery</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {selected.gallery.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        onClick={() => setActiveGalleryImg(img)}
                        style={{
                          width: "100%", height: 110, objectFit: "cover", borderRadius: 10,
                          cursor: "pointer", transition: "transform .2s, box-shadow .2s",
                          border: activeGalleryImg === img ? "3px solid #0077B6" : "3px solid transparent",
                        }}
                        onMouseEnter={(e) => { e.target.style.transform = "scale(1.03)"; e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)"; }}
                        onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "none"; }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {selected.highlights?.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "#1a1a2e" }}>✨ Highlights</h3>
                  <ul style={{ paddingLeft: 0, listStyle: "none", display: "grid", gap: 8 }}>
                    {selected.highlights.map((h, i) => (
                      <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "#444", alignItems: "flex-start" }}>
                        <span style={{ color: "#0077B6", fontWeight: 700, flexShrink: 0 }}>→</span> {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Hotels */}
              {selected.hotels?.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "#1a1a2e" }}>🏨 Recommended Hotels</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                    {selected.hotels.map((h, i) => (
                      <div key={i} style={{
                        background: "#f0f9ff", borderRadius: 10, padding: "10px 14px",
                        fontSize: 13, color: "#1a1a2e", border: "1px solid #bae6fd",
                      }}>
                        🏩 {h}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              {selected.itinerary?.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "#1a1a2e" }}>🗓️ Day-wise Itinerary</h3>
                  <div style={{ display: "grid", gap: 8 }}>
                    {selected.itinerary.map((day, i) => (
                      <div key={i} style={{
                        display: "flex", gap: 12, background: "#f8fafc",
                        borderRadius: 10, padding: "12px 16px", border: "1px solid #e8edf3",
                      }}>
                        <div style={{
                          background: "#0077B6", color: "#fff", borderRadius: "50%",
                          width: 26, height: 26, display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0,
                        }}>
                          {i + 1}
                        </div>
                        <div style={{ fontSize: 13, color: "#444", lineHeight: 1.5 }}>{day.replace(/^Day \d+ — /, "")}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
