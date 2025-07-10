import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUsers, toggleUserActive } from "../redux/admin/userThunk";
import { FaToggleOn, FaToggleOff, FaArrowLeft } from "react-icons/fa";

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
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-400 hover:text-white self-start mb-4"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">All Users (Admin View)</h1>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="w-full max-w-5xl overflow-x-auto">
          <table className="min-w-full border border-gray-700 rounded">
            <thead>
              <tr className="bg-gray-800">
                <th className="py-2 px-4 text-left">Profile</th>
                <th className="py-2 px-4 text-left">Username</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Joined</th>
                <th className="py-2 px-4 text-left">Last Login</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-gray-700">
                  <td className="py-2 px-4">
                    {u.profile_pic ? (
                      <img
                        src={u.profile_pic}
                        alt={u.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm">
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4">{u.username}</td>
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="py-2 px-4">
                    {u.last_login ? new Date(u.last_login).toLocaleDateString() : "Never"}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleToggleActive(u.id, u.is_active)}
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition ${
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
  );
}
