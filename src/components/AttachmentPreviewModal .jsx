import React from "react";
import { FaTimes } from "react-icons/fa";

const AttachmentPreviewModal = ({ show, onClose, attachmentUrl }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="relative w-full h-full max-w-6xl max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 z-10"
        >
          <FaTimes />
        </button>
        <iframe
          src={attachmentUrl}
          className="w-full h-full rounded-lg"
          title="Full Screen Preview"
        />
      </div>
    </div>
  );
};

export default AttachmentPreviewModal;
