
import { useState, useRef, useEffect } from "react";
import { TRAVELERS } from "../data/data";

/* ═══════════════════════════════════════════════════════════
   CONNECT PAGE
═══════════════════════════════════════════════════════════════════ */
export function ConnectPage() {
  const [followed, setFollowed] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [messageDraft, setMessageDraft] = useState('');
  const [chatHistory, setChatHistory] = useState(() => {
    return TRAVELERS.reduce((acc, traveler) => {
      acc[traveler.id] = [
        {
          id: `${traveler.id}-welcome`,
          type: 'received',
          text: `Hi! I would love to plan a trip together.`,
          time: 'Just now'
        }
      ];
      return acc;
    }, {});
  });
  const bottomRef = useRef(null);

  const toggle = id => {
    setFollowed(prev => {
      const next = { ...prev, [id]: !prev[id] };
      if (!next[id] && activeChat?.id === id) {
        setActiveChat(null);
      }
      return next;
    });
  };

  const openChat = traveler => {
    if (!followed[traveler.id]) return;
    setActiveChat(traveler);
  };

  const sendMessage = () => {
    const text = messageDraft.trim();
    if (!text || !activeChat) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatHistory(prev => ({
      ...prev,
      [activeChat.id]: [
        ...prev[activeChat.id],
        { id: Date.now(), type: 'sent', text, time: now }
      ]
    }));
    setMessageDraft('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, activeChat]);

  return (
    <>
      {/* Hero */}
      <div className="connect-hero">
        <div className="connect-hero-inner">
          <div style={{ fontSize: 48, marginBottom: 12 }}>🤝</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif" }}>Traveler <em style={{ fontStyle: "italic", color: "#caf0f8" }}>Connections</em></h1>
          <p>Connect with people who've been where you've been — or where you're going next</p>
          <div className="connect-search">
            <input placeholder="Search travelers, countries..." />
            <button>Search</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="connect-stats-bar">
        <div className="connect-stats-inner">
          {[["12,000+", "Travelers"], ["80+", "Countries"], ["3,200+", "Trips Planned"], ["98%", "Happy"]].map(([v, l]) => (
            <div className="cstat" key={l}><strong>{v}</strong><span>{l}</span></div>
          ))}
        </div>
      </div>

      {/* Traveler cards */}
      <div className="connect-body">
        <div className="connect-sec-hdr">
          <span className="c-label">Suggested for You</span>
          <h2 style={{ fontFamily: "'Playfair Display',serif" }}>Meet Fellow <em style={{ fontStyle: "italic", color: "var(--teal)" }}>Travelers</em></h2>
          <p style={{ color: "var(--gray)", fontSize: 14, marginTop: 4 }}>Based on shared destinations and travel styles</p>
        </div>

        <div className="traveler-grid">
          {TRAVELERS.map(t => (
            <div className="trav-card" key={t.id}>
              <div className="trav-cover">
                <img src={t.cover} alt="" />
                <div className="trav-cover-dim" />
              </div>
              <div className="trav-body">
                <img className="trav-avatar" src={t.avatar} alt={t.name} />
                <div className="trav-name">{t.name}</div>
                <div className="trav-country">🌍 {t.country}</div>
                <div className="trav-bio">{t.bio}</div>
                <div className="trav-stats">
                  <div className="trav-stat"><strong>{t.trips}</strong><span>Trips</span></div>
                  <div className="trav-stat"><strong>{t.followers.toLocaleString()}</strong><span>Followers</span></div>
                </div>
                <div className="vchips">
                  {t.visited.map(v => <span key={v} className="vchip">{v}</span>)}
                </div>
                <button className={`follow-btn ${followed[t.id] ? "f1" : "f0"}`} onClick={() => toggle(t.id)}>
                  {followed[t.id] ? "✓ Following" : "+ Follow"}
                </button>
                {followed[t.id] && (
                  <button className="message-btn" onClick={() => openChat(t)}>
                    Message
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {activeChat && (
          <div className="chat-panel">
            <div className="chat-panel-header">
              <div>
                <div className="chat-panel-title">Chat with {activeChat.name}</div>
                <div className="chat-panel-subtitle">Your direct messages are ready</div>
              </div>
              <button className="chat-panel-close" onClick={() => setActiveChat(null)}>Close</button>
            </div>
            <div className="chat-panel-body">
              {chatHistory[activeChat.id]?.map(msg => (
                <div key={msg.id} className={`panel-msg ${msg.type}`}>
                  <div className="panel-msg-bubble">{msg.text}</div>
                  <div className="panel-msg-time">{msg.time}</div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="chat-panel-input">
              <input
                value={messageDraft}
                onChange={e => setMessageDraft(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder={`Send ${activeChat.name} a message...`}
              />
              <button className="chat-send-btn" onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="how-section" style={{ margin: "0 -28px -40px", padding: "52px 28px" }}>
          <div className="how-inner">
            <span className="sec-label">How it Works</span>
            <h2 className="sec-title">Start <em>Connecting</em></h2>
            <div className="how-cards">
              {[
                { step: "01", icon: "👤", title: "Create Your Profile", desc: "Tell the community where you've been and where you dream of going next." },
                { step: "02", icon: "🔍", title: "Discover Travelers", desc: "Browse profiles from 80+ countries. Filter by destination, style, or language." },
                { step: "03", icon: "✈️", title: "Plan Together", desc: "Message travelers, join group trips, and co-create unforgettable adventures." },
              ].map(({ step, icon, title, desc }) => (
                <div className="how-card" key={step}>
                  <div className="how-num">{step}</div>
                  <div className="how-icon">{icon}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
