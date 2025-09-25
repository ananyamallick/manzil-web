import { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged, updateEmail, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { NavLink } from "react-router-dom";
import "../App.css";

function Settings() {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  // 🎙️ Voice recording states
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            setEmail(snap.data().email || user.email);
            setRole(snap.data().role || "family member");
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [auth, db]);

  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user && newEmail) {
        await updateEmail(user, newEmail);
        await setDoc(doc(db, "users", user.uid), { email: newEmail, role }, { merge: true });
        setEmail(newEmail);
        setNewEmail("");
        setIsEditing(false);
        alert("Profile updated!");
      }
    } catch (err) {
      alert("Error updating profile: " + err.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      if (email) {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent!");
      }
    } catch (err) {
      alert("Error resetting password: " + err.message);
    }
  };

  // 🎙️ Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      alert("Microphone access denied: " + err.message);
    }
  };

  // 🎙️ Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  // 🎙️ Save recording to Firebase
  const saveRecording = async () => {
    if (!audioURL) return;
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to save a recording.");
        return;
      }

      const response = await fetch(audioURL);
      const blob = await response.blob();

      const storageRef = ref(storage, `voices/${user.uid}/recordedVoice.webm`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "users", user.uid), { alertVoiceUrl: url });
      alert("Recorded voice saved successfully!");
    } catch (err) {
      alert("Error saving recording: " + err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

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
      <main style={{ flex: 1, padding: "30px" }}>
        <div style={{ marginBottom: "20px" }}>
          <h1>⚙️ Settings</h1>
          <p>Manage your profile, security, and alert preferences.</p>
        </div>

        {/* Profile Card */}
        <div className="card">
          <h2>👤 Profile</h2>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Role:</strong> {role}</p>

          {isEditing ? (
            <>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email"
              />
              <button onClick={handleSaveProfile}>Save</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>

        {/* 🎙️ Voice Recorder Card (SECOND) */}
        <div className="card">
          <h2>🎙️ Record Alert Voice</h2>
          {!recording ? (
            <button onClick={startRecording}>Start Recording</button>
          ) : (
            <button onClick={stopRecording}>Stop Recording</button>
          )}

          {audioURL && (
            <div style={{ marginTop: "10px" }}>
              <audio controls src={audioURL}></audio>
              <br />
              <button onClick={saveRecording} style={{ marginTop: "10px" }}>
                Save Recording
              </button>
            </div>
          )}
        </div>

        {/* Security Card */}
        <div className="card">
          <h2>🔒 Security</h2>
          <p>Change or reset your password if forgotten.</p>
          <button className="btn-danger" onClick={handleResetPassword}>
            Reset Password
          </button>
        </div>
      </main>
    </div>
  );
}

export default Settings;