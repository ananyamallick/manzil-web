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
    <div style={{ marginTop: "20px" }}>
      {patients.length === 0 ? (
        <p style={{ color: "#666", fontStyle: "italic" }}>No patients yet.</p>
      ) : (
        patients.map((p) => (
          <div
            key={p.id}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
              maxWidth: "700px", /* Adjusted from 500px to 700px */
              marginBottom: "20px",
              borderLeft: "6px solid #0077b6",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              display: "flex",
              flexDirection: "row", /* Changed to row */
              justifyContent: "space-between", /* Distribute space */
              alignItems: "flex-end", /* Align items to the bottom */
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0px 6px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0px 4px 15px rgba(0,0,0,0.1)";
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", alignSelf: "flex-start" }}>
              <div>
                <h3 style={{ color: "#023e8a", marginBottom: "10px" }}>
                  👤 {p.name}
                </h3>
                <p>
                  <strong>🩺 Condition:</strong> {p.condition}
                </p>
                <p>
                  <strong>👩‍⚕️ Caregiver:</strong> {p.caregiver}
                </p>
                {showRange && p.range && (
                  <p>
                    <strong>📏 Range:</strong> {p.range} {p.rangeUnit}
                  </p>
                )}
                {p.voiceUrl && (
                  <div style={{ marginTop: "10px" }}>
                    <h4 style={{ marginBottom: "5px" }}>🎧 Voice Guidance:</h4>
                    <audio controls style={{ width: "100%" }}>
                      <source src={p.voiceUrl} type="audio/mpeg" />
                    </audio>
                  </div>
                )}
              </div>
            </div>
            {renderActionButton && renderActionButton(p.id, handleDelete)}
          </div>
        ))
      )}
    </div>
  );
}

export default PatientList;