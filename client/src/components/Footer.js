import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <div className="footer-brand">🌍 TourismConnect</div>
          <p className="footer-desc">
            Explore, Share &amp; Travel Together. The world is better when we explore it together.
          </p>
          <div className="footer-social">
            <div className="social-btn">🐦</div>
            <div className="social-btn">📸</div>
            <div className="social-btn">💼</div>
            <div className="social-btn">▶️</div>
          </div>
        </div>
        <div>
          <div className="footer-col-title">Explore</div>
          <Link to="/explore" className="footer-link">Destinations</Link>
          <Link to="/trips" className="footer-link">Group Trips</Link>
          <Link to="/feed" className="footer-link">Travel Feed</Link>
          <Link to="/connect" className="footer-link">Travelers</Link>
        </div>
        <div>
          <div className="footer-col-title">Community</div>
          <Link to="/trips" className="footer-link">Join a Trip</Link>
          <Link to="/create" className="footer-link">Create Post</Link>
          <Link to="/connect" className="footer-link">Connect</Link>
          <Link to="/explore" className="footer-link">Events</Link>
        </div>
        <div>
          <div className="footer-col-title">Company</div>
          <span className="footer-link">About Us</span>
          <span className="footer-link">Privacy Policy</span>
          <span className="footer-link">Terms</span>
          <span className="footer-link">Contact</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 TourismConnect. All rights reserved.</span>
        <span>Made with ❤️ for travelers</span>
      </div>
    </footer>
  );
}
