import React from "react";

export default function NavIcon({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
    >
      <div className="text-2xl">{icon}</div>
      <span className="text-sm mt-1">{label}</span>
    </button>
  );
}
