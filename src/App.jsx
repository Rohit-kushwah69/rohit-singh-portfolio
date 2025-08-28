import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";   // ✅ auth context provider
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ role-based protection

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardHome from "./pages/admin/DashboardHome";
import Projects from "./pages/admin/Projects";
import Services from "./pages/admin/Services";
import Skills from "./pages/admin/Skills";
import Testimonials from "./pages/admin/Testimonials";
import Experience from "./pages/admin/Experience";
import Contacts from "./pages/admin/Contacts";
import Hero from "./pages/admin/Hero";
import Social from "./pages/admin/Social";
import ContactInfo from "./pages/admin/ContactInfo";
import AboutInfo from "./pages/admin/AboutInfo";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public/Home Page */}
          <Route path="/" element={<Home />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ Admin Dashboard (Protected with nested routes) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="projects" element={<Projects />} />
            <Route path="services" element={<Services />} />
            <Route path="skills" element={<Skills />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="experience" element={<Experience />} />
            <Route path="contactInfo" element={<ContactInfo />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="hero" element={<Hero />} />
            <Route path="social" element={<Social />} />
            <Route path="aboutInfo" element={<AboutInfo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
