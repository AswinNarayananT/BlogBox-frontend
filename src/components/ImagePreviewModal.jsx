import React from "react";
import { FaTimes } from "react-icons/fa";

const ImagePreviewModal = ({ show, onClose, imageUrl }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-5xl max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300"
        >
          <FaTimes />
        </button>
        <img
          src={imageUrl}
          alt="Full size preview"
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
