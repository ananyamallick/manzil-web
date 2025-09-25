// src/pages/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  // 🔹 State + Logic
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // redirect after login
    } catch (err) {
      setError("Invalid email or password");
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
        <h2 style={{ color: "#0077b6", marginBottom: "10px" }}>Patient Care Portal</h2>
        <p style={{ color: "#555", marginBottom: "20px" }}>Login to continue</p>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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
            Login
          </button>
        </form>

        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: "#0077b6", fontWeight: "bold" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;