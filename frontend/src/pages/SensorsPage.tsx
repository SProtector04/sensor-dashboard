import { useEffect, useState } from "react";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import SensorCard from "../components/SensorCard";
import { Sensor } from "../utils/sensor";
import { useNavigate } from "react-router-dom";


export default function SensorsPage() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/sensors")
      .then((res) => res.json())
      .then(setSensors)
      .catch((err) => console.error("Error cargando sensores:", err));
  }, []);

  

  return (
    <div className="p-8 min-h-screen bg-background">
      <button
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 p-2 mt-15 rounded-full bg-blue-100 shadow hover:bg-blue-200 transition"
          title="Volver"
          >
          <FaArrowLeft className="text-primary text-3xl" />
      </button>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl ml-10 font-bold text-primary">Gestión de Sensores</h1>
        <Link
          to="/sensors/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-secondary transition"
        >
          <FaPlus />
          Añadir Sensor
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {sensors.map((sensor) => (
          <SensorCard key={sensor.id} sensor={sensor} />
        ))}
      </div>
    </div>
  );
}
