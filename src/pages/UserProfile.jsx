import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FaUser,
  FaEdit,
  FaCamera,
  FaCalendarAlt,
  FaEnvelope,
  FaCheck,
  FaTimes,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCrown,
  FaUserShield,
  FaArrowLeft,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { updateUsername, updateProfilePic, changePassword } from "../redux/auth/authThunk";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const profilePicRef = useRef();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || "",
    profile_pic: null,
  });
  const [previewImage, setPreviewImage] = useState(user?.profile_pic || null);
  const [imageLoading, setImageLoading] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleEditProfile = () => {
    setEditData({
      username: user?.username || "",
      profile_pic: null,
    });
    setPreviewImage(user?.profile_pic || null);
    setShowEditModal(true);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);

      try {
        setImageLoading(true);
        await dispatch(updateProfilePic(file)).unwrap();
        toast.success("Profile picture updated!");
      } catch (err) {
        toast.error(err || "Failed to update profile picture");
      } finally {
        setImageLoading(false);
      }
    }
  };

  const handleUpdateUsername = async () => {
    if (!editData.username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    try {
      setUsernameLoading(true);
      await dispatch(updateUsername(editData.username)).unwrap();
      toast.success("Username updated!");
      setShowEditModal(false);
    } catch (err) {
      toast.error(err || "Failed to update username");
    } finally {
      setUsernameLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    try {
      setChangingPassword(true);

      await dispatch(
        changePassword({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        })
      ).unwrap();

      toast.success("Password changed successfully!");

      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-gray-400 text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />

      <main className="flex-grow flex flex-col items-center p-6">
        {/* Back Button Container */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-200 text-sm sm:text-base font-medium"
          >
            <FaArrowLeft className="mr-2 text-sm" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>

        {/* Profile Content */}
        <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 rounded-3xl p-12 shadow-2xl max-w-5xl w-full">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent tracking-tight">
                My Profile
              </h1>
            </div>

            {/* Profile Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Column */}
            <div className="text-center">
              <div className="relative inline-block mb-6">
                {user.profile_pic ? (
                  <img
                    src={user.profile_pic}
                    alt={user.username}
                    className="w-48 h-48 rounded-full object-cover border-4 border-purple-500 shadow-2xl"
                  />
                ) : (
                  <div className="w-48 h-48 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-6xl font-bold text-white shadow-2xl">
                    {user.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <button
                  onClick={handleEditProfile}
                  className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-200"
                >
                  <FaCamera />
                </button>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">{user.username}</h2>
                {user.is_superuser && (
                  <div className="flex items-center justify-center space-x-2">
                    <FaCrown className="text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">Super Admin</span>
                  </div>
                )}
              </div>
            </div>

              {/* Right Column - Account Details and Actions */}
              <div className="space-y-6 sm:space-y-8">
                {/* Account Information Card */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
                    <FaUser className="mr-2 text-purple-400" />
                    Account Information
                  </h3>

                  <div className="space-y-4 sm:space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <FaEnvelope className="text-gray-400 text-sm" />
                        <span className="text-gray-300 text-sm sm:text-base">Email</span>
                      </div>
                      <span className="text-white font-medium text-sm sm:text-base break-all sm:break-normal">
                        {user.email}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <FaUser className="text-gray-400 text-sm" />
                        <span className="text-gray-300 text-sm sm:text-base">Username</span>
                      </div>
                      <span className="text-white font-medium text-sm sm:text-base">
                        {user.username}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <FaCalendarAlt className="text-gray-400 text-sm" />
                        <span className="text-gray-300 text-sm sm:text-base">Joined</span>
                      </div>
                      <span className="text-white font-medium text-sm sm:text-base">
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <FaUserShield className="text-gray-400 text-sm" />
                        <span className="text-gray-300 text-sm sm:text-base">Account Status</span>
                      </div>
                      <span className="text-green-400 font-medium text-sm sm:text-base">
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <FaCalendarAlt className="text-gray-400 text-sm" />
                        <span className="text-gray-300 text-sm sm:text-base">Last Login</span>
                      </div>
                      <span className="text-white font-medium text-sm sm:text-base">
                        {new Date(user.last_login).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 sm:space-y-4">
                  <button
                    onClick={handleEditProfile}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 sm:py-4 px-6 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <FaEdit className="text-sm" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 sm:py-4 px-6 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <FaLock className="text-sm" />
                    <span>Change Password</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
              Edit Profile
            </h3>

            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-purple-500"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xl sm:text-2xl font-bold text-white">
                      {editData.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <button
                    onClick={() => profilePicRef.current.click()}
                    disabled={imageLoading}
                    className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white p-1.5 sm:p-2 rounded-full text-xs sm:text-sm"
                  >
                    {imageLoading ? <FaSpinner className="animate-spin" /> : <FaCamera />}
                  </button>
                </div>
                <input
                  type="file"
                  ref={profilePicRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                {imageLoading && (
                  <div className="mt-2 flex justify-center text-purple-400 text-sm">
                    <FaSpinner className="animate-spin mr-2" /> Uploading...
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm sm:text-base">Username</label>
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) => setEditData((prev) => ({ ...prev, username: e.target.value }))}
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-all text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                  Email (Cannot be changed)
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-gray-700 text-gray-400 p-3 rounded-lg border border-gray-600 cursor-not-allowed text-sm sm:text-base"
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleUpdateUsername}
                  disabled={usernameLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  {usernameLoading ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FaCheck className="text-sm" />
                      <span>Save</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  disabled={usernameLoading}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <FaTimes className="text-sm" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
              Change Password
            </h3>
            
            <div className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-gray-300 mb-2 text-sm sm:text-base">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full bg-gray-800 text-white p-3 pr-12 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-all text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.current ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-gray-300 mb-2 text-sm sm:text-base">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full bg-gray-800 text-white p-3 pr-12 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-all text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.new ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-300 mb-2 text-sm sm:text-base">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full bg-gray-800 text-white p-3 pr-12 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-all text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.confirm ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  {changingPassword ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <FaCheck className="text-sm" />
                      <span>Update</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  disabled={changingPassword}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <FaTimes className="text-sm" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;