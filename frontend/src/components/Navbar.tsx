import React, { useState } from "react";
import NavIcon from "./NavIcon";
import MegaMenu from "./MegaMenu";
import { FaHome, FaChartBar, FaCog } from "react-icons/fa";

const NAV_ITEMS = [
  { icon: <FaHome />, label: "Dashboard", path: "/" },
  { icon: <FaChartBar />, label: "Analytics", path: "/analytics" },
  { icon: <FaCog />, label: "Settings", path: "/settings" },
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Navbar izquierda */}
          <div className="flex-shrink-0 font-bold text-xl text-blue-700">
            IoT Dashboard
          </div>

          {/* Navbar derecha */}
          <div className="flex items-center gap-4">
            <NavIcon icon={<FaHome />} label="Dashboard" onClick={toggleMenu} />
            <NavIcon icon={<FaChartBar />} label="Analytics" onClick={toggleMenu} />
            <NavIcon icon={<FaCog />} label="Settings" onClick={toggleMenu} />
          </div>
        </div>
      </div>

      {/* Mega Menu */}
      <MegaMenu isOpen={isOpen} routes={NAV_ITEMS} />
    </nav>
  );
}
