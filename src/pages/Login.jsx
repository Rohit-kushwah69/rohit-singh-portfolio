import React, { useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      API.post("/login", formData);
      const userData = {
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        isAuthenticated: true,
      };
      setUser(userData);
      toast.success("Login successful");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border p-6 bg-white shadow">
        <h2 className="text-2xl font-semibold text-center mb-4">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm">Email</label>
            <input
              type="email" name="email" value={formData.email}
              onChange={handleChange} required
              className="w-full border rounded-xl p-2"
            />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input
              type="password" name="password" value={formData.password}
              onChange={handleChange} required
              className="w-full border rounded-xl p-2"
            />
          </div>
          <button
            className="w-full rounded-xl bg-blue-600 text-white py-2"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-center text-sm">
            Need an account? <NavLink to="/register" className="underline">Register</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
