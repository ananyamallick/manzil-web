import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import PatientList from "../components/PatientList";
import PatientLocation from "../components/PatientLocation";
import "../App.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <aside className="sidebar">
          <h2>Care Portal</h2>
        </aside>
        <main style={{ flex: 1, padding: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-container">
        <aside className="sidebar">
          <h2>Care Portal</h2>
        </aside>
        <main style={{ flex: 1, padding: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="card" style={{ textAlign: "center" }}>
            <h3>🔒 Access Denied</h3>
            <p>Please log in to access the dashboard.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
  <h2>Care Portal</h2>
  <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
    Dashboard
  </NavLink>
  <NavLink to="/patients" className={({ isActive }) => (isActive ? "active" : "")}>
    Patients
  </NavLink>
  <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
    Settings
  </NavLink>
  <NavLink to="/logout" className={({ isActive }) => (isActive ? "active" : "")}>
    Logout
  </NavLink>
</aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: "12px" }}>
            <h1>🏠 Dashboard</h1>
            <p>Welcome to the Patient Care Portal. Here you can manage patients and voice guidance.</p>
          </div>

          {/* Patient Location Card */}
          {/* <div className="card">
          <p><strong>Username:</strong> prash</p>
          <p><strong>Condition:</strong> Alzheimer</p>
          <p><strong>Caregiver:</strong> Family member</p>
        </div> */}

          {/* Firestore Patients List */}
          <div className="card">
            <h2>👥 All Patients (Live)</h2>
            <PatientList
              showRange={false}
              renderActionButton={(patientId) => (
                <button
                  onClick={() => console.log(`View location for patient: ${patientId}`)}
                  style={{
                    background: "#28a745", /* New color: a shade of green */
                    color: "#fff",
                    border: "none",
                    padding: "8px 15px",
                    borderRadius: "6px",
                    marginTop: "10px",
                    marginRight: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "auto", /* Ensure width adjusts to content */
                    height: "auto", /* Ensure height adjusts to content */
                  }}
                >
                  📍 View Location
                </button>
              )}
            />
          </div>
        </div>
        <div className="location-panel">
          <PatientLocation />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;