import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/contactDisplay");
      setContacts(res.data.contacts || []);
    } catch (err) {
      toast.error("Failed to fetch contacts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await API.delete(`/deleteContact/${id}`);
      toast.success("Deleted successfully");
      fetchContacts();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">📩 Contact Messages</h1>

      {isLoading ? (
        <div className="text-center text-gray-600 py-10">Loading...</div>
      ) : contacts.length === 0 ? (
        <p className="text-gray-600 text-center">No messages found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
              <thead>
                <tr className="bg-blue-700 text-white text-left">
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Subject</th>
                  <th className="p-3 border">Message</th>
                  <th className="p-3 border">Portfolio Rating</th>
                  <th className="p-3 border">Received At</th>
                  <th className="p-3 border">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {contacts.map((msg) => (
                    <motion.tr
                      key={msg._id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="border-b hover:bg-gray-50 transition cursor-pointer"
                    >
                      <td className="p-3 border font-medium">{msg.name}</td>
                      <td className="p-3 border text-blue-600">{msg.email}</td>
                      <td className="p-3 border">{msg.subject}</td>
                      <td className="p-3 border">{msg.message}</td>
                      <td className="p-3 border">
                        <span className="px-2 py-1 rounded-full text-white text-sm bg-green-500">
                          {msg.rating || "N/A"}
                        </span>
                      </td>
                      <td className="p-3 border">{new Date(msg.createdAt).toLocaleString()}</td>
                      <td className="p-3 border text-center">
                        <button
                          onClick={() => handleDelete(msg._id)}
                          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mt-6 space-y-4 md:hidden">
            <AnimatePresence>
              {contacts.map((msg) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border rounded-xl p-4 shadow-md bg-white hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-lg">{msg.name}</h2>
                    <span className="px-2 py-1 rounded-full text-white text-sm bg-green-500">
                      {msg.rating || "N/A"}
                    </span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">{msg.email}</p>
                  <p className="font-medium mt-2">{msg.subject}</p>
                  <p className="mt-2 text-gray-700">{msg.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="mt-3 w-full bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

export default Contacts;
