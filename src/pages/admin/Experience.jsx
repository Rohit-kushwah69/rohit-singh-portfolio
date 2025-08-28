// Experience.jsx
import React, { useEffect, useState } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion"; // 👑 for smooth animations

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    period: "",
    points: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all experiences
  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const res = await API.get("/experienceDisplay");
      const data = res.data?.experiences || [];
      setExperiences(data);
    } catch (err) {
      toast.error("Failed to fetch experiences!");
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or Edit Experience
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      points: formData.points.split(",").map((p) => p.trim()),
    };

    try {
      if (editingId) {
        await API.put(`/experienceUpdate/${editingId}`, payload);
        toast.success("Experience updated successfully!");
        setEditingId(null);
      } else {
        await API.post("/experienceCreate", payload);
        toast.success("Experience added successfully!");
      }
      setFormData({ role: "", company: "", period: "", points: "" });
      fetchExperiences();
    } catch (err) {
      toast.error("Error saving experience!");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) return;
    try {
      await API.delete(`/experienceDelete/${id}`);
      toast.success("Experience deleted!");
      fetchExperiences();
    } catch (err) {
      toast.error("Failed to delete experience!");
    }
  };

  // Edit
  const handleEdit = (exp) => {
    setFormData({
      role: exp.role,
      company: exp.company,
      period: exp.period,
      points: exp.points.join(", "),
    });
    setEditingId(exp._id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        🚀 Experience Manager
      </h2>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="mb-10 border p-6 rounded-2xl shadow-lg bg-white space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="text"
            name="period"
            placeholder="Period (e.g. 2023 - Present)"
            value={formData.period}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <textarea
            name="points"
            placeholder="Points (comma separated)"
            value={formData.points}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
            rows="3"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow hover:opacity-90 transition-all"
        >
          {editingId ? "Update Experience" : "Add Experience"}
        </button>
      </motion.form>

      {/* List */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : experiences.length === 0 ? (
        <p className="text-gray-500 text-center">No experiences found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {experiences.map((exp) => (
            <motion.div
              key={exp._id}
              className="border p-6 rounded-2xl shadow-md bg-white hover:shadow-xl transition transform hover:-translate-y-1"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="font-bold text-xl text-blue-700">{exp.role}</h3>
              <p className="italic text-gray-600">{exp.company}</p>
              <p className="text-sm text-gray-500 mb-3">{exp.period}</p>
              <ul className="list-disc ml-5 space-y-1 text-gray-700">
                {exp.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>

              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => handleEdit(exp)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Experience;
