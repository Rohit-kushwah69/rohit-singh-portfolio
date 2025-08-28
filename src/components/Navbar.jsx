// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Moon, Sun, LogOut } from "lucide-react"; // install: npm install lucide-react

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Apply dark mode to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-900 dark:text-white p-4 shadow-md rounded-xl mb-6">
      {/* Left */}
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-9 h-9 rounded-full border"
          />
          <span className="hidden md:inline">Admin</span>
        </div>

        {/* Logout */}
        <button className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
