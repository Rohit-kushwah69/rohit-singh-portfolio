import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    quote: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch testimonials
  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await API.get("/testimonialDisplay");
      const data = res.data?.testimonials || [];
      setTestimonials(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // 🔹 Handle input
  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // 🔹 Add Testimonial
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("title", formData.title);
      form.append("quote", formData.quote);
      if (formData.image) form.append("image", formData.image);

      await API.post("/testimonialCreate", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Testimonial added successfully!");
      setFormData({ name: "", title: "", quote: "", image: null });
      setPreview(null);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to add testimonial");
    }
  };

  // 🔹 Delete Testimonial
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await API.delete(`/testimonialDelete/${id}`);
      toast.success("🗑️ Testimonial deleted");
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete testimonial");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        💬 Manage Testimonials
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 mb-8 border border-gray-100"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">➕ Add New Testimonial</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Client Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="text"
            name="title"
            placeholder="Client Title (e.g., CEO, Student)"
            value={formData.title}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <textarea
            name="quote"
            placeholder="Feedback"
            value={formData.quote}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
            rows="3"
            required
          ></textarea>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
          />
          {preview && (
            <div className="md:col-span-2">
              <img src={preview} alt="Preview" className="w-32 h-32 rounded-lg object-cover shadow" />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="mt-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white px-5 py-2 rounded-lg hover:opacity-90 transition font-medium shadow-md"
        >
          Add Testimonial
        </button>
      </form>

      {/* Testimonials List */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">📋 Testimonials</h2>

      {loading ? (
        <p className="text-gray-500">Loading testimonials...</p>
      ) : testimonials.length === 0 ? (
        <p className="text-gray-400 italic">No testimonials available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="bg-white border rounded-2xl shadow hover:shadow-lg transition p-5 flex flex-col justify-between"
            >
              <div>
                {t.image?.url && (
                  <img
                    src={t.image.url}
                    alt={t.name}
                    className="w-20 h-20 object-cover rounded-full mb-3 shadow"
                  />
                )}
                <h3 className="font-bold text-lg text-gray-800">{t.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{t.title || "—"}</p>
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                  {t.quote}
                </p>
              </div>
              <button
                onClick={() => handleDelete(t._id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Testimonials;
