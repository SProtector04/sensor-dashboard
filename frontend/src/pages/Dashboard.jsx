import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SensorChart from "../components/SensorChart";
import { createWSClient } from "../services/wsClient";
import { FaThermometerHalf, FaTachometerAlt, FaWater, FaRulerVertical } from "react-icons/fa";

// Mapeo de iconos según "name" o "topic"
const SENSOR_ICONS = {
  temperatura: (color) => <FaThermometerHalf size={24} style={{ color }} />,
  uso: (color) => <FaTachometerAlt size={24} style={{ color }} />,
  nivel: (color) => <FaWater size={24} style={{ color }} />,
  proximidad: (color) => <FaRulerVertical size={24} style={{ color }} />,
};

export default function Dashboard() {
  const [sensors, setSensors] = useState([]);   // lista de sensores desde DB
  const [sensorData, setSensorData] = useState({}); // series de tiempo
  const wsRef = useRef(null);
  // 1. Pedir metadata de sensores
  useEffect(() => {
    fetch("http://localhost:3001/api/sensors")
      .then((res) => res.json())
      .then((data) => {
        setSensors(data);
        // inicializar estructura para cada sensor
        const init = {};
        data.forEach((s) => (init[s.id] = []));
        setSensorData(init);
      })
      .catch((err) => console.error("Error cargando sensores:", err));
  }, []);

  // 2. Conectar WebSocket y recibir datos
  useEffect(() => {
    wsRef.current = createWSClient({
      url: "ws://localhost:3001",
      onMessage: (event) => {
        try {
          const data = JSON.parse(event.data);
          const { id, value, time } = data;

          setSensorData((prev) => {
            const existing = prev[id] || [];
            return {
              ...prev,
              [id]: [
                ...existing.slice(-50), // mantener solo los últimos 50 y agregar el nuevo para tener 51
                { time: Date.parse(time) / 1000, value },
              ],
            };
          });
        } catch (e) {
          console.error("Error parseando mensaje WS:", e);
        }
      },
    });

    return () => wsRef.current?.close();
  }, []);

  // 3. Cargar datos históricos
  useEffect(() => {
    if (sensors.length === 0) return;
    sensors.forEach((sensor) => {
      fetch(`http://localhost:3001/api/sensors/${sensor.id}/data?range=day`)
        .then((res) => res.json())
        .then((historical) => {
          setSensorData((prev) => ({
            ...prev,
            [sensor.id]: historical.slice(-10),
          }));
        })
        .catch((err) => console.error(`Error cargando datos históricos para sensor ${sensor.id}:`, err));
    });
  }, [sensors]);

  // 4. Render
  return (
    
    <div className="p-6 bg-white min-h-screen">
      <div className="grid grid-cols-4 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:col-span-3 md:col-span-4 sm:col-span-4">
        {sensors.map((sensor) => {
          const data = sensorData[sensor.id] || [];
          const lastValue = data.length ? data[data.length - 1].value : "--";
          return (
            <div
              key={sensor.id}
              style={{ borderColor: sensor.color }}
              className="rounded-xl shadow-lg bg-white p-6 border-2"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                {SENSOR_ICONS[sensor.topic.toLowerCase().split("/")[1]]
                  ? SENSOR_ICONS[sensor.topic.toLowerCase().split("/")[1]](sensor.color)
                  : null}
                <h3 className="text-xl font-semibold">{sensor.name}</h3>
              </div>
                <span
                  style={{ backgroundColor: sensor.color }}
                  className="px-3 py-1 text-sm font-medium rounded-full text-white"
                >
                  Último valor: {lastValue} {sensor.unit}
                </span>
              </div>

              <SensorChart
                data={data}
                title={`${sensor.name}`}
                color={sensor.color}
                width="100%"
                height={150}
                unit={sensor.unit}
              />
            </div>
          );
        })}
      </div>
      <div className="lg:col-span-1 space-y-4 md:col-span-4 sm:col-span-4"> 
        <div className="bg-white shadow p-6 rounded-xl flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Resumen</h2>
          <p className="text-sm text-gray-600">{sensors.length} sensores activos</p>
          <Link
            to="/sensors"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-secondary transition"
          >
            Ver Sensores
          </Link>
        </div>
          <div className="bg-white shadow p-4 rounded-xl"> 
            <h2 className="text-lg font-semibold">Tendencias</h2> {/* Mini-gráfica */} 
          </div> 
          <div className="bg-white shadow p-4 rounded-xl"> 
            <h2 className="text-lg font-semibold">Últimas alertas</h2> 
            <ul className="text-sm"> 
              <li>Temperatura alta</li> 
              <li>Bajo nivel de agua</li> 
            </ul> 
          </div> 
        </div>
      </div>
      
    </div>
  );
}
