import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function MegaMenu({ isOpen, routes, closeMenu }) {
  const [visible, setVisible] = useState(isOpen);

  // Controla animación de salida
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      // Espera 300ms (duración de transición) antes de ocultar
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div
      className={`absolute top-full left-0 w-full bg-white shadow-lg border-t border-blue-200 p-8 z-50
        transform transition-all duration-300
        ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {routes.map(({ path, label, icon }) => (
          <Link
            key={path}
            to={path}
            onClick={closeMenu}
            className="flex items-center gap-3 p-5 rounded-xl bg-blue-50 hover:bg-blue-100 hover:shadow-xl transition-all duration-200 border border-blue-100"
          >
            <span className="text-blue-700 text-2xl">{icon}</span>
            <span className="font-semibold text-blue-900 text-lg">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
