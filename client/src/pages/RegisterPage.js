// RegisterPage.js

import { useState } from "react";
import { registerUser } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage({ setPage }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  const phoneRegex = /^\+?\d{10,15}$/;

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !username.trim() || !email.trim() || !phone.trim() || !pass.trim() || !confirm.trim()) {
      return setError("Please fill in all fields.");
    }
    if (!emailRegex.test(email)) {
      return setError("Please enter a valid email address.");
    }
    if (!phoneRegex.test(phone)) {
      return setError("Please enter a valid phone number (10-15 digits).");
    }
    if (!passwordRegex.test(pass)) {
      return setError("Password must be at least 8 characters long and include a special character.");
    }
    if (pass !== confirm) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);
      setError("");
      const res = await registerUser({ name, username, email, phone, password: pass });
      if (res.data && res.data.success) {
        login({ ...res.data.user, token: res.data.token });
        if (setPage) setPage("Profile");
      } else {
        setError(res.data.message || "Failed to register.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Username may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
      }}
    >
      <div className="modal" style={{ width: 420 }}>
        <h2>🌍 Join TourismConnect</h2>
        <p>Create your free account and start exploring</p>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#ef4444",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "16px",
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}

        <label className="modal-label">Full Name</label>
        <input
          className="modal-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
        />

        <label className="modal-label">Username</label>
        <input
          className="modal-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="janedoe"
        />

        <label className="modal-label">Email</label>
        <input
          className="modal-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <label className="modal-label">Phone Number</label>
        <input
          className="modal-input"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+911234567890"
        />

        <label className="modal-label">Password</label>
        <input
          className="modal-input"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Choose a strong password"
          onKeyDown={(e) => e.key === "Enter" && handleRegister()}
        />

        <label className="modal-label">Confirm Password</label>
        <input
          className="modal-input"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat your password"
          onKeyDown={(e) => e.key === "Enter" && handleRegister()}
        />

        <div className="modal-actions">
          <button
            className="modal-btn"
            style={{ background: "var(--light)", color: "var(--gray)" }}
            onClick={() => setPage && setPage("Home")}
          >
            Cancel
          </button>
          <button className="modal-btn modal-btn-submit" onClick={handleRegister} disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </div>

        <p
          style={{ fontSize: 13, color: "var(--gray)", marginTop: 16, textAlign: "center" }}
        >
          Already have an account?{" "}
          <span
            style={{ color: "var(--teal)", cursor: "pointer", fontWeight: 600 }}
            onClick={() => setPage && setPage("Login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}