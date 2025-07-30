import { useState, useEffect, useRef } from "react";
import SensorChart from "../components/SensorChart";
import { createWSClient } from "../utils/wsClient";

function Dashboard() {
  const [sensorData, setSensorData] = useState({});
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = createWSClient({
      url: "ws://localhost:3001",
      onOpen: () => console.log("WebSocket abierto"),
      onMessage: (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Dato recibido:", data);
          const { room, time, value } = data;

          setSensorData((prev) => {
            const existing = prev[room] || [];
            return {
              ...prev,
              [room]: [
                ...existing.slice(-99),
                { time: Date.parse(time) / 1000, value },
              ],
            };
          });
        } catch (e) {
          console.error("Error al parsear mensaje:", e);
        }
      },
      onError: (err) => console.error("WebSocket error:", err),
      onClose: (e) => console.warn("WebSocket cerrado:", e),
    });

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        Panel de Sensores en Tiempo Real
      </h2>

      {Object.keys(sensorData).length === 0 ? (
        <p style={{ textAlign: "center" }}>Esperando datos en tiempo real...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(350px, 1fr))",
            gap: "10px",
          }}
        >
          {Object.entries(sensorData).map(([room, data]) => (
            <div
              key={room}
              style={{
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                padding: "15px",
              }}
            >
              <SensorChart
                data={data}
                title={`Sensor: ${room}`}
                color={getSensorColor(room)}
                width="100%"
                height={200}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getSensorColor(room) {
  const colors = {
    proximidad: "#2962FF",
    nivel: "#E15759",
    temperatura: "#F28E2C",
    uso: "#4CAF50",
    default: "#8884d8",
  };
  return colors[room] || colors.default;
}

export default Dashboard;
