import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SENSOR_ICONS } from "../utils/icons";
import { Sensor } from "../utils/sensor";
import IconSelector from "../components/IconSelector";
import { FaArrowLeft } from "react-icons/fa";

export default function NewSensorPage() {
  const [form, setForm] = useState({
    name: "",
    topic: "",
    unit: "",
    threshold_min: "",
    threshold_max: "",
    color: "#2563EB",
    icon: "thermometer",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name.startsWith("threshold_") ? Number(value) : value,
    }));
  }

  function handleIconSelect(value: string) {
    setForm((prev) => ({
      ...prev,
      icon: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("http://localhost:3001/api/sensors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      navigate("/sensors");
    } catch (err) {
      alert("Error al crear el sensor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 bg-background flex justify-center">
        <button
            onClick={() => navigate(-1)}
            className="absolute top-8 left-8 p-2 mt-15 rounded-full bg-blue-100 shadow hover:bg-blue-200 transition"
            title="Volver"
            >
            <FaArrowLeft className="text-primary text-3xl" />
        </button>
      <form
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-primary mb-2">Nuevo Sensor</h2>
        <input
          name="name"
          type="text"
          required
          placeholder="Nombre"
          className="border rounded-lg p-3"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="topic"
          type="text"
          required
          placeholder="Topic (ej: sensor/temperatura)"
          className="border rounded-lg p-3"
          value={form.topic}
          onChange={handleChange}
        />
        <input
          name="unit"
          type="text"
          placeholder="Unidad (ej: °C, %)"
          className="border rounded-lg p-3"
          value={form.unit}
          onChange={handleChange}
        />
        <div className="flex gap-4">
          <input
            name="threshold_min"
            type="number"
            placeholder="Alcance Mínimo"
            className="border rounded-lg p-3 w-1/2"
            value={form.threshold_min}
            onChange={handleChange}
          />
          <input
            name="threshold_max"
            type="number"
            placeholder="Alcance Máximo"
            className="border rounded-lg p-3 w-1/2"
            value={form.threshold_max}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-2">
            <div>
                <label className="block text-sm mb-1">Color</label>
                <input
                    name="color"
                    type="color"
                    className="w-12 h-12 p-0 border-none"
                    value={form.color}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label className="block text-sm mb-2">Icono</label>
                <IconSelector
                    value={form.icon}
                    onChange={handleIconSelect}
                    color={form.color}
                />
            </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-secondary transition"
        >
          {loading ? "Guardando..." : "Crear Sensor"}
        </button>
      </form>
    </div>
  );
}