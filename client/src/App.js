// App.js — Root entry point for TourismConnect

import { useState } from "react";
import "./styles/global.css";
import { useAuth } from "./context/AuthContext";

// Pages
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import { FeedPage } from "./pages/FeedPage";
import { TripsPage } from "./pages/TripsPage";
import { ConnectPage } from "./pages/ConnectPage";
import WishlistPage from "./pages/WishlistPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import ChatPage from "./pages/ChatPage";
import CreatePostPage from "./pages/CreatePostPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Admin
import { AdminModal, AdminDashboard } from "./pages/AdminPage";

// ─── NAV ─────────────────────────────────────────────────────────────────────

function Nav({ page, setPage, onAdminClick, isAdmin, isLoggedIn, user, logout }) {
  const links = ["Home", "Explore", "Feed", "Trips", "Connect", "Chat", "Wishlist"];
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setPage("Home")} style={{ cursor: "pointer" }}>🌐 Tourism<span>Connect</span></div>
      <div className="nav-links">
        {links.map((l) => (
          <button
            key={l}
            className={`nav-link${page === l ? " active" : ""}`}
            onClick={() => setPage(l)}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="nav-actions">
        {isLoggedIn ? (
          <>
            <span
              className="nav-user-badge"
              onClick={() => setPage("Profile")}
              style={{
                background: "var(--teal)",
                color: "white",
                width: 38,
                height: 38,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              {user?.initials || "U"}
            </span>
            <button className="btn btn-outline" onClick={logout}>Log Out</button>
          </>
        ) : (
          <>
            <button className="btn btn-outline" onClick={() => setPage("Login")}>Log In</button>
            <button className="btn btn-primary" onClick={() => setPage("Register")}>Sign Up</button>
          </>
        )}
        {isAdmin ? (
          <button className="btn btn-admin">🛡️ Admin</button>
        ) : (
          <button className="btn btn-admin" onClick={onAdminClick}>🔐 Admin</button>
        )}
      </div>
    </nav>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">🌐 Tourism<span>Connect</span></div>
          <div className="footer-desc">
            Explore, Share &amp; Travel Together. The world is better when we explore it together.
          </div>
          <div className="footer-socials">
            {["𝕏", "f", "in", "📷"].map((s, i) => (
              <div key={i} className="footer-social">{s}</div>
            ))}
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          {["Destinations", "Group Trips", "Travel Feed", "Travelers"].map((l) => (
            <span
              key={l}
              className="footer-link"
              onClick={() =>
                setPage(
                  l === "Travel Feed"
                    ? "Feed"
                    : l === "Travelers"
                    ? "Connect"
                    : l === "Group Trips"
                    ? "Trips"
                    : "Explore"
                )
              }
            >
              {l}
            </span>
          ))}
        </div>
        <div>
          <h4>Community</h4>
          {["Join a Trip", "Create Post", "Connect", "Events"].map((l) => (
            <span key={l} className="footer-link">{l}</span>
          ))}
        </div>
        <div>
          <h4>Company</h4>
          {["About Us", "Privacy Policy", "Terms", "Contact"].map((l) => (
            <span key={l} className="footer-link">{l}</span>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 TourismConnect. All rights reserved.</span>
        <span>Made with ❤️ for travelers</span>
      </div>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("Home");
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, logout, isLoggedIn } = useAuth();

  const pages = {
    Home: <HomePage setPage={setPage} />,
   Explore: <ExplorePage setPage={setPage} />,
    Feed: <FeedPage setPage={setPage} />,
    Trips: <TripsPage />,
    Connect: <ConnectPage />,
    Chat: <ChatPage />,
    Wishlist: <WishlistPage setPage={setPage} />,
    Profile: <ProfilePage setPage={setPage} />,
    Notifications: <NotificationsPage />,
    CreatePost: <CreatePostPage setPage={setPage} />,
    Login: <LoginPage setPage={setPage} />,
    Register: <RegisterPage setPage={setPage} />,
  };

  return (
    <>
      {showAdmin && (
        <AdminModal
          onClose={() => setShowAdmin(false)}
          onLogin={() => setIsAdmin(true)}
        />
      )}
      <Nav
        page={page}
        setPage={setPage}
        onAdminClick={() => setShowAdmin(true)}
        isAdmin={isAdmin}
        isLoggedIn={isLoggedIn}
        user={user}
        logout={logout}
      />
      {isAdmin && <AdminDashboard onLogout={() => setIsAdmin(false)} />}
      <main>{pages[page]}</main>
      <Footer setPage={setPage} />
    </>
  );
}