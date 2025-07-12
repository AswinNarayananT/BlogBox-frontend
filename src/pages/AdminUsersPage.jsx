import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUsers, toggleUserActive } from "../redux/admin/userThunk";
import { FaToggleOn, FaToggleOff, FaArrowLeft } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.users.items);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!currentUser || !currentUser.is_superuser) {
      navigate("/");
    } else {
      dispatch(fetchUsers());
    }
  }, [currentUser, dispatch, navigate]);

  const handleToggleActive = (userId, isActive) => {
    dispatch(toggleUserActive({ userId, isActive: !isActive }));
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition mb-8 self-start"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          All Users (Admin View)
        </h1>

        {users.length === 0 ? (
          <p className="text-gray-500 italic">No users found.</p>
        ) : (
          <div className="w-full max-w-7xl overflow-x-auto bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl shadow-lg">
            <table className="min-w-full text-left">
              <thead className="bg-gray-800">
                <tr>
                  <th className="py-4 px-6 font-medium">Profile</th>
                  <th className="py-4 px-6 font-medium">Username</th>
                  <th className="py-4 px-6 font-medium">Email</th>
                  <th className="py-4 px-6 font-medium">Joined</th>
                  <th className="py-4 px-6 font-medium">Last Login</th>
                  <th className="py-4 px-6 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-gray-800 hover:bg-gray-800/50 transition-all">
                    <td className="py-4 px-6">
                      {u.profile_pic ? (
                        <img
                          src={u.profile_pic}
                          alt={u.username}
                          className="w-10 h-10 rounded-full object-cover border border-gray-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">{u.username}</td>
                    <td className="py-4 px-6">{u.email}</td>
                    <td className="py-4 px-6">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      {u.last_login ? new Date(u.last_login).toLocaleDateString() : "Never"}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleActive(u.id, u.is_active)}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all shadow-lg ${
                          u.is_active
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {u.is_active ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
