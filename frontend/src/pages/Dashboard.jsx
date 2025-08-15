import { useState, useEffect, useRef } from "react";
import SensorChart from "../components/SensorChart";
import { createWSClient } from "../services/wsClient";
import { FaThermometerHalf, FaTachometerAlt, FaWater, FaRulerVertical } from "react-icons/fa";

const SENSOR_ICONS = {
  proximidad: <FaRulerVertical size={24} className="text-sensor-proximidad" />,
  nivel: <FaWater size={24} className="text-sensor-nivel" />,
  temperatura: <FaThermometerHalf size={24} className="text-sensor-temperatura" />,
  uso: <FaTachometerAlt size={24} className="text-sensor-uso" />,
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
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-3xl font-extrabold text-center mb-10 text-primary">
        Real-Time Sensor Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.keys(sensorData).map((room) => {
          const data = sensorData[room] || [];
          const lastValue = data.length ? data[data.length - 1].value : "--";

          return (
            <div
              key={room}
              style={{ borderColor: getSensorColor(room + "_light") }}
              className="rounded-xl shadow-lg bg-white p-6 border-2 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {SENSOR_ICONS[room]}
                  <h3 className="text-xl font-semibold">{room.toUpperCase()}</h3>
                </div>
                <span 
                style={{ backgroundColor: getSensorColor(room + "_light") }}
                className="px-3 py-1 text-sm font-medium rounded-full text-gray-700">
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
    proximidad: "#8C0060",      
    proximidad_light: "#D98CBF",
    nivel: "#005D80",           
    nivel_light: "#66B5CC",
    temperatura: "#FF9149",     
    temperatura_light: "#FFD1B0",
    uso: "#4CAF50",
    uso_light: "#A8E6A9",
    default: "#8884d8",
  };
  return colors[room] || colors.default;
}
