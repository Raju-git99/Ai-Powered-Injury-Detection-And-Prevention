import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authApi";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  
  // Initialize state from localStorage so the theme persists on refresh
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <nav className=" dark:bg-slate-900 shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50 border-b dark:border-slate-800 transition-colors duration-300">
      <h1
        className="text-xl font-bold cursor-pointer dark:text-white"
        onClick={() => navigate("/dashboard")}
      >
        AI Injury Detection
      </h1>

      <div className="flex gap-6 items-center">
        {/* 
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:ring-2 ring-indigo-400 transition-all"
          title="Toggle Dark Mode"
        >
          {darkMode ? "🌙" : "☀️"}
        </button> */}

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${
              isActive ? "text-blue-600" : "text-gray-700 dark:text-slate-300 hover:text-blue-500"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${
              isActive ? "text-blue-600" : "text-gray-700 dark:text-slate-300 hover:text-blue-500"
            }`
          }
        >
          History
        </NavLink>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition-all text-sm font-bold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;