// frontend/src/components/LiveTemperatureChart.jsx
import React, { useEffect, useState } from "react";

const LiveTemperatureChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");

    socket.onmessage = (event) => {
      const incoming = JSON.parse(event.data);
      const formatted = incoming.map((d) => ({
        time: new Date(d.time).toLocaleTimeString(),
        value: d.value,
      }));
      setData(formatted);
    };

    return () => socket.close();
  }, []);

  return (
    <div>
      <h2>Temperatura en vivo</h2>
      {/* Puedes usar Recharts aquí */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default LiveTemperatureChart;
