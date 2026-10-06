import React, { useState } from 'react';

export default function TripCard({ trip, onJoin }) {
  const [joined, setJoined] = useState(false);
  const [filled, setFilled] = useState(trip.filled);

  const handleJoin = () => {
    if (joined || filled >= trip.slots) return;
    setJoined(true);
    setFilled(p => p + 1);
    onJoin?.(trip);
  };

  const pct = Math.round((filled / trip.slots) * 100);

  return (
    <div className="trip-card" style={{ borderLeftColor: trip.color }}>
      <div className="trip-title">{trip.title}</div>
      <div className="trip-dest" style={{ color: trip.color }}>
        {trip.emoji} {trip.destination}
      </div>
      <div className="trip-info-row">
        <div className="trip-info">📅 <strong>{trip.dates}</strong></div>
        <div className="trip-info">💰 <strong>{trip.budget}</strong></div>
      </div>
      {/* Progress bar */}
      <div style={{ margin: '10px 0 6px', background: '#e8edf3', borderRadius: 8, height: 6 }}>
        <div style={{ width: `${pct}%`, background: trip.color, height: '100%', borderRadius: 8, transition: 'width .4s' }} />
      </div>
      <div className="trip-members">
        {trip.members.map((m, i) => (
          <div key={i} className="trip-member-dot" style={{ background: trip.color, zIndex: trip.members.length - i }}>{m}</div>
        ))}
        <span className="trip-members-count">{filled}/{trip.slots} joined</span>
      </div>
      <button
        className="trip-join-btn"
        style={{ background: joined ? '#6B7280' : trip.color }}
        onClick={handleJoin}
        disabled={joined || filled >= trip.slots}
      >
        {joined ? 'Joined ✓' : filled >= trip.slots ? 'Full' : 'Join This Trip'}
      </button>
    </div>
  );
}