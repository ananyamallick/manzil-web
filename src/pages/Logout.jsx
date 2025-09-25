import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Logout() {
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await signOut(auth);
        navigate("/signup"); // 👈 redirect to signup page
      } catch (err) {
        alert("Error logging out: " + err.message);
      }
    };
    doLogout();
  }, [auth, navigate]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Logging you out...</h2>
      <p>Please wait while we redirect you to the signup page.</p>
    </div>
  );
}

export default Logout;