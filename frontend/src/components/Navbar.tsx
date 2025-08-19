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
import { BiSolidReport } from "react-icons/bi";
import { RiSensorFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Inicio", icon: <FaHome />, path: "/" },
  { label: "Estadísticas", icon: <FaChartBar />, path: "/stats" },
  { label: "Sensores", icon: <RiSensorFill />, path: "/sensors" },
  { label: "Alertas", icon: <FaBell />, path: "/alerts" },
  { label: "Configuración", icon: <FaCog />, path: "/settings" },
  { label: "Informes", icon: <BiSolidReport />, path: "/reports" },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-gray-950 to-30% to-primary shadow-md fixed top-0 left-0 w-full z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Título */}
          <Link
            to="/"
            className="font-extrabold text-2xl font-serif tracking-wide bg-gradient-to-r to-white via-accent from-gray-400 bg-clip-text text-transparent flex items-center gap-2 cursor-pointer hover:underline"
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="h-8 w-8 rounded-full object-cover"
            />
            IoT Dashboard
          </Link>

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
      <MegaMenu isOpen={isOpen} routes={NAV_ITEMS} closeMenu={() => setIsOpen(false)} />
    </nav>
  );
}
