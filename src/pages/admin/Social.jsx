import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../services/api";

function Social() {
  const [links, setLinks] = useState({
    github: "",
    linkedin: "",
    instagram: "",
    whatsapp: "",
    x: "", // ✅ Added X link
  });
  const [loading, setLoading] = useState(false);

  // Fetch existing links
  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await API.get("/socialDisplay");
      setLinks(res.data.socials || {});
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // Update links
  const handleUpdate = async (e) => {
    e.preventDefault();
    const { github, linkedin, instagram, whatsapp, x } = links;

    if (!github || !linkedin || !instagram || !whatsapp || !x) {
      return toast.error("All 5 links are required");
    }

    try {
      await API.put("/socialUpdate", { github, linkedin, instagram, whatsapp, x });
      toast.success("Social links updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update links");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Social Links</h2>

      <form onSubmit={handleUpdate} className="space-y-4 bg-gray-50 p-4 rounded-xl shadow">
        {["github", "linkedin", "instagram", "whatsapp", "x"].map((key) => (
          <input
            key={key}
            type="text"
            placeholder={`Enter ${key} link`}
            value={links[key] || ""}
            onChange={(e) => setLinks({ ...links, [key]: e.target.value })}
            className="w-full p-2 border rounded"
          />
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Links
        </button>
      </form>

      {loading && <p className="mt-4">Loading links...</p>}
    </div>
  );
}

export default Social;
