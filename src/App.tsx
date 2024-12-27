import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Compass from "./Compass";
import NumberDisplay from "./NumberDisplay";
import DoubleDisplay from "./DoubleDisplay";

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

  useEffect(() => {
    let watchId: number;

    const startWatching = () => {
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const readableTimestamp = new Date(position.timestamp).toLocaleString();
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              speed: position.coords.speed,
              heading: position.coords.heading,
              timestamp: readableTimestamp,
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
    <div className="container mt-5 text-center">
      <h1 className="mb-4 text-white">Web Speed Meter</h1>
      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <div className="row">
            <div className="col-6 d-flex justify-content-center my-2">
              <DoubleDisplay
                top={location.latitude !== null ? location.latitude.toFixed(6) : "N/A"}
                bottom={location.longitude !== null ? location.longitude.toFixed(6) : "N/A"}
              />
            </div>
            <div className="col-6 d-flex justify-content-center my-2">
              <DoubleDisplay
                top="Accuracy"
                bottom={location.accuracy !== null ? `${location.accuracy.toFixed(0)} m` : "N/A"}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6 d-flex justify-content-center my-2">
              <NumberDisplay value={location.speed !== null ? (location.speed * 3.6).toFixed(0) : 0} unit="KM/H" fixedLength={3} />
            </div>
            <div className="col-6 d-flex justify-content-center my-2">
              <DoubleDisplay
                top={location.timestamp ? location.timestamp.split(",")[0] : "N/A"}
                bottom={location.timestamp ? location.timestamp.split(",")[1]?.trim() : "N/A"}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12 d-flex justify-content-center my-2">
              <Compass heading={location.heading ?? 0} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;