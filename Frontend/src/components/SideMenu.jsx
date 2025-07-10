// SideMenu.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImage from "../assets/logo.png"; // Import the logo image

const navigation = [
  { name: "Dashboard", href: "/", icon: "🏠" },
  { name: "Inventory", href: "/inventory", icon: "📦" },
  { name: "Purchase Details", href: "/purchase-details", icon: "🛍️" },
  { name: "Sales", href: "/sales", icon: "💰" },
  { name: "Manage Store", href: "/manage-store", icon: "🏪" },
];

export default function SideMenu() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`bg-gray-800 text-white h-screen transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo and Toggle Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <img
            src={logoImage}
            alt="Logo"
            className={`h-8 w-8 transition-all duration-300 ${
              isOpen ? "mr-3" : "mr-0"
            }`}
            onError={(e) => {
              e.target.src = "/default-logo.png"; // Fallback image
              e.target.onerror = null;
            }}
          />
          {isOpen && (
            <span className="font-bold text-xl">Inventory</span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-gray-700 focus:outline-none"
        >
          {isOpen ? "←" : "→"}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center px-4 py-3 transition-colors duration-200
              ${
                location.pathname === item.href
                  ? "bg-gray-900 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
          >
            <span className="text-xl mr-4">{item.icon}</span>
            {isOpen && (
              <span className="text-sm font-medium">{item.name}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        {isOpen && (
          <div className="text-sm text-gray-400">
            <p>Inventory Management v1.0</p>
          </div>
        )}
      </div>
    </div>
  );
}