import { useState } from "react";
import { db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";

function AddPatientForm() {
  const [name, setName] = useState("");
  const [condition, setCondition] = useState("");
  const [caregiver, setCaregiver] = useState("");
  const [range, setRange] = useState(0.5);
  const [rangeUnit, setRangeUnit] = useState("m");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "patients"), {
      name,
      condition,
      caregiver,
      range,
      rangeUnit,
      voiceUrl: ""
    });
    setName("");
    setCondition("");
    setCaregiver("");
    setRange(1);
    setRangeUnit("m");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }} className="add-patient-form">
      <div className="form-group">
        <label htmlFor="patientName">Patient Name</label>
        <input id="patientName" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Patient Name" required />
      </div>
      <div className="form-group">
        <label htmlFor="condition">Condition</label>
        <input id="condition" type="text" value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="Condition" required />
      </div>
      <div className="form-group">
        <label htmlFor="caregiver">Caregiver</label>
        <select id="caregiver" value={caregiver} onChange={(e) => setCaregiver(e.target.value)} required style={{ marginRight: "10px" }} >
          <option value="">Select Caregiver</option>
          <option value="Dr. Smith">Dr. Smith</option>
          <option value="Nurse Asha">Nurse Asha</option>
          <option value="Family Member">Family Member</option>
        </select>
      </div>
      <div className="form-group" style={{ display: "flex", alignItems: "center" }}>
        <label htmlFor="range" style={{ marginRight: "10px", marginBottom: "0" }}>Range</label>
        <input
          id="range"
          type="number"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          placeholder="Range"
          required
          min="0.1"
          step="0.1"
          style={{ marginRight: "5px", width: "unset" }}
        />
        <select value={rangeUnit} onChange={(e) => setRangeUnit(e.target.value)} style={{ marginRight: "10px", width: "unset" }}>
          <option value="m">m</option>
          <option value="km">km</option>
        </select>
      </div>
      <button type="submit">Add Patient</button>
    </form>
  );
}

export default AddPatientForm;