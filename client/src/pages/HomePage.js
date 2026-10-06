import React, { useState } from 'react';
import DestinationCard from '../components/DestinationCard';
import TripCard from '../components/TripCard';
import { DESTINATIONS, GROUP_TRIPS, TESTIMONIALS, POSTS } from '../data/data';

const CATEGORIES = [
  { icon: '🏖️', label: 'Beach', bg: 'linear-gradient(135deg,#0096C7,#48CAE4)' },
  { icon: '🏔️', label: 'Mountain', bg: 'linear-gradient(135deg,#023E8A,#0077B6)' },
  { icon: '🏙️', label: 'City', bg: 'linear-gradient(135deg,#1a1a2e,#16213e)' },
  { icon: '🏛️', label: 'Historical', bg: 'linear-gradient(135deg,#9B2226,#E76F51)' },
  { icon: '🌿', label: 'Nature', bg: 'linear-gradient(135deg,#2D6A4F,#52B788)' },
  { icon: '🧗', label: 'Adventure', bg: 'linear-gradient(135deg,#7B2D8B,#C77DFF)' },
];

export default function HomePage({ setPage }) {
  const [likedPosts, setLikedPosts] = useState({ 1: true });
  const [likeCounts, setLikeCounts] = useState({ 1: 284, 2: 512, 3: 391 });

  const toggleLike = (id, base) => {
    setLikedPosts(p => ({ ...p, [id]: !p[id] }));
    setLikeCounts(p => ({ ...p, [id]: p[id] !== undefined ? (likedPosts[id] ? p[id] - 1 : p[id] + 1) : base }));
  };

  return (
    <div>
      <section className="hero">
        <div className="hero-badge">✈️ Explore the world together</div>
        <h1 className="hero-title">
          Discover your next <em>Adventure</em>
        </h1>
        <p className="hero-sub">
          Connect with travelers worldwide, share unforgettable journeys, and plan your dream trip together.
        </p>
        <div className="hero-search">
          <input type="text" placeholder="Where do you want to go?" />
          <button className="btn btn-primary" onClick={() => setPage?.('Explore')}>🔍 Explore</button>
        </div>
        <div className="hero-stats">
          {[['12K+','Travelers'],['480+','Destinations'],['3.2K+','Group Trips'],['98%','Happy Travelers']].map(([n,l]) => (
            <div key={l} className="hero-stat">
              <strong>{n}</strong>
              <span>{l}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-label">Browse by category</div>
        <h2 className="section-title">Find your travel style</h2>
        <div className="pill-row">
          {CATEGORIES.map(c => (
            <div
              key={c.label}
              className="pill"
              onClick={() => setPage?.('Explore')}
              style={{ background: c.bg, color: '#fff', borderColor: 'transparent' }}
            >
              <span>{c.icon}</span> {c.label}
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: 'var(--cream)' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="section-label">Featured destinations</div>
          <h2 className="section-title">Popular right now</h2>
          <p className="section-sub">Handpicked destinations loved by our community.</p>
        </div>
        <div className="grid-4">
          {DESTINATIONS.slice(0, 4).map(d => (
            <DestinationCard key={d.id} dest={d} onClick={() => setPage?.('Explore')} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button className="btn btn-primary" onClick={() => setPage?.('Explore')}>View all destinations →</button>
        </div>
      </section>

      <section className="section">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="section-label">Travel feed</div>
          <h2 className="section-title">Stories from the community</h2>
        </div>
        <div className="grid-3">
          {POSTS.slice(0, 3).map(p => (
            <div key={p.id} className="post">
              <div className="post-header">
                <img className="post-avatar" src={p.avatar} alt={p.author} />
                <div>
                  <div className="post-author">{p.author}</div>
                  <div className="post-meta">📍 {p.location}</div>
                </div>
              </div>
              <img className="post-img" src={p.img} alt={p.author} />
              <div className="post-content">{p.content}</div>
              <div className="post-tags">
                {p.tags.map((tag, idx) => <span key={idx} className="post-tag">{tag}</span>)}
              </div>
              <div className="post-actions">
                <button onClick={() => toggleLike(p.id, p.likes)} className="post-action" style={{ color: likedPosts[p.id] ? 'var(--red)' : undefined }}>
                  {likedPosts[p.id] ? '❤️' : '🤍'} {likeCounts[p.id]}
                </button>
                <button className="post-action">💬 {p.comments}</button>
                <button className="post-action" style={{ marginLeft: 'auto' }}>🔖</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button className="btn btn-primary" onClick={() => setPage?.('Feed')}>View full feed →</button>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--cream)' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="section-label">Group trips</div>
          <h2 className="section-title">Upcoming adventures</h2>
        </div>
        <div className="grid-3">
          {GROUP_TRIPS.slice(0, 3).map(t => (
            <TripCard key={t.id} trip={t} onJoin={() => setPage?.('Trips')} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button className="btn btn-primary" onClick={() => setPage?.('Trips')}>Browse all trips →</button>
        </div>
      </section>

      <section className="section">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="section-label">Testimonials</div>
          <h2 className="section-title">What travelers say</h2>
        </div>
        <div className="testimonial-grid">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="testimonial">
              <div className="testimonial-text">{t.text}</div>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{ background: t.color, color: '#fff', fontWeight: 700 }}>{t.initials}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-loc">{t.place}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="connect-banner">
        <h2>Ready to start your journey?</h2>
        <p>Join 12,000+ travelers already exploring the world together.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 26 }}>
          <button className="btn btn-outline" onClick={() => setPage?.('Register')}>Get started free →</button>
          <button className="btn btn-primary" onClick={() => setPage?.('Explore')}>Explore destinations</button>
        </div>
      </section>
    </div>
  );
}
