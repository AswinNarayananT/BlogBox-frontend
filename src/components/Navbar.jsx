import React, { useState } from "react";
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
  FaBookOpen,
  FaBars,
  FaTimes,
  FaUserShield,
} from "react-icons/fa";
import { logout } from "../redux/auth/authThunk";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
    setMenuOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest('.navbar-container')) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-30 w-full navbar-container">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex justify-between items-center h-16 sm:h-18 md:h-20">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group flex-shrink-0"
          onClick={() => navigate("/")}
        >
          <FaFeatherAlt className="text-base sm:text-lg text-white group-hover:text-purple-400 transition-colors" />
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
            BLOGBOX
          </h1>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {user && (
            <>
              <IconBtn onClick={() => navigate("/blogs/create")} title="Create Blog" icon={<FaPlus />} />
              <IconBtn onClick={() => navigate("/my-blogs")} title="My Blogs" icon={<FaBookOpen />} />
            </>
          )}

          {user?.is_superuser && (
            <IconBtn onClick={() => navigate("/users/manage")} title="Manage Users" icon={<FaUserShield />} />
          )}

          {user ? (
            <>
              <IconBtn onClick={() => navigate("/profile")} title="Profile" icon={<FaUserCircle />} />
              <IconBtn onClick={handleLogout} title="Logout" icon={<FaSignOutAlt />} red />
            </>
          ) : (
            <>
              {currentPath !== "/" && (
                <IconBtn onClick={() => navigate("/")} title="Home" icon={<FaHome />} gray />
              )}
              {currentPath !== "/login" && (
                <IconBtn onClick={() => navigate("/login")} title="Login" icon={<FaSignInAlt />} />
              )}
              {currentPath !== "/register" && (
                <IconBtn onClick={() => navigate("/register")} title="Register" icon={<FaUserPlus />} />
              )}
            </>
          )}
        </div>

        {/* Mobile hamburger menu button */}
        <div className="md:hidden">
          <button
            className="text-white text-lg sm:text-xl p-2 rounded-md hover:bg-gray-800 transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-25"
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Menu */}
          <div className="md:hidden absolute top-full left-0 right-0 bg-black border-t border-gray-800 shadow-xl z-35">
            <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-2 sm:space-y-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {user && (
                <>
                  <MobileMenuItem onClick={() => handleNavigate("/blogs/create")} icon={<FaPlus />} label="Create Blog" />
                  <MobileMenuItem onClick={() => handleNavigate("/my-blogs")} icon={<FaBookOpen />} label="My Blogs" />
                </>
              )}

              {user?.is_superuser && (
                <MobileMenuItem onClick={() => handleNavigate("/users/manage")} icon={<FaUsersCog />} label="Manage Users" />
              )}

              {user ? (
                <>
                  <MobileMenuItem onClick={() => handleNavigate("/profile")} icon={<FaUserCircle />} label="Profile" />
                  <MobileMenuItem onClick={handleLogout} icon={<FaSignOutAlt />} label="Logout" red />
                </>
              ) : (
                <>
                  {currentPath !== "/" && (
                    <MobileMenuItem onClick={() => handleNavigate("/")} icon={<FaHome />} label="Home" />
                  )}
                  {currentPath !== "/login" && (
                    <MobileMenuItem onClick={() => handleNavigate("/login")} icon={<FaSignInAlt />} label="Login" />
                  )}
                  {currentPath !== "/register" && (
                    <MobileMenuItem onClick={() => handleNavigate("/register")} icon={<FaUserPlus />} label="Register" />
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

// Reusable Icon Button (Desktop) - Enhanced responsiveness
const IconBtn = ({ onClick, icon, title, red = false, gray = false }) => (
  <button
    onClick={onClick}
    className={`p-2 lg:p-3 rounded-full text-white transition-all shadow-md transform hover:scale-110 text-sm lg:text-base ${
      red
        ? "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 hover:shadow-red-500/25"
        : gray
        ? "bg-gray-800 hover:bg-gray-700 hover:shadow-purple-500/25"
        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/25"
    }`}
    title={title}
  >
    {icon}
  </button>
);

// Reusable Menu Item (Mobile) - Enhanced responsiveness
const MobileMenuItem = ({ onClick, icon, label, red = false }) => (
  <div
    onClick={onClick}
    className={`flex items-center space-x-3 p-2 sm:p-3 rounded-md cursor-pointer transition-all ${
      red
        ? "text-red-400 hover:bg-red-900/50"
        : "text-white hover:bg-gray-800/50"
    }`}
  >
    <div className="text-base sm:text-lg flex-shrink-0">{icon}</div>
    <div className="text-sm sm:text-base font-medium">{label}</div>
  </div>
);

export default Navbar;