import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  altitude: number | null;
  speed: number | null;
  heading: number | null;
  timestamp: string | null;
}

const App: React.FC = () => {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    altitude: null,
    speed: null,
    heading: null,
    timestamp: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [altitudeBaseline, setAltitudeBaseline] = useState<number | null>(null);

  useEffect(() => {
    let watchId: number;

    const startWatching = () => {
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            console.log(position);

            const readableTimestamp = new Date(position.timestamp).toLocaleString();
            const currentAltitude = position.coords.altitude;

            if (altitudeBaseline === null && currentAltitude !== null && currentAltitude < 0) {
              setAltitudeBaseline(-currentAltitude);
            }

            // calibrate altitude
            const calibratedAltitude =
              currentAltitude !== null && altitudeBaseline !== null
                ? currentAltitude + altitudeBaseline
                : currentAltitude;

            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: calibratedAltitude,
              speed: position.coords.speed,
              heading: position.coords.heading,
              timestamp: readableTimestamp, // 设置时间戳
            });
            setError(null);
          },
          (err) => {
            setError(err.message);
            setLocation({
              latitude: null,
              longitude: null,
              accuracy: null,
              altitude: null,
              speed: null,
              heading: null,
              timestamp: null,
            });
          },
          {
            enableHighAccuracy: true, // 高精度模式
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };

    startWatching();

    // 清除监听器，防止内存泄漏
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Web Speed Meter</h1>
      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Coordinates</h5>
            <p className="card-text">
              <strong>Latitude:</strong> {location.latitude ?? "N/A"} <br />
              <strong>Longitude:</strong> {location.longitude ?? "N/A"} <br />
              <strong>Accuracy:</strong> {location.accuracy ? `${location.accuracy} meters` : "N/A"} <br />
              <strong>Altitude:</strong> {location.altitude ? `${location.altitude} meters` : "N/A"} <br />
              <strong>Speed:</strong> {location.speed ? `${location.speed} m/s` : "N/A"} <br />
              <strong>Heading:</strong> {location.heading ? `${location.heading}°` : "N/A"} <br />
              <strong>Timestamp:</strong> {location.timestamp ?? "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;