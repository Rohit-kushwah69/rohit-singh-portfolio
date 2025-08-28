import React, { useContext, useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";
import {
  Menu, X, LayoutDashboard, FolderKanban, Wrench, User,
  Layers, MessageSquare, BriefcaseBusiness, Phone, Share2,Info
} from "lucide-react";

const AdminDashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // auth guard
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // route change -> close mobile sidebar
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const logout = async () => {
    await API.post("/logout", {}, { withCredentials: true });
    setUser(null);
    navigate("/login");
  };

  if (!user) return null;

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/admin/hero", label: "Hero", icon: <User size={18} /> },
    { to: "/admin/aboutInfo", label: "About", icon: < Info size={18} /> },
    { to: "/admin/projects", label: "Projects", icon: <FolderKanban size={18} /> },
    { to: "/admin/services", label: "Services", icon: <Wrench size={18} /> },
    { to: "/admin/skills", label: "Skills", icon: <Layers size={18} /> },
    { to: "/admin/testimonials", label: "Testimonials", icon: <MessageSquare size={18} /> },
    { to: "/admin/experience", label: "Experience", icon: <BriefcaseBusiness size={18} /> },
    { to: "/admin/social", label: "Social Links", icon: <Share2 size={18} /> },
    { to: "/admin/contacts", label: "Contacts", icon: <Phone size={18} /> },
    { to: "/admin/contactInfo", label: "Contact Info", icon: <Phone size={18} /> },
  ];


  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Overlay for mobile/tablet */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-full lg:h-screen w-72 bg-gray-900 text-white
  transition-transform duration-300 ease-in-out
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 lg:justify-center lg:py-6">
          <h2 className="text-xl font-semibold">Admin Panel</h2>
          <button
            className="lg:hidden p-2 rounded hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-9rem)]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-3 px-3 py-2 rounded-lg transition",
                  isActive
                    ? "bg-yellow-400/20 text-yellow-300"
                    : "text-gray-200 hover:bg-white/10 hover:text-white",
                ].join(" ")
              }
              end={item.to.endsWith("/dashboard")}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </aside>


      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar (mobile/tablet) */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="h-14 px-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
              aria-label="Open sidebar"
              aria-expanded={sidebarOpen}
            >
              <Menu />
            </button>
            <h1 className="text-base font-semibold">Admin Dashboard</h1>
            <span className="w-9" /> {/* spacer */}
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
