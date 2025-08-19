// src/utils/icons.tsx
import {
  FaThermometerHalf,
  FaTachometerAlt,
  FaWater,
  FaRulerVertical,
  FaBolt,
  FaTint,
  FaWind,
  FaLightbulb,
  FaBatteryHalf,
  FaSignal,
  FaFire,
  FaLeaf,
  FaEye,
  FaMicrochip,
  FaWifi,
  FaCloud,
  FaGlobe,
} from "react-icons/fa";
import { JSX } from "react/jsx-runtime";

// Diccionario de iconos
export const SENSOR_ICONS: Record<string, (color?: string, size?: number) => JSX.Element> = {
  thermometer: (color = "#1d4ed8", size = 28) => <FaThermometerHalf size={size} style={{ color }} />,
  tachometer: (color = "#1d4ed8", size = 28) => <FaTachometerAlt size={size} style={{ color }} />,
  water: (color = "#1d4ed8", size = 28) => <FaWater size={size} style={{ color }} />,
  ruler: (color = "#1d4ed8", size = 28) => <FaRulerVertical size={size} style={{ color }} />,
  bolt: (color = "#f59e42", size = 28) => <FaBolt size={size} style={{ color }} />,           // Voltaje / energía
  tint: (color = "#2563eb", size = 28) => <FaTint size={size} style={{ color }} />,           // Humedad
  wind: (color = "#38bdf8", size = 28) => <FaWind size={size} style={{ color }} />,           // Viento / flujo de aire
  lightbulb: (color = "#fde047", size = 28) => <FaLightbulb size={size} style={{ color }} />, // Luz
  signal: (color = "#a21caf", size = 28) => <FaSignal size={size} style={{ color }} />,       // Señal / intensidad
  fire: (color = "#ef4444", size = 28) => <FaFire size={size} style={{ color }} />,           // Fuego / temperatura alta
  leaf: (color = "#16a34a", size = 28) => <FaLeaf size={size} style={{ color }} />,           // CO2 / ambiental
  eye: (color = "#64748b", size = 28) => <FaEye size={size} style={{ color }} />,             // Proximidad / visión
  microchip: (color = "#0ea5e9", size = 28) => <FaMicrochip size={size} style={{ color }} />, // Digital / hardware
  wifi: (color = "#2563eb", size = 28) => <FaWifi size={size} style={{ color }} />,           // Conectividad
  cloud: (color = "#38bdf8", size = 28) => <FaCloud size={size} style={{ color }} />,         // Clima / nube
  globe: (color = "#0ea5e9", size = 28) => <FaGlobe size={size} style={{ color }} />,         // Ubicación / geolocalización
};
