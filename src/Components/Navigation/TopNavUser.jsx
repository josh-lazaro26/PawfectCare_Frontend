import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PawfectCareLogo from "../../assets/User-Page-Image/PawfectCareLogo.svg";
import { Aperture, ChevronDown } from "lucide-react";
import { getApiBaseUrl } from "../../../../Backend/config/API_BASE_URL";

const TopNavUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const delayedNavigate = (path) => {
    setLoading(true); // start loading

    setTimeout(() => {
      navigate(path);
      setIsOpen(false);
      setLoading(false);
    }, 200);
  };

  const isActive = (path) => location.pathname === path;

  // Function to format name(s) to CamelCase
  const formatName = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Fetch logged-in user if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found.");
      setUser(null);
      return;
    }

    fetch(`${getApiBaseUrl()}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        localStorage.removeItem("token");
        setUser(null);
      });
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsDropdownOpen(false);
    navigate("/user/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full flex items-center px-4 py-2 md:px-10 md:py-3 z-50 bg-white shadow-md caret-transparent">
      {/* Left: Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/user/about")}
      >
        <img
          src={PawfectCareLogo}
          alt="Pawfect Care Logo"
          className="w-8 h-8 md:w-10 md:h-10"
        />
        <span className="text-lg md:text-2xl font-bold">Pawfect Care</span>
      </div>

      {/* Center: Navigation (desktop only) */}
      <nav className="hidden md:flex flex-grow justify-center gap-8 lg:gap-10 text-sm font-medium">
        <button
          onClick={() => delayedNavigate("/user/about")}
          className={`hover:text-[#ff7e67] transition-colors font-bold text-base md:text-lg ${
            isActive("/user/about") ? "underline" : ""
          }`}
        >
          About Us
        </button>
        <button
          onClick={() => delayedNavigate("/user/adoption")}
          className={`hover:text-[#ff7e67] transition-colors font-bold text-base md:text-lg ${
            isActive("/user/adoption") ? "underline" : ""
          }`}
        >
          Adoption
        </button>
        <button
          onClick={() => delayedNavigate("/user/booking")}
          className={`hover:text-[#ff7e67] transition-colors font-bold text-base md:text-lg ${
            isActive("/user/booking") ? "underline" : ""
          }`}
        >
          Book
        </button>
      </nav>

      {loading && (
        <div className="fixed top-0 left-0 w-full h-[3px] bg-gray-200 z-[9999]">
          <div className="h-full bg-[#ff7e67] animate-pulse w-full"></div>
        </div>
      )}

      {/* Right side: User + hamburger */}
      <div className="flex items-center gap-2 md:gap-4 ml-auto">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 py-2 md:px-6 md:py-3 transition text-sm md:text-base"
        >
          <span className="font-bold">
            {formatName(
              `${user?.first_name || "Guest"} ${user?.last_name || ""}`
            )}
          </span>
        </button>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          <svg
            className="w-6 h-6 md:w-7 md:h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isOpen
                  ? "M6 18L18 6M6 6l12 12" // X icon
                  : "M4 6h16M4 12h16M4 18h16" // hamburger
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="absolute top-14 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-3 py-4 md:hidden text-sm">
          <button
            onClick={() => delayedNavigate("/user/about")}
            className={`hover:text-[#ff7e67] transition-colors font-bold ${
              isActive("/user/about") ? "underline" : ""
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => delayedNavigate("/user/adoption")}
            className={`hover:text-[#ff7e67] transition-colors font-bold ${
              isActive("/user/adoption") ? "underline" : ""
            }`}
          >
            Adoption
          </button>
          <button
            onClick={() => delayedNavigate("/user/booking")}
            className={`hover:text-[#ff7e67] transition-colors font-bold ${
              isActive("/user/booking") ? "underline" : ""
            }`}
          >
            Book
          </button>
          {user ? (
            <button
              onClick={handleLogout}
              className="hover:text-[#ff7e67] transition-colors font-bold"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => navigate("/user/login")}
              className="hover:text-[#ff7e67] transition-colors font-bold"
            >
              Sign in
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default TopNavUser;
