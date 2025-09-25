import { NavLink } from "react-router-dom";
import PatientList from "../components/PatientList";
import PatientLocation from "../components/PatientLocation";
import "../App.css";

function Dashboard() {
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