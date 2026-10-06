import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ChatPage() {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const [conversations, setConversations] = useState([]);
  const [travellers, setTravellers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const fetchConversations = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/messages/conversations', { headers: { Authorization: 'Bearer ' + token } });
      const data = await res.json();
      setConversations(data || []);
    } catch (err) {
      setConversations([]);
    }
  };

  const fetchTravellers = async () => {
    try {
      const res = await fetch('/api/travelers');
      const data = await res.json();
      setTravellers(data || []);
    } catch (err) {
      setTravellers([]);
    }
  };

  const fetchMessages = async (userId) => {
    if (!userId || !token) return;
    try {
      const res = await fetch(`/api/messages/${userId}`, { headers: { Authorization: 'Bearer ' + token } });
      const data = await res.json();
      setMessages(data || []);
    } catch (err) {
      setMessages([]);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchConversations();
    fetchTravellers();
  }, [token]);

  useEffect(() => {
    if (!selected || !token) return;
    fetchMessages(selected._id);
  }, [selected, token]);

  const send = async () => {
    if (!text.trim() || !selected) return;
    setError('');
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ receiverId: selected._id, text: text.trim() })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Unable to send message');
      }
      setText('');
      await fetchMessages(selected._id);
      await fetchConversations();
    } catch (err) {
      setError(err.message);
    }
  };

  const selectTraveller = (traveller) => {
    setSelected(traveller);
  };

  return (
    <div className="chat-page">
      <h2>Chat</h2>
      {!user && <div>Please log in to chat with travellers.</div>}
      {user && (
        <div className="chat-grid">
          <div className="chat-list">
            <h4>Recent chats</h4>
            {conversations.length === 0 && <div>No conversations yet.</div>}
            {conversations.map(c => (
              <div key={c._id} className={`chat-item${selected && selected._id === c._id ? ' active' : ''}`} onClick={() => selectTraveller(c)}>
                <div className="chat-item-name">{c.name || c.initials || 'Traveler'}</div>
                <div className="chat-item-last">{c.lastMessage?.text || 'No messages yet'}</div>
              </div>
            ))}

            <h4 style={{ marginTop: 24 }}>Start a new chat</h4>
            {travellers.length === 0 && <div>No travellers available.</div>}
            {travellers.map(t => (
              <div key={t.id} className={`chat-item${selected && selected._id === t.id ? ' active' : ''}`} onClick={() => selectTraveller({ _id: t.id, name: t.name, initials: t.name?.slice(0, 2) })}>
                <div className="chat-item-name">{t.name}</div>
                <div className="chat-item-last">{t.country}</div>
              </div>
            ))}
          </div>

          <div className="chat-window">
            {selected ? (
              <>
                <h4>Chat with {selected.name || selected.initials}</h4>
                <div className="messages">
                  {messages.length === 0 && <div>No messages yet. Say hello!</div>}
                  {messages.map(m => (
                    <div key={m._id} className={`msg ${m.senderId && String(m.senderId._id) === String(user.id) ? 'mine' : ''}`}>
                      <div className="msg-text">{m.text}</div>
                      <div className="msg-time">{new Date(m.createdAt).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                {error && <div className="chat-error">{error}</div>}
                <div className="chat-input">
                  <input value={text} onChange={e => setText(e.target.value)} placeholder="Write a message..." />
                  <button onClick={send}>Send</button>
                </div>
              </>
            ) : (
              <div>Select a traveler or previous chat to start messaging.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
