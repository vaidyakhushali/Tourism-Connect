import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════
   LIGHTBOX
═══════════════════════════════════════════════════════════ */
function Lightbox({ images, start, onClose }) {
  const [idx, setIdx] = useState(start);
  useEffect(() => {
    const h = e => {
      if (e.key === "ArrowLeft") setIdx(i => (i - 1 + images.length) % images.length);
      else if (e.key === "ArrowRight") setIdx(i => (i + 1) % images.length);
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  return (
    <div className="lb-overlay" onClick={onClose}>
      <button className="lb-close" onClick={onClose}>✕</button>
      <button className="lb-nav lb-prev" onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }}>‹</button>
      <div onClick={e => e.stopPropagation()}>
        <img className="lb-img" src={images[idx].url || images[idx]} alt={images[idx].cap || ""} />
      </div>
      <button className="lb-nav lb-next" onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }}>›</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TRIP MODAL
═══════════════════════════════════════════════════════════ */
function TripModal({ trip, onClose }) {
  const [lbIdx, setLbIdx] = useState(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const h = e => { if (e.key === "Escape" && lbIdx === null) onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lbIdx, onClose]);

  const fill = Math.round(((trip.total - trip.spots) / trip.total) * 100);
  const handleJoin = () => setJoined(true);
  return (
    <>
      {lbIdx !== null && <Lightbox images={trip.gallery} start={lbIdx} onClose={() => setLbIdx(null)} />}
      <div className="tmodal-overlay" onClick={onClose}>
        <div className="tmodal" onClick={e => e.stopPropagation()}>
          <button className="tmodal-close" onClick={onClose}>✕</button>
          <div className="tmodal-hero">
            <img src={trip.gallery[0].url} alt={trip.title} />
            <div className="tmodal-hero-ov">
              <div className="tmodal-hero-title">{trip.title}</div>
              <div className="tmodal-pills">
                <span className="tmodal-pill">📍 {trip.dest}</span>
                <span className="tmodal-pill">📅 {trip.date}</span>
                <span className={`tmodal-pill lv-${trip.level}`}>{trip.level}</span>
                <span className="tmodal-pill">🟢 {trip.spots} spots left</span>
                <span className="tmodal-pill">👤 {trip.organizer}</span>
              </div>
            </div>
          </div>
          <div className="tmodal-body">
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--gray)", marginBottom: 6 }}>
                <span>Spots filled</span>
                <span style={{ fontWeight: 700, color: "var(--navy)" }}>{trip.total - trip.spots}/{trip.total}</span>
              </div>
              <div className="progress-bar-wrap"><div className="progress-bar" style={{ width: `${fill}%` }} /></div>
            </div>
            <p className="tmodal-desc">{trip.desc}</p>
            <div className="gallery-title">📸 Trip Gallery</div>
            <div className="gallery-grid">
              {trip.gallery.map((img, i) => (
                <div className="gthumb" key={i} onClick={() => setLbIdx(i)}>
                  <img src={img.url} alt={img.cap} />
                  <div className="gthumb-ov">🔍</div>
                </div>
              ))}
            </div>
            <div className="detail-grid">
              <div className="detail-box">
                <h4>🗺️ Itinerary</h4>
                {trip.itinerary.map((it, i) => (
                  <div className="detail-item" key={i}><span className="detail-icon">→</span><span>{it}</span></div>
                ))}
              </div>
              <div className="detail-box">
                <h4>✅ Included</h4>
                {trip.includes.map((it, i) => (
                  <div className="detail-item" key={i}><span className="detail-icon">✓</span><span>{it}</span></div>
                ))}
                <div className="price-box">
                  <div className="price-big">{trip.price}</div>
                  <div className="price-lbl">per person · {trip.spots} spots left</div>
                </div>
              </div>
            </div>
          </div>
          {joined && (
            <div className="tmodal-note" style={{ marginBottom: 16, padding: 14, borderRadius: 12, background: "rgba(56, 189, 248, 0.12)", color: "#0369a1", fontWeight: 600 }}>
              ✅ You joined this trip! Review the itinerary and gallery above.
            </div>
          )}
          <div className="tmodal-cta">
            <button className="btn btn-out" onClick={onClose}>← Back</button>
            <button
              className="btn btn-pri"
              style={{ flex: 2 }}
              onClick={handleJoin}
              disabled={joined || trip.spots <= 0}
            >
              {joined ? 'Joined ✓' : `✈️ Join This Trip — ${trip.price}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TripModal;
