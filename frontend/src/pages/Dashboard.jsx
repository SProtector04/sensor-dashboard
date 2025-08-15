import { useState, useEffect, useRef } from "react";
import SensorChart from "../components/SensorChart";
import { createWSClient } from "../services/wsClient";
import { FaThermometerHalf, FaTachometerAlt, FaWater, FaRulerVertical } from "react-icons/fa";

const SENSOR_ICONS = {
  proximidad: <FaRulerVertical size={24} className="text-blue-500" />,
  nivel: <FaWater size={24} className="text-cyan-500" />,
  temperatura: <FaThermometerHalf size={24} className="text-red-500" />,
  uso: <FaTachometerAlt size={24} className="text-green-500" />,
};


const ROOMS = ["proximidad", "nivel", "temperatura", "uso"];

export default function Dashboard() {
  const [sensorData, setSensorData] = useState(() => {
    const initial = {};
    ROOMS.forEach((room) => (initial[room] = []));
    return initial;
  });
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = createWSClient({
      url: "ws://localhost:3001",
      onOpen: () => console.log("WebSocket abierto"),
      onMessage: (event) => {
        try {
          const data = JSON.parse(event.data);
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold text-center mb-10 text-blue-700">
        Real-Time Sensor Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.keys(sensorData).map((room) => {
          const data = sensorData[room] || [];
          const lastValue = data.length ? data[data.length - 1].value : "--";

          return (
            <div
              key={room}
              className={`rounded-xl shadow-lg bg-white p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {SENSOR_ICONS[room]}
                  <h3 className="text-xl font-semibold text-gray-800">{room.toUpperCase()}</h3>
                </div>
                <span className="px-3 py-1 text-sm font-medium bg-gray-200 rounded-full text-gray-700">
                  {lastValue}
                </span>
              </div>

              <SensorChart
                data={data}
                title={`Sensor: ${room}`}
                color={getSensorColor(room)}
                width="100%"
                height={220}
              />
            </div>
          );
        })}
      </div>
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
