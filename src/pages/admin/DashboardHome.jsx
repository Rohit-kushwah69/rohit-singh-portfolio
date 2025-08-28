import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const DashboardHome = () => {
  const { user, setUser } = useContext(AuthContext);
  const [editingPassword, setEditingPassword] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Loading states
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Profile input change
  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await API.put("/profile", profileData, { withCredentials: true });
      if (res.data.success || res.status === 200) {
        toast.success("Profile updated successfully!");
        setUser(res.data.data || profileData);
        setEditingProfile(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed");
    } finally {
      setProfileLoading(false);
    }
  };

  // Password input change
  const handlePasswordChangeInput = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Password update
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword)
      return toast.error("All fields are required!");
    if (newPassword !== confirmPassword)
      return toast.error("New password and confirm password must match!");

    setPasswordLoading(true);
    try {
      const res = await API.put("/changePassword", passwordData, { withCredentials: true });
      if (res.data.success || res.status === 200) {
        toast.success("Password updated successfully!");
        setEditingPassword(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Welcome, {user?.name || "Admin"}!
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Manage your portfolio and account settings.
          </p>
        </div>

        {/* Profile & Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Info */}
          <div className="p-4 md:p-6 bg-gray-50 rounded-2xl shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">Profile Info</h2>
              <button
                className="text-blue-600 hover:underline text-sm"
                onClick={() => setEditingProfile(!editingProfile)}
              >
                {editingProfile ? "Cancel" : "Edit"}
              </button>
            </div>

            {editingProfile ? (
              <form className="space-y-3" onSubmit={handleProfileUpdate}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  disabled={profileLoading}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  disabled={profileLoading}
                />
                <button
                  type="submit"
                  className={`w-full py-2 rounded-lg text-white ${profileLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                    }`}
                  disabled={profileLoading}
                >
                  {profileLoading ? "Updating..." : "Save Profile"}
                </button>
              </form>
            ) : (
              <div className="space-y-1 text-sm md:text-base">
                <p><span className="font-medium">Name:</span> {user?.name}</p>
                <p><span className="font-medium">Email:</span> {user?.email}</p>
                <p><span className="font-medium">Role:</span> {user?.role || "Admin"}</p>
              </div>
            )}
          </div>

          {/* Password Change */}
          <div className="p-4 md:p-6 bg-gray-50 rounded-2xl shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">Change Password</h2>
              <button
                className="text-blue-600 hover:underline text-sm"
                onClick={() => setEditingPassword(!editingPassword)}
              >
                {editingPassword ? "Cancel" : "Edit"}
              </button>
            </div>

            {editingPassword ? (
              <form className="space-y-3" onSubmit={handlePasswordChange}>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChangeInput}
                  disabled={passwordLoading}
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChangeInput}
                  disabled={passwordLoading}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChangeInput}
                  disabled={passwordLoading}
                />
                <button
                  type="submit"
                  className={`w-full py-2 rounded-lg text-white ${passwordLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            ) : (
              <p className="text-gray-500 text-sm">Click edit to change your password securely.</p>
            )}
          </div>
        </div>

        {/* Quick Action Buttons */}

        <div className="flex flex-wrap gap-3 mt-6 justify-start md:justify-start">
          <Link
            to="/admin/projects"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm md:text-base inline-block"
          >
            Manage Projects
          </Link>

          <Link
            to="/admin/services"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm md:text-base inline-block"
          >
            Manage Services
          </Link>

          <Link
            to="/admin/contacts"
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm md:text-base inline-block"
          >
            View Contacts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
