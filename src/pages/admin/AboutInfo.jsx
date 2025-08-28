import { useState, useEffect } from "react";
import API from "../../services/api";

const AboutInfo = () => {
  const [aboutCards, setAboutCards] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch all About cards
  const fetchAbout = async () => {
    try {
      const { data } = await API.get("/aboutDisplay");
      if (data.success) setAboutCards(data.aboutCards || []);
    } catch (err) {
      console.error("Fetch About Error:", err);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // Create or Update About card
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!title.trim() || !text.trim()) {
      setMessage("Title and text cannot be empty.");
      return;
    }

    try {
      const url = editId ? `/aboutUpdate/${editId}` : "/aboutCreate";
      const method = editId ? "put" : "post";

      const { data } = await API[method](url, { title, text });

      if (data.success) {
        setMessage(editId ? "Updated successfully" : "Created successfully");
        setTitle("");
        setText("");
        setEditId(null);
        fetchAbout();
      } else {
        setMessage(data.message || "Error occurred");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      setMessage("Server error");
    }
  };

  // Edit About card
  const handleEdit = (card) => {
    setEditId(card._id);
    setTitle(card.title);
    setText(card.text);
  };

  // Delete About card
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;

    try {
      const { data } = await API.delete(`/aboutDelete/${id}`);
      if (data.success) {
        setMessage("Deleted successfully");
        fetchAbout();
      } else {
        setMessage(data.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      setMessage("Server error");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">About Management</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 space-y-4 p-4 border rounded-md shadow-sm"
      >
        <h2 className="text-xl font-semibold">
          {editId ? "Edit About Card" : "Add About Card"}
        </h2>

        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
            rows={3}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          {editId ? "Update" : "Create"}
        </button>

        {message && <p className="mt-2 text-green-600">{message}</p>}
      </form>

      {/* About Cards List */}
      <div className="space-y-4">
        {aboutCards.map((card) => (
          <div
            key={card._id || card.id}
            className="p-4 border rounded-md flex justify-between items-center shadow-sm"
          >
            <div>
              <h3 className="font-semibold text-neutral-900">{card.title}</h3>
              <p className="text-neutral-600">{card.text}</p>
            </div>

            <div className="space-x-2">
              <button
                onClick={() => handleEdit(card)}
                className="bg-yellow-400 text-white px-3 py-1 rounded-md"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(card._id)}
                className="bg-red-600 text-white px-3 py-1 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutInfo;
