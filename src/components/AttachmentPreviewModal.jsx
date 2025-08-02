import React, { useEffect } from "react";
import { FaTimes, FaDownload, FaExpand, FaCompress } from "react-icons/fa";

const AttachmentPreviewModal = ({ show, onClose, attachmentUrl, type }) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (show) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [show]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className={`relative bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden transition-all duration-300 ${
        isFullscreen 
          ? 'w-full h-full max-w-none max-h-none' 
          : 'w-full max-w-5xl h-[80vh] sm:h-[85vh] md:h-[90vh]'
      }`}>
        
        {/* Header with controls */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-white text-xs sm:text-sm font-medium truncate max-w-[150px] sm:max-w-[300px]">
              {type === 'image' ? 'Image Preview' : type === 'pdf' ? 'PDF Document' : 'File Preview'}
            </span>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300 p-1.5 sm:p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <FaCompress className="text-sm sm:text-base" />
              ) : (
                <FaExpand className="text-sm sm:text-base" />
              )}
            </button>
            
            {/* Download Button */}
            <a
              href={attachmentUrl}
              download
              className="text-white hover:text-gray-300 p-1.5 sm:p-2 rounded-lg hover:bg-gray-700/50 transition-colors flex items-center"
              aria-label="Download file"
            >
              <FaDownload className="text-sm sm:text-base" />
            </a>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-white hover:text-red-400 p-1.5 sm:p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              aria-label="Close preview"
            >
              <FaTimes className="text-sm sm:text-base" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col h-full pt-12 sm:pt-14">
          <div className="flex-1 bg-gray-800 mx-2 sm:mx-4 mb-2 sm:mb-4 rounded-lg overflow-hidden">
            {type === "image" ? (
              <div className="w-full h-full flex items-center justify-center p-4">
                <img
                  src={attachmentUrl}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  loading="lazy"
                />
              </div>
            ) : type === "pdf" ? (
              <iframe
                src={`${attachmentUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                title="PDF Preview"
                className="w-full h-full border-0"
                style={{ minHeight: '500px' }}
                loading="lazy"
                allow="fullscreen"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center p-8">
                  <FaDownload className="text-4xl sm:text-5xl mb-4 mx-auto" />
                  <p className="text-lg sm:text-xl mb-2">Preview not available</p>
                  <p className="text-sm sm:text-base">Click download to view this file</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile-friendly download bar for small screens */}
        {!isFullscreen && (
          <div className="sm:hidden absolute bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 p-3 z-20">
            <a
              href={attachmentUrl}
              download
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
            >
              <FaDownload className="mr-2 text-sm" />
              <span className="text-sm font-medium">Download File</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentPreviewModal;