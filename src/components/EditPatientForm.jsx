import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { doc, updateDoc } from "firebase/firestore";

function EditPatientForm({ patient, onSave, onCancel }) {
  const [name, setName] = useState("");
  const [condition, setCondition] = useState("");
  const [caregiver, setCaregiver] = useState("");
  const [range, setRange] = useState(0.5);
  const [rangeUnit, setRangeUnit] = useState("m");

  useEffect(() => {
    if (patient) {
      setName(patient.name || "");
      setCondition(patient.condition || "");
      setCaregiver(patient.caregiver || "");
      setRange(patient.range || 0.5);
      setRangeUnit(patient.rangeUnit || "m");
    }
  }, [patient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patient?.id) return;

    try {
      await updateDoc(doc(db, "patients", patient.id), {
        name,
        condition,
        caregiver,
        range,
        rangeUnit
      });
      onSave();
    } catch (error) {
      console.error("Error updating patient: ", error);
    }
  };

  if (!patient) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div className="card animate-fadeInUp" style={{ 
        maxWidth: "500px", 
        width: "90%",
        maxHeight: "80vh",
        overflowY: "auto"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ 
            fontFamily: "var(--font-display)", 
            color: "var(--primary-navy)",
            margin: 0
          }}>
            Edit Patient
          </h2>
          <button 
            onClick={onCancel}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "var(--medium-gray)",
              padding: "0.5rem",
              borderRadius: "50%",
              transition: "var(--transition-normal)"
            }}
            onMouseEnter={(e) => e.target.style.background = "var(--light-gray)"}
            onMouseLeave={(e) => e.target.style.background = "none"}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="editName">Patient Name</label>
            <input 
              id="editName"
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter patient's full name" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="editCondition">Medical Condition</label>
            <input 
              id="editCondition"
              type="text" 
              value={condition} 
              onChange={(e) => setCondition(e.target.value)} 
              placeholder="Describe the patient's condition" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="editCaregiver">Assigned Caregiver</label>
            <select 
              id="editCaregiver"
              value={caregiver} 
              onChange={(e) => setCaregiver(e.target.value)} 
              required
            >
              <option value="">Select Caregiver</option>
              <option value="Dr. Smith">Dr. Smith</option>
              <option value="Nurse Asha">Nurse Asha</option>
              <option value="Family Member">Family Member</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="editRange">Safety Range</label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <input
                id="editRange"
                type="number"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="0.5"
                required
                min="0.1"
                step="0.1"
                style={{ flex: "1" }}
              />
              <select 
                value={rangeUnit} 
                onChange={(e) => setRangeUnit(e.target.value)}
                style={{ width: "100px" }}
              >
                <option value="m">Meters</option>
                <option value="km">Kilometers</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
            <button 
              type="button" 
              onClick={onCancel}
              style={{
                background: "var(--light-gray)",
                color: "var(--dark-gray)",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "var(--radius-lg)",
                cursor: "pointer",
                fontWeight: "600",
                transition: "var(--transition-normal)"
              }}
              onMouseEnter={(e) => e.target.style.background = "var(--medium-gray)"}
              onMouseLeave={(e) => e.target.style.background = "var(--light-gray)"}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPatientForm;