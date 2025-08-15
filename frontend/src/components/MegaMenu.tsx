import React from "react";
import { Link } from "react-router-dom";

export default function MegaMenu({ isOpen, routes }) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 p-6 z-50">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {routes.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className="p-4 rounded-lg hover:bg-gray-100 transition"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
