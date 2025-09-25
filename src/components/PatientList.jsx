import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";

function PatientList({ renderActionButton, showRange }) {
  const [patients, setPatients] = useState([]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "patients", id));
      console.log("Patient successfully deleted!");
    } catch (error) {
      console.error("Error removing patient: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "patients"), (snapshot) => {
      setPatients(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="animate-fadeInUp" style={{ marginTop: "2rem" }}>
      {patients.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: "0.3" }}>🏥</div>
          <p style={{ color: "var(--medium-gray)", fontStyle: "italic", fontSize: "1.1rem" }}>
            No patients have been added yet.
          </p>
          <p style={{ color: "var(--medium-gray)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
            Click "Add Patient" to get started.
          </p>
        </div>
      ) : (
        <div className="patients-grid">
          {patients.map((p, index) => (
            <div
              key={p.id}
              className="patient-card animate-fadeInUp"
              style={{
                background: "var(--white)",
                borderRadius: "var(--radius-2xl)",
                padding: "2rem",
                boxShadow: "var(--shadow-lg)",
                marginBottom: "2rem",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                backdropFilter: "blur(10px)",
                transition: "var(--transition-normal)",
                position: "relative",
                overflow: "hidden",
                animationDelay: `${index * 0.1}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "var(--shadow-xl)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--primary-blue) 0%, var(--secondary-blue) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    boxShadow: "var(--shadow-md)"
                  }}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{
                      color: "var(--primary-navy)",
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      marginBottom: "0.25rem",
                      fontFamily: "var(--font-display)"
                    }}>
                      {p.name}
                    </h3>
                    <p style={{
                      color: "var(--medium-gray)",
                      fontSize: "0.9rem",
                      fontWeight: "500"
                    }}>
                      🩺 {p.condition}
                    </p>
                  </div>
                </div>
                {renderActionButton && renderActionButton(p, handleDelete)}
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>👩‍⚕️</span>
                  <div>
                    <p style={{ fontSize: "0.8rem", color: "var(--medium-gray)", marginBottom: "0.1rem" }}>Caregiver</p>
                    <p style={{ fontWeight: "500", color: "var(--dark-gray)" }}>{p.caregiver}</p>
                  </div>
                </div>
                
                {showRange && p.range && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.1rem" }}>📏</span>
                    <div>
                      <p style={{ fontSize: "0.8rem", color: "var(--medium-gray)", marginBottom: "0.1rem" }}>Range</p>
                      <p style={{ fontWeight: "500", color: "var(--dark-gray)" }}>{p.range} {p.rangeUnit}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {p.voiceUrl && (
                <div style={{ 
                  background: "var(--off-white)", 
                  borderRadius: "var(--radius-lg)", 
                  padding: "1rem",
                  borderLeft: "4px solid var(--accent-teal)"
                }}>
                  <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--primary-navy)", marginBottom: "0.5rem" }}>
                    🎧 Voice Guidance
                  </p>
                  <audio controls style={{ width: "100%", borderRadius: "var(--radius-md)" }}>
                    <source src={p.voiceUrl} type="audio/mpeg" />
                  </audio>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PatientList;