import React from "react";
import { FaFeatherAlt } from "react-icons/fa";

const BlogLoader = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
      <div className="relative w-16 h-16">
        <FaFeatherAlt className="text-purple-400 text-5xl animate-float drop-shadow-glow" />
      </div>
      <p className="mt-4 text-purple-300 font-light italic animate-pulse">
        Weaving words into magic...
      </p>
    </div>
  );
};

export default BlogLoader;
