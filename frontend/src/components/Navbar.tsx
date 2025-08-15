import React, { useState } from "react";
import MegaMenu from "./MegaMenu";
import {
  FaBars,
  FaHome,
  FaChartBar,
  FaCog,
  FaBell,
  FaRobot,
} from "react-icons/fa";

const NAV_ITEMS = [
  { label: "Inicio", icon: <FaHome />, path: "/" },
  { label: "Estadísticas", icon: <FaChartBar />, path: "/stats" },
  { label: "Sensores", icon: <FaRobot />, path: "/sensors" },
  { label: "Alertas", icon: <FaBell />, path: "/alerts" },
  { label: "Configuración", icon: <FaCog />, path: "/settings" },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-primary to-secondary shadow-md fixed top-0 left-0 w-full z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Título */}
          <span className="font-extrabold text-2xl font-serif tracking-wide bg-gradient-to-r from-white via-accent to-gray-500 bg-clip-text text-transparent">
            IoT Dashboard
          </span>

          {/* Botón de menú */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-white hover:text-highlight p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:bg-white/10 hover:cursor-pointer"
            aria-label="Abrir menú"
          >
            <FaBars size={24} />
            <span className="hidden sm:inline font-medium">Menú</span>
          </button>
        </div>
      </div>

      {/* Menú desplegable */}
      <MegaMenu isOpen={isOpen} routes={NAV_ITEMS} />
    </nav>
  );
}
