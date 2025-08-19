import { Sensor } from "../utils/sensor";
import { SENSOR_ICONS } from "../utils/icons";
import { FaBookmark } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SensorCard({ sensor }: { sensor: Sensor }) {
  const [favorito, setFavorito] = useState(false);

  return (
    <Link to={`/sensors/${sensor.id}`} className="block">
      <div
        style={{ borderColor: sensor.color }}
        className="relative rounded-xl shadow-lg bg-white p-6 border-2 flex flex-col gap-4 transition
          hover:shadow-2xl hover:border-primary hover:bg-gray-100 cursor-pointer"
      >
        {/* Botón de “favorito” en la esquina superior derecha */}
        <button
          onClick={() => setFavorito(!favorito)}
          className={`absolute top-2 right-2 transition-colors duration-200 ${
            favorito
              ? "text-amber-300 hover:text-amber-500"
              : "text-gray-300 hover:text-yellow-400"
          }`}
          aria-label="Marcar como favorito"
        >
          <FaBookmark size={20} />
        </button>

        <div className="flex items-center gap-3 mb-2">
          {SENSOR_ICONS[sensor.icon]?.(sensor.color, 32)}
          <h2 className="text-xl font-semibold text-primary">{sensor.name}</h2>
        </div>
        <div className="space-y-1">
          <span className="block text-sm text-gray-500">ID: {sensor.id}</span>
          <span className="block text-sm text-gray-500">
            Tipo: {sensor.topic}
          </span>
          <span className="block text-sm text-gray-500">
            Unidad: {sensor.unit}
          </span>
          <span className="block text-sm text-gray-500">
            Umbral:{" "}
            <span className="font-semibold">{sensor.threshold_min}</span> -{" "}
            <span className="font-semibold">{sensor.threshold_max}</span>
          </span>
          <span className="block text-sm text-gray-500">
            Creado:{" "}
            {new Date(sensor.created_at).toLocaleString()}
          </span>
        </div>
        <span
          style={{ backgroundColor: sensor.color }}
          className="px-3 py-1 text-sm font-medium rounded-full text-white w-fit"
        >
          {sensor.color}
        </span>
      </div>
    </Link>
  );
}