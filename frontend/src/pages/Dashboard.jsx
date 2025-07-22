// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import SensorChart from "../components/SensorChart";

const Dashboard = () => {
  const [tempData, setTempData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onmessage = (event) => {
      const { time, room, value } = JSON.parse(event.data);

      if (room === "sala1") {
        setTempData((prev) => [
          ...prev.slice(-100),
          { time: Date.parse(time) / 1000, value },
        ]);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div>
      <h2>Dashboard de Sensores</h2>
      <SensorChart data={tempData} title="Temperatura - Sala 1" />
    </div>
  );
};

export default Dashboard;
