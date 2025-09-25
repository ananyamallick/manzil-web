import { NavLink } from "react-router-dom";
import AddPatientForm from "../components/AddPatientForm";
import PatientList from "../components/PatientList";
import "../App.css"; // make sure this has your .card and sidebar styles

function Patients() {
  return (
    <div className="dashboard-container">
      {/* Sidebar (same as Dashboard) */}
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
      <main style={{ flex: 1, padding: "30px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ marginBottom: "20px" }}>
            <h1>👥 Patient Details</h1>
            <p>Add new patients, assign caregivers, and review their conditions.</p>
          </div>

          {/* Add Patient Card */}
          <div className="card">
            <h2>Add Patient</h2>
            <AddPatientForm />
          </div>
        </div>

        {/* Patient Records Card */}
        <div className="card" style={{ width: "50%" }}>
          <h2>Patient Records</h2>
          <PatientList
            showRange={true}
            renderActionButton={(patientId, handleDelete) => (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  onClick={() => console.log(`Edit patient: ${patientId}`)}
                  style={{
                    background: "#007bff",
                    color: "#fff",
                    border: "none",
                    padding: "8px 15px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✏️ Edit Patient
                </button>
                <button
                  onClick={() => handleDelete(patientId)}
                  style={{
                    background: "#d62828",
                    color: "#fff",
                    border: "none",
                    padding: "8px 15px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  🗑️ Delete Patient
                </button>
              </div>
            )}
          />
        </div>
      </main>
    </div>
  );
}

export default Patients;