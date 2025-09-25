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
      
      {/* Live Location Link */}
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
          <a 
            href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #4361ee, #3a0ca3)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
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
            🗺️ View on Google Maps
          </a>
        </div>
      )}

      <div className="map-container">
        {location ? (
          <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=15&size=600x400&maptype=roadmap&markers=color:red%7Clabel:P%7C${location.lat},${location.lng}&markers=color:green%7Clabel:H%7C${home.lat},${home.lng}&key=YOUR_API_KEY`}
            alt="Location Map"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
            onError={(e) => {
              e.target.src = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=15&size=600x400&maptype=roadmap&markers=color:red%7Clabel:P%7C${location.lat},${location.lng}&markers=color:green%7Clabel:H%7C${home.lat},${home.lng}`;
            }}
          />
        ) : (
          <div style={{
            width: "100%",
            height: "100%",
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
            📍 Click "Refresh Location" to load map
          </div>
        )}
      </div>

      <button
        onClick={updateLocation}
        className="refresh-location-btn"
      >
        Refresh Location
      </button>
    </div>
  );
}