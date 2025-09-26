import { useState } from "react";
import { db, auth } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";

function AddPatientForm() {
  const [name, setName] = useState("");
  const [condition, setCondition] = useState("");
  const [caregiver, setCaregiver] = useState("");
  const [range, setRange] = useState(0.5);
  const [rangeUnit, setRangeUnit] = useState("m");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to add a patient.");
      return;
    }
    
    await addDoc(collection(db, "patients"), {
      name,
      condition,
      caregiver,
      range,
      rangeUnit,
      voiceUrl: "",
      userId: user.uid, // Associate patient with current user
      createdAt: new Date()
    });
    setName("");
    setCondition("");
    setCaregiver("");
    setRange(1);
    setRangeUnit("m");
  };

  return (
    <form onSubmit={handleSubmit} className="add-patient-form animate-fadeInUp">
      <div className="form-group">
        <label htmlFor="patientName">Patient Name</label>
        <input 
          id="patientName" 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Enter patient's full name" 
          required 
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="condition">Medical Condition</label>
        <input 
          id="condition" 
          type="text" 
          value={condition} 
          onChange={(e) => setCondition(e.target.value)} 
          placeholder="Describe the patient's condition" 
          required 
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="caregiver">Assigned Caregiver</label>
        <select 
          id="caregiver" 
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
        <label htmlFor="range">Safety Range</label>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <input
            id="range"
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
      
      <button type="submit">Add Patient</button>
    </form>
  );
}

export default AddPatientForm;