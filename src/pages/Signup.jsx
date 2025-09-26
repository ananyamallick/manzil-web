// src/pages/Signup.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  // 🔹 State + Logic
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    // ✅ Add validation here
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    setError("Please enter a valid email address.");
    return;
  }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), {
        email,
        role,
      });
      navigate("/dashboard");
    } catch (err) {
  console.error("Signup error:", err.code, err.message);

  switch (err.code) {
    case "auth/email-already-in-use":
      setError("This email is already registered. Please log in instead.");
      break;
    case "auth/invalid-email":
      setError("Please enter a valid email address.");
      break;
    case "auth/weak-password":
      setError("Password must be at least 6 characters long.");
      break;
    case "auth/missing-password":
      setError("Please enter a password.");
      break;
    default:
      setError("Something went wrong. Please try again.");
  }
}
  };

  // 🔹 UI
  return (
    <div className="login-container animate-fadeInUp signup-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="#d4af37"/>
            </svg>
          </div>
          <h2 className="login-title">Create Account</h2>
          <p className="login-subtitle">Join the Patient Care Portal</p>
        </div>

        <form onSubmit={handleSignup} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="form-input"
            >
              <option value="">Select Role</option>
              <option value="family">Family Member</option>
              <option value="caregiver">Caregiver</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-button">
            Sign Up
          </button>
        </form>

        <div className="login-footer">
          <p>Already have an account? <Link to="/" className="signup-link">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Signup;