import { useEffect, useState } from "react";

export default function WishlistPage({ setPage }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(saved);
  }, []);

  const remove = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  return (
    <>
      <div className="page-header">
        <h1>❤️ My Wishlist</h1>
        <p>{wishlist.length > 0 ? `${wishlist.length} destination${wishlist.length > 1 ? "s" : ""} saved` : "Places you want to visit someday"}</p>
      </div>

      {wishlist.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 2rem", color: "var(--gray)" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🌍</div>
          <h3 style={{ fontSize: 22, marginBottom: 8, color: "#1a1a2e" }}>Your wishlist is empty</h3>
          <p style={{ marginBottom: 28, color: "#888" }}>Explore destinations and click ♡ Save to add them here</p>
          <button className="card-btn card-btn-primary" style={{ padding: "12px 32px" }} onClick={() => setPage?.("Explore")}>
            Explore Destinations
          </button>
        </div>
      ) : (
        <div className="section">
          <div className="grid-3">
            {wishlist.map((d) => (
              <div className="card" key={d.id}>
                <img className="card-img" src={d.image} alt={d.name} />
                <div className="card-body">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span className="card-badge">{d.category}</span>
                    <span className="card-rating">★ {d.rating}</span>
                  </div>
                  <div className="card-title">{d.name}</div>
                  <div className="card-desc">{d.description}</div>
                  <div className="card-tags">
                    {d.tags?.map((t) => <span key={t} className="card-tag">{t}</span>)}
                  </div>
                  <div className="card-meta" style={{ marginTop: 12 }}>
                    <span>💰 {d.budget}</span>
                    <span>🌍 {d.country}</span>
                  </div>
                  <div className="card-actions">
                    <button className="card-btn card-btn-primary" onClick={() => setPage?.("Trips")}>
                      Plan Trip
                    </button>
                    <button
                      className="card-btn card-btn-secondary"
                      style={{ color: "#dc2626", borderColor: "#dc2626" }}
                      onClick={() => remove(d.id)}
                    >
                      🗑 Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
