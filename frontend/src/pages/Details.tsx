import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SensorChart from "../components/SensorChart";
import { FaArrowLeft, FaBookmark, FaTrashAlt, FaEdit } from "react-icons/fa";
import { Sensor } from "../utils/sensor";
import SensorDetailsCard from "../components/SensorDetailsCard";

type SensorDataPoint = {
  time: number;
  value: number;
};

export default function SensorDetailPage() {
  const { id } = useParams(); // ID del sensor desde la ruta
  const navigate = useNavigate();
  const [sensor, setSensor] = useState<Sensor | null>(null);
  const [historicalData, setHistoricalData] = useState<SensorDataPoint[]>([]);
  const [liveData, setLiveData] = useState<SensorDataPoint[]>([]);
  const [range, setRange] = useState<"Live" | "day" | "week" | "month">("Live");
  const [favorito, setFavorito] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Cargar información del sensor
  useEffect(() => {
    fetch(`http://localhost:3001/api/sensors/${id}`)
      .then((res) => res.json())
      .then(setSensor)
      .catch((err) => console.error("Error cargando sensor:", err));
  }, [id]);

  useEffect(() => {
  if (!sensor) return;

  // Solo para Live
  if (range === "Live") {
      fetch(`http://localhost:3001/api/sensors/${sensor.id}/data?range=day`)
        .then(res => res.json())
        .then((historical) => {
          // Tomar los últimos 10 puntos
          const lastPoints = historical.slice(-10);
          setLiveData(lastPoints);
        })
        .catch(err => console.error("Error cargando datos históricos para Live:", err));
    }
  }, [sensor, range]);

  // WebSocket para datos en tiempo real
  useEffect(() => {
    if (!sensor || range !== "Live") return;

    wsRef.current = new WebSocket("ws://localhost:3001");
    wsRef.current.onopen = () => console.log("WebSocket conectado");
    wsRef.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.topic === sensor.topic) {
          setLiveData(prev => [...prev.slice(-99), { time: Date.parse(msg.time)/1000, value: msg.value }]);
        }
      } catch (e) {
        console.error("Error parseando WebSocket:", e);
      }
    };
    wsRef.current.onerror = (err) => console.error("WebSocket error:", err);

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current.close();
    };
  }, [sensor, range]);

  // Cargar datos históricos
  useEffect(() => {
    if (!sensor) return;
    if (range === "Live") return; // Para "Live" usas WebSocket

    fetch(`http://localhost:3001/api/sensors/${sensor.id}/data?range=${range}`)
      .then(res => res.json())
      .then(setHistoricalData)
      .catch(err => console.error("Error cargando datos históricos:", err));
  }, [sensor, range]);

  if (!sensor) return <p className="p-8">Cargando sensor...</p>;

  return (
    <div className="p-8 min-h-screen bg-background relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 p-2 rounded-full bg-white shadow hover:bg-blue-50 transition"
        title="Volver"
      >
        <FaArrowLeft className="text-primary text-xl" />
      </button>
      <div className="flex items-center justify-between mb-6 ml-14">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          {sensor.name}
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFavorito(!favorito)}
            className={`text-xl transition-colors duration-200 ${
              favorito ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"
            }`}
            aria-label="Marcar como favorito"
          >
            <FaBookmark size={40}/>
          </button>
          <button
            onClick={() => navigate(`/sensors/${sensor.id}/edit`)}
            className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
            aria-label="Editar sensor"
          >
            <FaEdit size={28} />
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
            aria-label="Borrar sensor"
          >
            <FaTrashAlt size={28} />
          </button>
        </div>
      </div>

      {showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center gap-6">
      <FaTrashAlt className="text-red-500 text-4xl mb-2" />
      <h2 className="text-xl font-bold text-gray-800 mb-2">¿Borrar sensor?</h2>
      <p className="text-gray-600 text-center mb-4">
        Esta acción no se puede deshacer. ¿Seguro que quieres borrar el sensor <span className='font-semibold'>{sensor.name}</span>?
      </p>
      <div className="flex gap-4">
        <button
          onClick={async () => {
            try {
              await fetch(`http://localhost:3001/api/sensors/${sensor.id}`, {
                method: "DELETE",
              });
              setShowDeleteModal(false);
              navigate("/sensors");
            } catch (err) {
              alert("Error al borrar el sensor");
            }
          }}
          className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-700 transition"
        >
          Sí, borrar
        </button>
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

      <div className=" ml-10 mb-4 flex gap-2">
        {["Live", "day", "week", "month"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r as "Live" | "day" | "week" | "month")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              range === r ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {r === "Live" ? "Live" : `Last ${r}`}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full">
          <SensorChart
            data={range === "Live" ? liveData : historicalData}
            title={`${sensor.name}`}
            color={sensor.color}
            width="100%"
            height={300}
            unit={sensor.unit}
          />
        </div>
        <div className="w-full lg:w-[400px]">
          <SensorDetailsCard sensor={sensor} />
        </div>
      </div>
    </div>
  );
}
