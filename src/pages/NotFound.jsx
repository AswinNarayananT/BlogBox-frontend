import React from "react";
import { FaFeatherAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    // Navigate to previous page or home if no history
    if (location.state?.from) {
      navigate(location.state.from.pathname);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center p-6 text-center">
      <FaFeatherAlt className="text-purple-400 text-7xl animate-float drop-shadow-glow" />
      <h1 className="mt-6 text-5xl font-bold text-white">404</h1>
      <p className="mt-2 text-xl text-gray-400">Oops! Page not found</p>
      <p className="mt-1 text-gray-500 italic">Looks like you took a wrong turn weaving words...</p>

      <button
        onClick={goBack}
        className="mt-8 flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
      >
        Take me back
      </button>
    </div>
  );
};

export default NotFound;
