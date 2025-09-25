import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";

// Haversine distance in meters
function distanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function PatientLocation() {
  const [home] = useState({ lat: 12.899, lng: 80.189 }); // safe zone center (set to hospital/home)
  const [radius] = useState(500); // meters
  const [location, setLocation] = useState(null);
  const [alertMsg, setAlertMsg] = useState("");

  const updateLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newLoc = { lat: latitude, lng: longitude };
        setLocation(newLoc);

        // Check distance
        const dist = distanceMeters(latitude, longitude, home.lat, home.lng);
        if (dist > radius) {
          setAlertMsg("⚠️ Patient has left the safe zone!");
        } else {
          setAlertMsg("");
        }
      },
      (err) => alert("Error getting location: " + err.message),
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    updateLocation();
    const interval = setInterval(updateLocation, 10000); // auto refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>📍 Patient Location</h2>
      {alertMsg && (
        <div style={{
          background: "#ffe5e5",
          color: "#b00020",
          padding: "10px 12px",
          borderRadius: 8,
          marginBottom: 10,
          fontWeight: 600
        }}>
          {alertMsg}
        </div>
      )}

      <div style={{ height: 400, width: "100%", borderRadius: 12, overflow: "hidden" }}>
        <MapContainer center={home} zoom={15} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Safe zone circle */}
          <Circle
            center={home}
            radius={radius}
            pathOptions={{ color: "#2a9d8f", fillColor: "#2a9d8f", fillOpacity: 0.1 }}
          />

          {/* Home marker */}
          <Marker position={home}>
            <Popup>Home (safe zone)</Popup>
          </Marker>

          {/* Patient marker */}
          {location && (
            <Marker position={[location.lat, location.lng]}>
              <Popup>Patient location</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <button
        onClick={updateLocation}
        style={{ marginTop: 12, background: "#0077b6", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}
      >
        Refresh Location
      </button>
    </div>
  );
}