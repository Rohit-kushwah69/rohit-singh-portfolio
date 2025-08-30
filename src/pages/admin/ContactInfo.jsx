import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";

const ContactInfo = () => {
  const [formData, setFormData] = useState({ email: "", phone: "", location: "" });
  const [resume, setResume] = useState(null);
  const [contactList, setContactList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInfo = async () => {
    try {
      setLoading(true);
      const res = await API.get("/contactInfoDisplay");
      setContactList(res.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInfo(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setResume(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.phone || !formData.location) {
      toast.error("Please fill all required fields");
      return;
    }
    const data = new FormData();
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("location", formData.location);
    if (resume) data.append("resume", resume);

    try {
      if (editingId) {
        await API.put(`/contactInfoUpdate/${editingId}`, data);
        toast.success("Contact info updated");
      } else {
        await API.post("/contactInfoCreate", data);
        toast.success("Contact info added");
      }
      setFormData({ email: "", phone: "", location: "" });
      setResume(null);
      setEditingId(null);
      fetchInfo();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save info");
    }
  };

  const handleEdit = (item) => {
    setFormData({ email: item.email, phone: item.phone, location: item.location });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/contactInfoDelete/${id}`);
      toast.success("Deleted successfully");
      fetchInfo();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white shadow rounded mb-6 flex flex-col gap-3"
      >
        <h2 className="text-xl font-semibold">
          {editingId ? "Edit Contact Info" : "Add Contact Info"}
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 w-full rounded"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="border p-2 w-full rounded"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          className="border p-2 w-full rounded"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="resume"
          className="border p-2 w-full rounded"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {editingId ? "Update" : "Save"}
        </button>
      </form>

      {/* Desktop Table View */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full border-collapse border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">Resume</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-4">Loading...</td>
              </tr>
            ) : contactList.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">No records found</td>
              </tr>
            ) : (
              contactList.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="border p-2">{item.email}</td>
                  <td className="border p-2">{item.phone}</td>
                  <td className="border p-2">{item.location}</td>
                  <td className="border p-2">
                    {item.resume ? (
                      <a
                        href={item.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        Download
                      </a>
                    ) : "-"}
                  </td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
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

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : contactList.length === 0 ? (
          <p className="text-center">No records found</p>
        ) : (
          contactList.map((item) => (
            <div key={item._id} className="border rounded p-4 shadow bg-white">
              <p><span className="font-semibold">Email:</span> {item.email}</p>
              <p><span className="font-semibold">Phone:</span> {item.phone}</p>
              <p><span className="font-semibold">Location:</span> {item.location}</p>
              {item.resume && (
                <a
                  href={item.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline block mt-2"
                >
                  Download Resume
                </a>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactInfo;
