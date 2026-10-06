
import { useState, useEffect } from "react";
import { POSTS, TRAVELERS, TRENDING_DEST } from "../data/data";
import PostCard from '../components/PostCard';
import { getPosts } from '../hooks/useApi';

/* ═══════════════════════════════════════════════════════════
   FEED PAGE
═══════════════════════════════════════════════════════════ */
export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followed, setFollowed] = useState({});

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await getPosts();
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to load posts', err);
        setPosts(POSTS);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <>
      {/* Hero */}
      <div style={{ position:"relative", background:"linear-gradient(135deg,#0b1e42,#0077a8)", padding:"60px 40px", textAlign:"center", color:"#fff", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"url('https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1200&q=50') center/cover", opacity:.14 }} />
        <div style={{ position:"relative", maxWidth:520, margin:"0 auto" }}>
          <div style={{ fontSize:44, marginBottom:12 }}>📸</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(32px,5vw,50px)", marginBottom:10 }}>Travel Feed</h1>
          <p style={{ opacity:.76, fontSize:15, marginBottom:24 }}>Stories, photos and experiences from fellow travelers around the globe</p>
          <button style={{ padding:"11px 26px", borderRadius:10, background:"rgba(255,255,255,.15)", backdropFilter:"blur(6px)", border:"1.5px solid rgba(255,255,255,.3)", color:"#fff", fontSize:14, fontWeight:600, cursor:"pointer" }}>
            + Share Your Story
          </button>
        </div>
      </div>

      <div className="feed-layout">
        {/* Posts column */}
        <div>
          {/* Stories */}
          <div className="story-bar">
            <div className="story-item">
              <div className="story-add">＋</div>
              <div className="story-name">Your Story</div>
            </div>
            {TRAVELERS.map(t => (
              <div className="story-item" key={t.id}>
                <div className="story-ring"><img src={t.avatar} alt={t.name} /></div>
                <div className="story-name">{t.name.split(" ")[0]}</div>
              </div>
            ))}
          </div>

          {/* Post cards */}
          {loading ? (
            <div style={{ padding: 24, textAlign: 'center' }}>Loading posts...</div>
          ) : (
            (posts.length ? posts : POSTS).map(p => (
              <PostCard key={p.id} post={p} />
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="feed-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-title">Suggested Travelers <span className="sidebar-see">See All</span></div>
            {TRAVELERS.slice(0, 4).map(t => (
              <div className="mini-traveler" key={t.id}>
                <img className="mini-avatar" src={t.avatar} alt={t.name} />
                <div>
                  <div className="mini-name">{t.name}</div>
                  <div className="mini-country">🌍 {t.country} · {t.trips} trips</div>
                </div>
                <button className="mini-follow">Follow</button>
              </div>
            ))}
          </div>
          <div className="sidebar-card">
            <div className="sidebar-title">Trending Destinations <span className="sidebar-see">See All</span></div>
            {TRENDING_DEST.map(d => (
              <div className="trending-item" key={d.id}>
                <img className="trending-img" src={d.img} alt={d.name} />
                <div>
                  <div className="trending-name">{d.name}</div>
                  <div className="trending-tag">#{d.cat} · ★ {d.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

