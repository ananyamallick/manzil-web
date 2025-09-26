import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import AddPatientForm from "../components/AddPatientForm";
import PatientList from "../components/PatientList";
import EditPatientForm from "../components/EditPatientForm";
import "../App.css";

function Patients() {
  const [editingPatient, setEditingPatient] = useState(null);
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
            <p>Please log in to access patient management.</p>
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