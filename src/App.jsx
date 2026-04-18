import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import "./App.css";

const firebaseConfig = {
  apiKey: "AIzaSyBxJwh1T1EaeHgZORSjmyR9kTrrkTyNjnY",
  authDomain: "esp32-ffc32.firebaseapp.com",
  databaseURL: "https://esp32-ffc32-default-rtdb.firebaseio.com",
  projectId: "esp32-ffc32",
  storageBucket: "esp32-ffc32.firebasestorage.app",
  messagingSenderId: "762635568901",
  appId: "1:762635568901:web:efdb8b9cb29c13b810196c",
  measurementId: "G-QWH7VED33M"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 🔥 Reusable Toggle Component
function ToggleCard({ title, dbKey }) {
  const [state, setState] = useState(false);

  useEffect(() => {
    const deviceRef = ref(database, dbKey);
    onValue(deviceRef, (snapshot) => {
      setState(snapshot.val() === 1);
    });
  }, [dbKey]);

  const toggle = () => {
    set(ref(database, dbKey), state ? 0 : 1);
  };

  return (
    <div className="card">
      <h2>{title}</h2>
      <motion.button
        whileTap={{ scale: 0.9 }}
        animate={{ backgroundColor: state ? "#00ff99" : "#1e293b" }}
        className="toggle-button"
        onClick={toggle}
      >
        {state ? "ON" : "OFF"}
      </motion.button>
    </div>
  );
}
function ModeControl() {
  const [mode, setMode] = useState("manual");

  useEffect(() => {
    const modeRef = ref(database, "mode");
    onValue(modeRef, (snapshot) => {
      if (snapshot.val()) {
        setMode(snapshot.val());
      }
    });
  }, []);

  const setManual = () => {
    set(ref(database, "mode"), "manual");
  };

  const setAuto = () => {
    set(ref(database, "mode"), "auto");
  };

  return (
    <div className="mode-container">
      <h2>System Mode</h2>

      <div className="mode-buttons">
        <motion.button
          whileTap={{ scale: 0.9 }}
          animate={{ backgroundColor: mode === "manual" ? "#00ff99" : "#1e293b" }}
          className="toggle-button"
          onClick={setManual}
        >
          Manual Mode
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          animate={{ backgroundColor: mode === "auto" ? "#3b82f6" : "#1e293b" }}
          className="toggle-button"
          onClick={setAuto}
        >
          Automatic Mode
        </motion.button>
      </div>
    </div>
  );
}
function StatusIndicator() {
  const [status, setStatus] = useState("offline");

  useEffect(() => {
    const statusRef = ref(database, "status");

    onValue(statusRef, (snapshot) => {
      if (snapshot.val()) {
        setStatus(snapshot.val());
      } else {
        setStatus("offline");
      }
    });
  }, []);

  return (
    <div className="status-container">
      <div className={`status-dot ${status}`}></div>
      <span>ESP Status: {status.toUpperCase()}</span>
    </div>
  );
}
export default function App() {
  return (
    <div className="container">
      <h1>⚡ Smart Control Dashboard</h1>
      <StatusIndicator />
<ModeControl />
      <div className="grid">
        <ToggleCard title="Relay 1" dbKey="relay1" />
        <ToggleCard title="Relay 2" dbKey="relay2" />
        <ToggleCard title="Relay 3" dbKey="relay3" />

        <ToggleCard title="SSR 1" dbKey="ssr1" />
        <ToggleCard title="SSR 2" dbKey="ssr2" />
        <ToggleCard title="SSR 3" dbKey="ssr3" />
      </div>
    </div>
  );
}