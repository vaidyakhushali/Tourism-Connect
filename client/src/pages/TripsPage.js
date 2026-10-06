
import { useState } from "react";
import { TRIPS_DATA } from "../data/data";
import TripModal from "../components/TripModal";

/* ═══════════════════════════════════════════════════════════
   TRIPS PAGE
═══════════════════════════════════════════════════════════ */
export function TripsPage() {
  const [selected, setSelected] = useState(null);
  const [filter,   setFilter]   = useState("All");
  const levels   = ["All", "Easy", "Moderate", "Hard"];
  const filtered = filter === "All" ? TRIPS_DATA : TRIPS_DATA.filter(t => t.level === filter);

  return (
    <>
      {selected && <TripModal trip={selected} onClose={() => setSelected(null)} />}

      {/* Hero */}
      <div className="trips-hero">
        <div className="trips-hero-inner">
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:"rgba(255,255,255,.15)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,.25)", borderRadius:"100px", padding:"7px 18px", fontSize:13, fontWeight:500, marginBottom:18 }}>
            🌍 {TRIPS_DATA.length} Adventures Available
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif" }}>Group <em style={{ fontStyle:"italic", color:"#caf0f8" }}>Trips</em></h1>
          <p>Join planned adventures or create your own. Click any trip to see photos, itinerary and details.</p>
          <div className="trips-hero-stats">
            {[["6","Active Trips"],["47","Open Spots"],["6","Countries"]].map(([v,l]) => (
              <div className="ths" key={l}><strong>{v}</strong><span>{l}</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="trips-body">
        <div className="trips-toolbar">
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif" }}>Upcoming Adventures</h2>
            <p style={{ color:"var(--gray)", fontSize:13, marginTop:3 }}>Click any card to explore photos &amp; full details</p>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
            <div className="level-pills">
              {levels.map(l => (
                <button key={l} className={`level-pill${filter === l ? " on" : ""}`} onClick={() => setFilter(l)}>{l}</button>
              ))}
            </div>
            <button className="plan-btn">+ Plan a Trip</button>
          </div>
        </div>

        <div className="trips-grid">
          {filtered.map(t => (
            <div className="tcard" key={t.id} onClick={() => setSelected(t)}>
              <div className="tcard-img-wrap">
                <img className="tcard-img" src={t.img} alt={t.title} />
                <span className={`tcard-level lv-${t.level}`}>{t.level}</span>
                <div className="tcard-org">
                  <img src={t.avatar} alt={t.organizer} />
                  <span>{t.organizer}</span>
                </div>
                <div className="tcard-photos">📸 {t.gallery.length}</div>
              </div>
              <div className="tcard-body">
                <div className="tcard-title">{t.title}</div>
                <div className="tcard-dest">📍 {t.dest}</div>
                <div className="tcard-desc">{t.desc}</div>
                <div className="tcard-prog-wrap">
                  <div className="tcard-prog" style={{ width:`${Math.round(((t.total-t.spots)/t.total)*100)}%` }} />
                </div>
                <div className="tcard-row">
                  <span>📅 {t.date}</span>
                  <span className="tcard-spots">🟢 {t.spots}/{t.total} spots</span>
                </div>
                <div className="tcard-foot">
                  <div className="tcard-price">{t.price}<small>/person</small></div>
                  <button className="tcard-btn" onClick={e => { e.stopPropagation(); setSelected(t); }}>View →</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 0", color:"var(--gray)" }}>
            <div style={{ fontSize:44, marginBottom:10 }}>🔍</div>
            <p>No trips found for this level. Try another filter.</p>
          </div>
        )}
      </div>

      {/* Why join */}
      <div className="why-join">
        <div className="why-join-inner">
          <span className="sec-label">Why Travel in a Group?</span>
          <h2 className="sec-title">Better <em>Together</em></h2>
          <div className="why-cards">
            {[
              { icon:"💰", title:"Save More",        desc:"Split costs for accommodation, transport, and guides — group travel saves up to 40% vs. going solo." },
              { icon:"🤝", title:"New Connections",  desc:"Meet like-minded travelers from around the world who share your passion for adventure." },
              { icon:"🛡️", title:"Travel Safely",   desc:"Experienced organizers handle logistics, permits, and safety — so you focus on the experience." },
            ].map(({ icon, title, desc }) => (
              <div className="why-card" key={title}>
                <div className="why-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

