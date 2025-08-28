import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    level: "",
  });
  const [editingId, setEditingId] = useState(null);

  // 🔹 Fetch all skills
  const fetchSkills = async () => {
    try {
      const res = await API.get("/skillDisplay");
      setSkills(res.data.skills); // ✅ correct key
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch skills");
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Add or Update Skill
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/skillUpdate/${editingId}`, formData);
        toast.success("Skill updated successfully!");
        setEditingId(null);
      } else {
        await API.post("/skillCreate", formData);
        toast.success("Skill added successfully!");
      }
      setFormData({ name: "", level: "" });
      fetchSkills();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save skill");
    }
  };

  // 🔹 Edit Skill
  const handleEdit = (skill) => {
    setFormData({ name: skill.name, level: skill.level });
    setEditingId(skill._id);
  };

  // 🔹 Delete Skill
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/skillDelete/${id}`);
      toast.success("Skill deleted");
      fetchSkills();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete skill");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛠 Manage Skills</h1>

      {/* Add / Edit Skill Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-4 mb-6"
      >
        <h2 className="text-lg font-semibold mb-3">
          {editingId ? "✏️ Edit Skill" : "➕ Add New Skill"}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Skill Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="level"
            placeholder="Skill Level (0-100)"
            value={formData.level}
            onChange={handleChange}
            className="border p-2 rounded"
            min="0"
            max="100"
            required
          />
        </div>
        <button
          type="submit"
          className={`${
            editingId ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
          } text-white px-4 py-2 mt-3 rounded`}
        >
          {editingId ? "Update Skill" : "Add Skill"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormData({ name: "", level: "" });
            }}
            className="ml-3 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 mt-3 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Skills List */}
      <h2 className="text-xl font-semibold mb-2">📋 Skills List</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Level</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((s) => (
            <tr key={s._id} className="border">
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border w-1/2">
                <div className="w-full bg-gray-200 rounded">
                  <div
                    className="bg-green-600 text-xs text-white text-center rounded"
                    style={{ width: `${s.level}%` }}
                  >
                    {s.level}%
                  </div>
                </div>
              </td>
              <td className="p-2 border space-x-2">
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

export default Skills;