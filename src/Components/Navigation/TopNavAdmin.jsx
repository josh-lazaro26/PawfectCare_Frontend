// src/components/TopNav.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OVSLogo from "../../assets/Admin-Page-Image/OVSLogo.png";

function TopNavAdmin({ handleSignOut }) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Pets", path: "/admin/pet" },
    { name: "Adoptions", path: "/admin/adoption" },
    { name: "Appointments", path: "/admin/appointment" },
    { name: "Messages", path: "/admin/message" },
  ];

  return (
    <div className="bg-white p-4 shadow rounded-md mb-6">
      {/* Top Row: Logo + Title + Sign Out */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img
            className="w-16 h-16 rounded-full mr-3"
            src={OVSLogo}
            alt="Logo"
          />
          <h1 className="md:text-3xl sm:text-xl font-libre text-gray-800">
            Tacurong City Veterinary Services Office
          </h1>
        </div>
        <button
          onClick={handleSignOut}
          className="px-4 py-3 bg-red-500 text-white font-bold rounded-md shadow hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>

      {/* Bottom Row: Navigation */}
      <nav className="flex space-x-4 border-t pt-3 font-roboto">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => navigate(tab.path)}
            className={`px-5 py-3 rounded-md font-medium transition ${
              location.pathname.startsWith(tab.path)
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default TopNavAdmin;
