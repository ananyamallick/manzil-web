import { NavLink } from "react-router-dom";
import { useState } from "react";
import AddPatientForm from "../components/AddPatientForm";
import PatientList from "../components/PatientList";
import EditPatientForm from "../components/EditPatientForm";
import "../App.css";

function Patients() {
  const [editingPatient, setEditingPatient] = useState(null);

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
      <main className="main-content">
        <div className="animate-fadeInUp">
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ 
              fontFamily: "var(--font-display)", 
              fontSize: "2.5rem", 
              color: "var(--primary-navy)",
              marginBottom: "0.5rem"
            }}>
              👥 Patient Management
            </h1>
            <p style={{ 
              color: "var(--medium-gray)", 
              fontSize: "1.1rem",
              fontWeight: "400"
            }}>
              Add new patients, assign caregivers, and review their conditions.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
            {/* Add Patient Card */}
            <div className="card animate-slideInLeft">
              <h2>Add New Patient</h2>
              <AddPatientForm />
            </div>

            {/* Patient Records Card */}
            <div className="card animate-fadeInUp">
              <h2>Patient Records</h2>
              <PatientList
                showRange={true}
                renderActionButton={(patient, handleDelete) => (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <button
                      onClick={() => setEditingPatient(patient)}
                      className="btn-primary"
                      style={{
                        padding: "0.75rem 1rem",
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem"
                      }}
                    >
                      ✏️ Edit Patient
                    </button>
                    <button
                      onClick={() => handleDelete(patient.id)}
                      className="btn-danger"
                      style={{
                        padding: "0.75rem 1rem",
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem"
                      }}
                    >
                      🗑️ Delete Patient
                    </button>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Edit Patient Modal */}
      {editingPatient && (
        <EditPatientForm
          patient={editingPatient}
          onSave={() => setEditingPatient(null)}
          onCancel={() => setEditingPatient(null)}
        />
      )}
    </div>
  );
}

export default Patients;