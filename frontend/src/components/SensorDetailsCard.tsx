import { SENSOR_ICONS } from "../utils/icons";
import { Sensor } from "../utils/sensor";

export default function SensorDetailsCard({ sensor }: { sensor: Sensor }) {
  return (
    <div className="mt-8 mx-auto max-w-xl bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-xl" style={{ backgroundColor: sensor.color + "22" }}>
          {SENSOR_ICONS[sensor.icon]?.(sensor.color, 40)}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary">{sensor.name}</h2>
          <span className="text-sm text-gray-500">{sensor.topic}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-gray-700">ID</span>
          <span className="text-gray-600">{sensor.id}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-gray-700">Unidad</span>
          <span className="text-gray-600">{sensor.unit || "—"}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-gray-700">Umbral</span>
          <span className="text-gray-600">
            {sensor.threshold_min} - {sensor.threshold_max}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-gray-700">Creado</span>
          <span className="text-gray-600">{new Date(sensor.created_at).toLocaleString()}</span>
        </div>
      </div>
      <div className="border-t pt-4 mt-2 space-y-2 text-sm">
        <div>
          <span className="font-semibold text-gray-700">Color:</span>
          <span
            className="inline-block ml-2 px-2 py-1 rounded text-white"
            style={{ backgroundColor: sensor.color }}
          >
            {sensor.color}
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Icono:</span>
          <span className="inline-block ml-2 align-middle">
            {SENSOR_ICONS[sensor.icon]?.(sensor.color, 24)}
          </span>
          <span className="ml-2 text-gray-600">{sensor.icon}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Topic MQTT:</span>
          <span className="ml-2 text-gray-600">{sensor.topic}</span>
        </div>
        {/* Puedes agregar más campos aquí si tu modelo tiene más información */}
      </div>
    </div>
  );
}