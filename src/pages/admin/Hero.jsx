import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";

const Hero = () => {
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        description: "",
        skills: "",
        stats: "",
        image: null,
    });

    const [loading, setLoading] = useState(false);
    const [hero, setHero] = useState(null);

    // fetch hero
    const fetchHero = async () => {
        try {
            const res = await API.get("/heroGet");
            if (res.data.success && res.data.hero) {
                setHero(res.data.hero);

                // ✅ pre-fill form if hero already exists
                setFormData({
                    name: res.data.hero.name || "",
                    title: res.data.hero.title || "",
                    description: res.data.hero.description || "",
                    skills: res.data.hero.skills?.join(", ") || "",
                    stats: JSON.stringify(res.data.hero.stats || []),
                    image: null,
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch hero");
        }
    };

    useEffect(() => {
        fetchHero();
    }, []);

    // handle input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // handle file upload
    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    // submit form (create or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("skills", JSON.stringify(formData.skills.split(",").map(s => s.trim())));
            data.append("stats", formData.stats);
            if (formData.image) data.append("image", formData.image);

            let res;
            if (hero?._id) {
                res = await API.put(`/heroUpdate/${hero._id}`, data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                res = await API.post("/heroCreate", data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            if (res.data.success) {
                toast.success(hero?._id ? "Hero updated successfully!" : "Hero created successfully!");
                fetchHero();
            } else {
                toast.error(res.data.message || "Something went wrong");
            }
        } catch (error) {
            console.error(error);
            toast.error("API error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
            {/* Form */}
            <div className="bg-white shadow-xl border rounded-2xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    {hero?._id ? "Update Hero ✨" : "Create Hero 🚀"}
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            rows="4"
                            required
                        />
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
                        <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="React, Node.js, MongoDB"
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Stats */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Stats (JSON)</label>
                        <textarea
                            name="stats"
                            value={formData.stats}
                            onChange={handleChange}
                            placeholder='[{"label":"Projects","value":"20+"}]'
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            rows="3"
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Image</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full border rounded-lg p-3"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg font-semibold shadow-lg flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading && (
                                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                            )}
                            {loading ? "Saving..." : hero?._id ? "Update Hero" : "Save Hero"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Hero Preview */}
            {hero && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg rounded-2xl p-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-700">🌟 Current Hero</h2>
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        {hero.image?.url && (
                            <img
                                src={hero.image.url}
                                alt={hero.name}
                                className="w-40 h-40 object-cover rounded-xl shadow-md hover:scale-105 transition"
                            />
                        )}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{hero.name}</h3>
                            <p className="text-sm text-blue-600">{hero.title}</p>
                            <p className="mt-3 text-gray-600">{hero.description}</p>

                            <div className="mt-3">
                                <strong className="text-gray-700">Skills:</strong>{" "}
                                {hero.skills?.length ? (
                                    <span className="text-gray-600">{hero.skills.join(", ")}</span>
                                ) : (
                                    "None"
                                )}
                            </div>

                            <div className="mt-3">
                                <strong className="text-gray-700">Stats:</strong>
                                <ul className="list-disc ml-6 text-gray-600">
                                    {hero.stats?.map((s, i) => (
                                        <li key={i}>{s.label}: {s.value}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hero;
