import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';

const PROFILE_POSTS = [
  { id: 1, user: 'Amee', initials: 'A', avatarColor: '#0b71d9', location: 'Manali, HP', content: 'A breathtaking Himalayan trek with snowy valleys and crisp mountain air.', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80', likes: 142, comments: 18, liked: false, saved: false, color: 'dc-1', caption: 'Memories from the Manali snow trek.' },
  { id: 2, user: 'Amee', initials: 'A', avatarColor: '#028090', location: 'Goa, India', content: 'Sunset beach walk and seafood by the shore.', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', likes: 98, comments: 12, liked: false, saved: false, color: 'dc-2', caption: 'Golden hour at the Goa coast.' },
  { id: 3, user: 'Amee', initials: 'A', avatarColor: '#9c2f25', location: 'Rajasthan', content: 'Desert nights under a canopy of stars.', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80', likes: 71, comments: 8, liked: false, saved: false, color: 'dc-5', caption: 'Thar Desert adventure with sand dunes and sunsets.' },
  { id: 4, user: 'Amee', initials: 'A', avatarColor: '#1c7c54', location: 'Uttarakhand', content: 'High-altitude trails and quiet temples.', img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80', likes: 203, comments: 24, liked: false, saved: false, color: 'dc-4', caption: 'Kedarnath trek memories.' },
];

const TABS = ['My Posts', 'My Trips', 'Saved', 'Settings'];

export default function ProfilePage({ setPage }) {
  const { user, isLoggedIn, login } = useAuth();
  const profileData = user || { name: 'Arjun Kumar', initials: 'AK', handle: '@arjun_travels', email: 'arjun@email.com', bio: '' };

  const [activeTab, setActiveTab] = useState('My Posts');
  const [shareMessage, setShareMessage] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [name, setName] = useState(profileData.name);
  const [username, setUsername] = useState(profileData.handle);
  const [email, setEmail] = useState(profileData.email || '');
  const [bio, setBio] = useState(profileData.bio || '');
  const [saveMessage, setSaveMessage] = useState('');

  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 2rem' }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🔐</div>
        <h3 style={{ fontSize: 22, marginBottom: 8 }}>Please log in to view your profile</h3>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
          <button className="nav-btn btn-outline" onClick={() => setPage?.('Login')}>Log In</button>
          <button className="nav-btn btn-primary" onClick={() => setPage?.('Register')}>Sign Up</button>
        </div>
      </div>
    );
  }

  const displayUser = profileData;

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name,
      handle: username,
      email,
      bio,
    };
    login(updatedUser);
    setSaveMessage('Changes saved successfully');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="page-anim">
      <div className="profile-header">
        <div className="profile-avatar">{displayUser.initials}</div>
        <div className="profile-name">{displayUser.name}</div>
        <div className="profile-handle">{displayUser.handle}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
          <button
            className="nav-btn profile-action-btn btn-outline"
            style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', fontSize: 12, padding: '7px 16px' }}
            onClick={() => setActiveTab('Settings')}
          >
            Edit Profile
          </button>
          <button
            className="nav-btn profile-action-btn profile-share-btn"
            onClick={async () => {
              const shareUrl = window.location.href;
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: `${displayUser.name}'s profile`,
                    text: `Check out ${displayUser.name}'s travel profile on TourismConnect.`,
                    url: shareUrl,
                  });
                  setShareMessage('Profile shared successfully');
                } catch (err) {
                  setShareMessage('Share was canceled or unavailable');
                }
              } else {
                try {
                  await navigator.clipboard.writeText(shareUrl);
                  setShareLink(shareUrl);
                  setShareMessage('Profile link copied to clipboard');
                } catch {
                  setShareLink(shareUrl);
                  setShareMessage('Copy the URL below to share your profile');
                }
              }
              setTimeout(() => setShareMessage(''), 3600);
            }}
          >
            Share Profile
          </button>
        </div>
        {(shareMessage || shareLink) && (
          <div style={{ textAlign: 'center', marginBottom: 12, color: '#0f172a', fontSize: 13 }}>
            {shareMessage}
            {shareLink && (
              <div style={{ marginTop: 8, padding: '10px 14px', borderRadius: 12, background: '#f8fafc', color: '#0f172a', wordBreak: 'break-all' }}>
                <strong>Share URL:</strong>
                <div style={{ marginTop: 6 }}>{shareLink}</div>
              </div>
            )}
          </div>
        )}
        <div className="profile-stats">
          {[['48','Posts'],['1.2K','Followers'],['386','Following'],['23','Places Visited']].map(([n,l]) => (
            <div key={l} className="profile-stat">
              <span className="profile-stat-num">{n}</span>
              <span className="profile-stat-label">{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`profile-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="profile-content">
        {activeTab === 'My Posts' && (
          <>
            <div style={{ display: 'grid', gap: 20 }}>
              {PROFILE_POSTS.map(p => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button className="nav-btn btn-primary" onClick={() => setPage?.('CreatePost')} style={{ padding: '11px 28px' }}>
                + Create New Post
              </button>
            </div>
          </>
        )}
        {activeTab === 'My Trips' && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
            <p>Your upcoming trips will appear here.</p>
            <button className="nav-btn btn-primary" onClick={() => setPage?.('Trips')} style={{ marginTop: 16 }}>Browse Trips</button>
          </div>
        )}
        {activeTab === 'Saved' && (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
            <p>Posts you've saved will appear here.</p>
            <button className="nav-btn btn-primary" onClick={() => setPage?.('Feed')} style={{ marginTop: 16 }}>Browse Feed</button>
          </div>
        )}
        {activeTab === 'Settings' && (
          <div style={{ maxWidth: 500 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Account Settings</h3>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-input" rows={3} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell travelers about yourself..." />
            </div>
            <button className="form-submit" style={{ marginTop: 8 }} onClick={handleSave}>Save Changes</button>
            {saveMessage && <div style={{ marginTop: 12, color: 'var(--teal)', fontWeight: 600 }}>{saveMessage}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
