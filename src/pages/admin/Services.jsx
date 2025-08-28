import React, { useEffect, useState } from "react";
import API from "../../services/api"; // axios instance
import { toast } from "react-toastify";

const Services = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    icon: "",
  });
  const [editingId, setEditingId] = useState(null);

  // 🔹 Get all services
  const fetchServices = async () => {
    try {
      const res = await API.get("/serviceDisplay");
      setServices(res.data.services || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch services");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 🔹 Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Submit form (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing service
        await API.put(`/serviceUpdate/${editingId}`, formData);
        toast.success("Service updated successfully!");
        setEditingId(null);
      } else {
        // Create new service
        await API.post("/serviceCreate", formData);
        toast.success("Service added successfully!");
      }

      setFormData({ title: "", desc: "", icon: "" });
      fetchServices();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save service");
    }
  };

  // 🔹 Delete service
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/serviceDelete/${id}`);
      toast.success("Service deleted");
      fetchServices();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete service");
    }
  };

  // 🔹 Edit service
  const handleEdit = (service) => {
    setFormData({
      title: service.title,
      desc: service.desc,
      icon: service.icon,
    });
    setEditingId(service._id);
  };

  // 🔹 Cancel editing
  const handleCancelEdit = () => {
    setFormData({ title: "", desc: "", icon: "" });
    setEditingId(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">⚙️ Manage Services</h1>

      {/* Add / Edit Service Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-4 mb-6"
      >
        <h2 className="text-lg font-semibold mb-3">
          {editingId ? "✏️ Edit Service" : "➕ Add New Service"}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Service Title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="icon"
            placeholder="Icon URL / Class"
            value={formData.icon}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <textarea
            name="desc"
            placeholder="Description"
            value={formData.desc}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
            rows="3"
            required
          ></textarea>
        </div>
        <div className="flex gap-3 mt-3">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editingId ? "Update Service" : "Add Service"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Service List */}
      <h2 className="text-xl font-semibold mb-2">📋 Service List</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Icon</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s._id} className="border">
              <td className="p-2 border">{s.title}</td>
              <td className="p-2 border">{s.desc}</td>
              <td className="p-2 border">{s.icon}</td>
              <td className="p-2 border flex gap-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Services;
