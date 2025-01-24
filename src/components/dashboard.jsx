import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "react-circular-progressbar/dist/styles.css";

const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

const Dashboard = () => {
  const [position, setPosition] = useState([-6.34605, 106.69156]);
  const [history, setHistory] = useState([]);
  const [tracking, setTracking] = useState(true);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = [latitude, longitude];

          setPosition(newLocation);
          setHistory((prevHistory) => {
            // Keep only the last 10 positions
            const updatedHistory = [...prevHistory, newLocation];
            if (updatedHistory.length > 10) updatedHistory.shift();
            return updatedHistory;
          });
        },
        (error) => {
          console.error("Error fetching geolocation: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (tracking) {
      getUserLocation();
      const interval = setInterval(getUserLocation, 5000);
      return () => clearInterval(interval);
    }
  }, [tracking]);

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="dashboard-controls">
          <input
            type="text"
            placeholder="Cari Lokasi"
            className="search-input"
          />
          <button className="button-start">Mulai Baru +</button>
          <button className="button-live">Live Data</button>
        </div>
      </header>

      <div className="maps-box">
        <div className="details" id="map" style={{ height: "500px" }}>
          <MapContainer
            center={position}
            zoom={16}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                Latitude: {position[0]}, Longitude: {position[1]}
              </Popup>
            </Marker>
            <RecenterAutomatically lat={position[0]} lng={position[1]} />

            {/* Polyline for history */}
            {history.length > 1 && (
              <Polyline positions={history} color="blue" />
            )}

            {history.map((pos, idx) => (
              <Marker key={idx} position={pos}>
                <Popup>
                  Latitude : {pos[0]}, Longitude : {pos[1]}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
