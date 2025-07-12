import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaFeatherAlt,
  FaPlus,
  FaUsersCog,
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaHome,
  FaUserPlus,
} from "react-icons/fa";
import { logout } from "../redux/auth/authThunk";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
  };

  const currentPath = location.pathname;

  return (
    <nav className="bg-black backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <FaFeatherAlt className="text-lg text-white group-hover:text-purple-400 transition-colors" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
            BLOGBOX
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          {user?.is_superuser && (
            <>
              <button
                onClick={() => navigate("/blogs/create")}
                className="p-3 rounded-full text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/25 transform hover:scale-110"
                title="Create Blog"
              >
                <FaPlus className="text-base" />
              </button>

              <button
                onClick={() => navigate("/users/manage")}
                className="p-3 rounded-full text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/25 transform hover:scale-110"
                title="Manage Users"
              >
                <FaUsersCog className="text-base" />
              </button>
            </>
          )}

          {user ? (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="p-3 rounded-full text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/25 transform hover:scale-110"
                title="Profile"
              >
                <FaUserCircle className="text-base" />
              </button>
              <button
                onClick={handleLogout}
                className="p-3 rounded-full text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all shadow-lg hover:shadow-red-500/25 transform hover:scale-110"
                title="Logout"
              >
                <FaSignOutAlt className="text-base" />
              </button>
            </>
          ) : (
            <>
              {currentPath !== "/" && (
                <button
                  onClick={() => navigate("/")}
                  className="p-3 rounded-full text-white bg-gray-800 hover:bg-gray-700 transition-all shadow-lg hover:shadow-purple-500/25 transform hover:scale-110"
                  title="Home"
                >
                  <FaHome className="text-base" />
                </button>
              )}
              {currentPath !== "/login" && (
                <button
                  onClick={() => navigate("/login")}
                  className="p-3 rounded-full text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/25 transform hover:scale-110"
                  title="Login"
                >
                  <FaSignInAlt className="text-base" />
                </button>
              )}
              {currentPath !== "/register" && (
                <button
                  onClick={() => navigate("/register")}
                  className="p-3 rounded-full text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/25 transform hover:scale-110"
                  title="Register"
                >
                  <FaUserPlus className="text-base" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
