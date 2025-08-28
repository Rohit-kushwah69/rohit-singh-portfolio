import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function Register() {
  const [formData, setFormData] = useState({ name:"", email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/register", formData); // creates admin
      toast.success("Admin registered");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border p-6 bg-white shadow">
        <h2 className="text-2xl font-semibold text-center mb-4">Admin Register</h2>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm">Name</label>
            <input name="name" value={formData.name} onChange={handleChange}
              className="w-full border rounded-xl p-2" required />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <input type="email" name="email" value={formData.email}
              onChange={handleChange} className="w-full border rounded-xl p-2" required />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <input type="password" name="password" value={formData.password}
              onChange={handleChange} className="w-full border rounded-xl p-2" required />
          </div>
          <button className="w-full rounded-xl bg-blue-600 text-white py-2" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
          <p className="text-center text-sm">
            Already admin? <NavLink to="/login" className="underline">Login</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}
export default Register;
