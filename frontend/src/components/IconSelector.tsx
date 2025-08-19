import { useState, useRef, useEffect } from "react";
import { SENSOR_ICONS } from "../utils/icons";

export default function IconSelector({ value, onChange, color = "black" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      {/* Selector que abre el modal */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 p-2 border rounded-lg"
      >
        {value ? SENSOR_ICONS[value](color, 40) : <span>Selecciona un ícono</span>}
      </button>

      {/* Modal pequeño */}
      {open && (
        <div className="absolute z-50 mt-2 p-4 bg-white border rounded-lg shadow-lg max-w-md">
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(SENSOR_ICONS).map(([key, IconFn]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onChange(key);
                  setOpen(false);
                }}
                className={`p-2 rounded-lg border transition flex flex-col items-center ${
                  value === key
                    ? "border-primary bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                {IconFn(color, 32)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
