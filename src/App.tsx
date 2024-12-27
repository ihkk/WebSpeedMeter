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
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  useEffect(() => {
    let watchId: number;


    // start wake lock
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          const lock = await navigator.wakeLock.request("screen");
          setWakeLock(lock);

          // handle wake lock state changes
          lock.addEventListener("release", () => {
            console.log("Wake Lock was released.");
          });

          console.log("Wake Lock is active.");
        } else {
          console.log("Wake Lock API is not supported in this browser.");
        }
      } catch (err) {
        console.error("Failed to acquire Wake Lock:", err);
      }
    };

    // release wake lock
    const releaseWakeLock = async () => {
      if (wakeLock !== null) {
        await wakeLock.release();
        setWakeLock(null);
      }
    };

    // request wake lock
    requestWakeLock();

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
            enableHighAccuracy: true,
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };

    startWatching();

    // clear watch
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
      releaseWakeLock();
    };
  }, []);

  // Fullscreen function
  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Failed to enable fullscreen mode:", err.message);
      });
    }
  };


  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-4 text-white" onClick={handleFullscreen} style={{ cursor: "pointer" }}>
        Web Speed Meter
      </h1>
      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <div className="grid-container">
            <DoubleDisplay
              top={location.latitude !== null ? location.latitude.toFixed(6) : "N/A"}
              bottom={location.longitude !== null ? location.longitude.toFixed(6) : "N/A"}
            />
            <DoubleDisplay
              top="Accuracy"
              bottom={location.accuracy !== null ? `${location.accuracy.toFixed(0)} m` : "N/A"}
            />
            <NumberDisplay value={location.speed !== null ? (location.speed * 3.6).toFixed(0) : 0} unit="KM/H" fixedLength={3} />
            <DoubleDisplay
              top={location.timestamp ? location.timestamp.split(",")[0] : "N/A"}
              bottom={location.timestamp ? location.timestamp.split(",")[1]?.trim() : "N/A"}
            />
          </div>
          <div className="d-flex justify-content-center">
            <Compass heading={location.heading ?? 0} />
          </div>
        </>
      )}
    </div>
  );
};

export default App;