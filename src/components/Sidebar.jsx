// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();

  const menu = [
    { name: "Services", path: "/services" },
    { name: "Skills", path: "/skills" },
    { name: "Testimonials", path: "/testimonials" },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">Dashboard</h1>
      <ul className="space-y-4">
        {menu.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block px-4 py-2 rounded ${
                pathname === item.path ? "bg-blue-500" : "hover:bg-gray-700"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
