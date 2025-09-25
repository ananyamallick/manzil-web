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
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #e0f7fa, #f1f8e9)",
      fontFamily: "Poppins, sans-serif"
    }}>
      <div style={{
        background: "#fff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center"
      }}>
        <img 
          src="https://cdn-icons-png.flaticon.com/512/2966/2966486.png" 
          alt="Medical Icon" 
          style={{ width: "60px", marginBottom: "15px" }}
        />
        <h2 style={{ color: "#0077b6", marginBottom: "10px" }}>Create Account</h2>
        <p style={{ color: "#555", marginBottom: "20px" }}>Join the Patient Care Portal</p>

        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none"
            }}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none"
            }}
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none"
            }}
          >
            <option value="">Select Role</option>
            <option value="family">Family Member</option>
            <option value="caregiver">Caregiver</option>
          </select>

          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
          <button
            type="submit"
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              background: "#0077b6",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#0077b6", fontWeight: "bold" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;