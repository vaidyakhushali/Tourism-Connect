import React, { useState } from 'react';


const TAGS = ['🏔️ Mountain', '🌿 Nature', '🧗 Adventure', '🏛️ Historical', '🏖️ Beach', '🏙️ City'];

export default function CreatePostPage({ setPage }) {

  const [form, setForm] = useState({
    destination: '', country: 'India', city: '', story: '', budget: '', date: '',
  });
  const [activeTags, setActiveTags] = useState(['🌿 Nature']);
  const [preview, setPreview] = useState(null);

  const set = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const toggleTag = tag =>
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const handleFile = e => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    // In a real app, POST to /api/posts
    alert('Post published successfully! 🚀');
    setPage?.('Feed');
  };

  return (
    <div className="page-anim">
      <div className="page-hero">
        <h1 className="page-hero-title">✍️ Create Travel Post</h1>
        <p className="page-hero-sub">Share your travel story with the community</p>
      </div>

      <div className="create-wrap">
        <div className="create-card">
          {/* Upload */}
          <label htmlFor="photo-upload">
            <div className="upload-zone">
              {preview
                ? <img src={preview} alt="preview" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }} />
                : <>
                  <div className="upload-icon">📸</div>
                  <div className="upload-text">
                    <strong>Click to upload photos</strong> or drag &amp; drop<br />
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>Up to 10 images • PNG, JPG up to 10MB each</span>
                  </div>
                </>
              }
            </div>
          </label>
          <input id="photo-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />

          <div className="form-group">
            <label className="form-label">Destination Name</label>
            <input className="form-input" placeholder="e.g. Manali, Himachal Pradesh" value={form.destination} onChange={set('destination')} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Country</label>
              <input className="form-input" placeholder="India" value={form.country} onChange={set('country')} />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-input" placeholder="Manali" value={form.city} onChange={set('city')} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Your Travel Story</label>
            <textarea
              className="form-input"
              rows={4}
              placeholder="Share your experience, tips, highlights..."
              value={form.story}
              onChange={set('story')}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Budget (₹)</label>
              <input className="form-input" placeholder="12,000" value={form.budget} onChange={set('budget')} />
            </div>
            <div className="form-group">
              <label className="form-label">Travel Date</label>
              <input className="form-input" type="date" value={form.date} onChange={set('date')} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category Tags</label>
            <div className="explore-filters" style={{ justifyContent: 'flex-start', margin: '8px 0 0' }}>
              {TAGS.map(tag => (
                <button
                  key={tag}
                  className={`filter-chip ${activeTags.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleTag(tag)}
                  type="button"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button className="form-submit" onClick={handleSubmit}>
            Publish Travel Post 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
