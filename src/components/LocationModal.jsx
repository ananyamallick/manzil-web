import { useEffect, useState } from "react";
import "../App.css";

function LocationModal({ isOpen, onClose, location, home }) {
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    if (location && isOpen) {
      // Create map URL without API key for better reliability
      const url = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=16&size=800x600&maptype=roadmap&markers=color:red%7Clabel:P%7C${location.lat},${location.lng}&markers=color:green%7Clabel:H%7C${home.lat},${home.lng}`;
      setMapUrl(url);
    }
  }, [location, home, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📍 Patient Location</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {location && (
            <div className="location-info">
              <p><strong>Current Location:</strong></p>
              <p>Latitude: {location.lat.toFixed(6)}</p>
              <p>Longitude: {location.lng.toFixed(6)}</p>
            </div>
          )}
          
          <div className="modal-map-container">
            {location ? (
              <img
                src={mapUrl}
                alt="Patient Location Map"
                className="modal-map"
                onError={(e) => {
                  // Fallback map without API key
                  e.target.src = `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=16&size=800x600&maptype=roadmap&markers=color:red%7Clabel:P%7C${location.lat},${location.lng}&markers=color:green%7Clabel:H%7C${home.lat},${home.lng}`;
                }}
              />
            ) : (
              <div className="modal-map-placeholder">
                <p>📍 Location data not available</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="modal-button secondary" onClick={onClose}>
            Close
          </button>
          {location && (
            <a
              href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-button primary"
            >
              Open in Google Maps
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default LocationModal;