import React, { useState, useEffect } from 'react';
import { likePost } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

export default function PostCard({ post }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.liked || false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [saved, setSaved] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const author = post.user || post.author || 'Anonymous';
  const imageUrl = post.img || post.image;
  const captionHtml = post.caption || post.content || '';

  const handleLike = async () => {
    try { await likePost(post.id); } catch (_) { }
    setLiked(prev => !prev);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (_) {
      setComments([]);
    }
  };

  useEffect(() => {
    if (commentsOpen) fetchComments();
  }, [commentsOpen, post.id]);

  const addComment = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in to comment');
    const trimmed = newComment.trim();
    if (!trimmed) return;

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ postId: post.id, text: trimmed })
      });
      if (!res.ok) {
        const error = await res.json();
        return alert(error.message || 'Unable to post comment');
      }
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error(err);
      alert('Failed to post comment. Please try again.');
    }
  };

  const deleteComment = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (!user?.isAdmin) return alert('Admin only');
    try {
      await fetch(`/api/comments/${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } });
      fetchComments();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-avatar" style={{ background: post.avatarColor }}>
          {post.initials}
        </div>
        <div>
          <div className="post-user">{author}</div>
          <div className="post-location">📍 {post.location}</div>
        </div>
      </div>

      <div className={`post-image ${post.color || ''}`}>
        {imageUrl ? (
          <img className="post-img" src={imageUrl} alt={author} />
        ) : (
          post.emoji
        )}
      </div>

      <div className="post-actions">
        <button
          className={`post-action-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          ❤️ {likes}
        </button>
        <button className="post-action-btn" onClick={() => setCommentsOpen(true)}>💬 {post.comments}</button>
        <button className="post-action-btn">🔗 Share</button>
        <button
          className="post-action-btn"
          style={{ marginLeft: 'auto', color: saved ? 'var(--ocean)' : undefined }}
          onClick={() => setSaved(p => !p)}
        >
          🔖
        </button>
      </div>

      <div
        className="post-caption"
        dangerouslySetInnerHTML={{ __html: captionHtml }}
      />

      {commentsOpen && (
        <div className="comments-modal">
          <div className="comments-card">
            <div className="comments-header">
              <h4>Comments</h4>
              <button onClick={() => setCommentsOpen(false)}>Close</button>
            </div>
            <div className="comments-list">
              {comments.length === 0 && <div>No comments yet.</div>}
              {comments.map(c => (
                <div key={c._id} className="comment-item">
                  <div className="comment-meta">
                    <strong>{c.userId?.name || 'User'}</strong>
                    <span className="comment-time">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="comment-text">{c.text}</div>
                  {user?.isAdmin && (
                    <button className="btn btn-danger" onClick={() => deleteComment(c._id)}>Delete</button>
                  )}
                </div>
              ))}
            </div>
            <div className="comments-input">
              <input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Write a comment..." />
              <button onClick={addComment}>Post</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
