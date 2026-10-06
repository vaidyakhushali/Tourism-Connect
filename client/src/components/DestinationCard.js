import React from 'react';

export default function DestinationCard({ dest, onClick }) {
  return (
    <div className="dest-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="dest-img" style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        <img
          src={dest.image}
          alt={dest.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="dest-overlay" />
        {dest.badge && <div className="dest-badge">{dest.badge}</div>}
      </div>
      <div className="dest-body">
        <div className="dest-name">{dest.name}</div>
        <div className="dest-country">📍 {dest.country}</div>
        <div className="dest-meta">
          <div className="dest-rating">★ {dest.rating} ({dest.reviews?.toLocaleString()})</div>
          <div className="dest-trips">{dest.category}</div>
        </div>
      </div>
    </div>
  );
}