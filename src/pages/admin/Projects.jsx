import React, { useEffect, useState } from "react";
import API from "../../services/api"; // axios instance
import { toast } from "react-toastify";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false); // fetch loader
  const [submitting, setSubmitting] = useState(false); // add/update loader
  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    tags: "",
    link: "",
    repo: "",
    image: null,
  });

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch all projects
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await API.get("/display");
      console.log("Projects API response:", res.data);

      if (res.data.success && Array.isArray(res.data.projects)) {
        setProjects(res.data.projects);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit form (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.tagline || !formData.tags || !formData.link || !formData.repo) {
      toast.error("All fields are required");
      return;
    }

    setSubmitting(true); // loader start

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("tagline", formData.tagline);
      data.append("tags", formData.tags);
      data.append("link", formData.link);
      data.append("repo", formData.repo);
      if (formData.image) data.append("image", formData.image);

      if (isEditing) {
        await API.put(`/update/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Project updated successfully!");
      } else {
        await API.post("/create", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Project added successfully!");
      }

      setFormData({
        title: "",
        tagline: "",
        tags: "",
        link: "",
        repo: "",
        image: null,
      });
      setIsEditing(false);
      setEditId(null);
      fetchProjects();
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      toast.error("Failed to save project");
    } finally {
      setSubmitting(false); // loader stop
    }
  };

  // Delete project
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await API.delete(`/delete/${id}`);
      toast.success("Project deleted");
      fetchProjects();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      toast.error("Failed to delete project");
    }
  };

  // Start editing
  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      tagline: project.tagline,
      tags: Array.isArray(project.tags) ? project.tags.join(",") : project.tags,
      link: project.link,
      repo: project.repo,
      image: null, // image reset, only update if uploading new
    });
    setIsEditing(true);
    setEditId(project._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📌 Manage Projects</h1>

      {/* Add/Edit Project Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-8"
        encType="multipart/form-data"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "✏️ Edit Project" : "➕ Add New Project"}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="tagline"
            placeholder="Tagline"
            value={formData.tagline}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="link"
            placeholder="Project Link"
            value={formData.link}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="repo"
            placeholder="Repository Link"
            value={formData.repo}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {isEditing ? "Updating..." : "Saving..."}
              </>
            ) : (
              isEditing ? "Update Project" : "Add Project"
            )}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditId(null);
                setFormData({
                  title: "",
                  tagline: "",
                  tags: "",
                  link: "",
                  repo: "",
                  image: null,
                });
              }}
              className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Project List */}
      <h2 className="text-2xl font-semibold mb-3">📋 Project List</h2>
      <div className="overflow-x-auto border rounded">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Tagline</th>
              <th className="p-3 border">Tags</th>
              <th className="p-3 border">Links</th>
              <th className="p-3 border">Image</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No projects found.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p._id} className="border hover:bg-gray-100 transition">
                  <td className="p-2 border">{p.title}</td>
                  <td className="p-2 border">{p.tagline}</td>
                  <td className="p-2 border">
                    {Array.isArray(p.tags) ? p.tags.join(", ") : p.tags}
                  </td>
                  <td className="p-2 border">
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 underline mr-2"
                    >
                      Live
                    </a>
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-500 underline"
                    >
                      Repo
                    </a>
                  </td>
                  <td className="p-2 border">
                    {p.image?.url ? (
                      <img
                        src={p.image.url}
                        alt={p.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-2 border flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Projects;
