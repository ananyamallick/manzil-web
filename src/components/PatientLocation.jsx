import { useEffect, useState } from "react";

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

  const openGoogleMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
      window.open(url, '_blank');
    }
  };

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

        // Check distance (logic kept for future use but no alert displayed)
        const dist = distanceMeters(latitude, longitude, home.lat, home.lng);
        // Alert logic removed as requested
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
    <div className="location-container">
      <h2 className="location-title">📍 Location</h2>
      
      {/* Live Location Display */}
      {location && (
        <div style={{ 
          marginBottom: "16px", 
          textAlign: "center",
          background: "#f8f9fa",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #e9ecef"
        }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#495057" }}>
            📍 Current Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </p>
          <button 
            onClick={openGoogleMaps}
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #4361ee, #3a0ca3)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(67, 97, 238, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 6px 20px rgba(67, 97, 238, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(67, 97, 238, 0.3)";
            }}
          >
            🗺️ View Location
          </button>
        </div>
      )}

      {/* OpenStreetMap Display */}
      {location && (
        <div style={{ 
          marginTop: "16px",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <iframe
            width="100%"
            height="300"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.01},${location.lat - 0.01},${location.lng + 0.01},${location.lat + 0.01}&layer=mapnik&marker=${location.lat},${location.lng}`}
            allowFullScreen
            title="Patient Location Map"
          />
        </div>
      )}

      {!location && (
        <div style={{
          marginTop: "16px",
          width: "100%",
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f9fa",
          borderRadius: "12px",
          border: "2px dashed #dee2e6",
          color: "#6c757d",
          fontSize: "16px",
          fontWeight: "500"
        }}>
          📍 Location data will appear here
        </div>
      )}


    </div>
  );
}