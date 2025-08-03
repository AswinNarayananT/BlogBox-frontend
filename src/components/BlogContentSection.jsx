import React, { useRef, useState } from "react";
import {
  FaCalendarAlt,
  FaEye,
  FaComments,
  FaEdit,
  FaCheck,
  FaTimes,
  FaPlus,
  FaShare,
  FaThumbsUp,
  FaThumbsDown,
  FaSpinner,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { updateBlog, likeBlog, unlikeBlog } from "../redux/blog/blogThunk";
import { toast } from "react-hot-toast";
import BlogLoader from "./BlogLoader";

export default function BlogContentSection({
  blog,
  setShowImagePreview,
}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const selectedComments = useSelector((state) => state.blogs.selectedComments);

  const imageInputRef = useRef();

  const [editingTitle, setEditingTitle] = useState(false);
  const [editingContent, setEditingContent] = useState(false);
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [previewImage, setPreviewImage] = useState(blog.image);
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if current user is the author of the blog
  const isAuthor = user?.id === blog.author_id;
  // Check if current user is admin/superuser
  const isAdmin = user?.is_superuser;

  const handleUpdate = async (field, value) => {
    if (!isAuthor) {
      toast.error("Only the author can update the blog.");
      return;
    }
    try {
      setLoading(true);
      await dispatch(updateBlog({ blogId: blog.id, data: { [field]: value } })).unwrap();
      toast.success(`${field} updated successfully!`);
      if (field === "title") setEditingTitle(false);
      if (field === "content") setEditingContent(false);
    } catch {
      toast.error(`Failed to update ${field}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    if (!isAuthor) {
      toast.error("Only the author can update the image.");
      return;
    }

    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      setImageLoading(true);

      dispatch(updateBlog({ blogId: blog.id, data: { image: file } }))
        .unwrap()
        .then(() => {
          toast.success("Image updated successfully!");
        })
        .catch(() => {
          toast.error("Failed to update image");
          setPreviewImage(null);
        })
        .finally(() => setImageLoading(false));
    }
  };

  const handleLike = async () => {
    try {
      await dispatch(likeBlog(blog.id)).unwrap();
    } catch {
      toast.error("Failed to like");
    }
  };

  const handleUnlike = async () => {
    try {
      await dispatch(unlikeBlog(blog.id)).unwrap();
    } catch {
      toast.error("Failed to unlike");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: blog.content.substring(0, 150) + '...',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch {
      toast.error("Failed to share");
    }
  };

  if (loading) {
    return <BlogLoader />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-black/80 rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-6 md:p-8 lg:p-12 mb-6 sm:mb-12 lg:mb-20">

      {/* Title Section */}
      <div className="mb-6 sm:mb-8">
        {editingTitle ? (
          <div className="space-y-4">
            <div className="relative">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 sm:p-5 rounded-xl border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300 text-lg sm:text-xl md:text-2xl font-bold text-center shadow-inner"
                placeholder="Enter blog title..."
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl pointer-events-none"></div>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleUpdate("title", title)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <FaCheck className="text-sm" />
                <span className="hidden sm:inline">Save</span>
              </button>
              <button
                onClick={() => {
                  setEditingTitle(false);
                  setTitle(blog.title);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <FaTimes className="text-sm" />
                <span className="hidden sm:inline">Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center relative">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent tracking-tight leading-tight px-4 pb-2">
              {title}
            </h1>
            {isAuthor && (
              <button
                onClick={() => setEditingTitle(true)}
                className="absolute top-0 right-0 sm:top-1 sm:right-2 md:top-2 md:right-4 text-gray-400 hover:text-white transition-all duration-200 p-2 sm:p-2.5 md:p-3 rounded-full hover:bg-gray-800/70 bg-gray-900/60 backdrop-blur-sm border border-gray-600/40 shadow-lg"
                title="Edit title"
              >
                <FaEdit className="text-xs sm:text-sm md:text-base" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Image Section */}
      {previewImage ? (
        <div className="relative mb-6 sm:mb-8">
          <img
            src={previewImage}
            alt="Blog"
            className="w-full h-40 sm:h-48 md:h-64 lg:h-80 xl:h-[450px] object-cover rounded-xl sm:rounded-2xl cursor-pointer shadow-lg transition-transform duration-300 hover:scale-[1.02]"
            onClick={() => setShowImagePreview(true)}
          />

          {/* Loader overlay only for image */}
          {imageLoading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl sm:rounded-2xl backdrop-blur-sm">
              <div className="text-center">
                <FaSpinner className="animate-spin text-white text-2xl sm:text-3xl mx-auto mb-2" />
                <p className="text-white text-sm">Updating image...</p>
              </div>
            </div>
          )}

          {isAuthor && (
            <>
              <button
                onClick={() => imageInputRef.current.click()}
                className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 bg-gray-700/90 text-white p-2 sm:p-3 rounded-full hover:bg-gray-800 transition-all duration-200 shadow-lg backdrop-blur-sm border border-gray-600/30"
              >
                <FaEdit className="text-sm sm:text-base" />
              </button>
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
            </>
          )}
        </div>
      ) : (
        <>
          {isAuthor && (
            <div className="flex justify-center mb-6 sm:mb-8">
              <button
                onClick={() => imageInputRef.current.click()}
                className="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-gray-800 to-gray-700 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full hover:from-gray-700 hover:to-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-600/30"
              >
                <FaPlus className="text-sm sm:text-base lg:text-lg" />
                <span className="text-sm sm:text-base lg:text-lg font-medium">Add Image</span>
              </button>
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
            </div>
          )}
        </>
      )}

      {/* Meta Information */}
      <div className="flex justify-center flex-wrap gap-3 sm:gap-4 lg:gap-6 text-gray-400 text-xs sm:text-sm lg:text-base mb-6 sm:mb-8 lg:mb-10">
        <div className="flex items-center bg-gray-800/50 px-3 py-2 rounded-lg">
          <FaCalendarAlt className="mr-2 text-purple-400" />
          <span className="whitespace-nowrap">
            {new Date(blog.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center bg-gray-800/50 px-3 py-2 rounded-lg">
          <FaEye className="mr-2 text-blue-400" />
          <span>{blog.read_count} reads</span>
        </div>
        <div className="flex items-center bg-gray-800/50 px-3 py-2 rounded-lg">
          <FaComments className="mr-2 text-green-400" />
          <span>{selectedComments ? selectedComments.length : 0} comments</span>
        </div>
      </div>

      {/* Like and Share Buttons */}
      <div className="flex justify-center items-center gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8 lg:mb-12 pb-4 sm:pb-6 lg:pb-8 border-b border-gray-700">
        <button
          onClick={handleLike}
          className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl text-xs sm:text-sm lg:text-base min-w-0"
        >
          <FaThumbsUp className="text-xs sm:text-sm flex-shrink-0" />
          <span className="truncate">{blog.likes || 0}</span>
        </button>
        
        <button
          onClick={handleUnlike}
          className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full bg-gray-600 text-white font-medium hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl text-xs sm:text-sm lg:text-base min-w-0"
        >
          <FaThumbsDown className="text-xs sm:text-sm flex-shrink-0" />
          <span className="truncate">{blog.unlikes || 0}</span>
        </button>
        
        <button
          onClick={handleShare}
          className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl text-xs sm:text-sm lg:text-base min-w-0"
        >
          <FaShare className="text-xs sm:text-sm flex-shrink-0" />
          <span className="hidden sm:inline truncate">Share</span>
        </button>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto mb-6 sm:mb-10 lg:mb-14">
        {editingContent ? (
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-5 lg:p-6 rounded-xl border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300 text-sm sm:text-base lg:text-lg leading-relaxed resize-vertical min-h-[200px] shadow-inner"
                placeholder="Write your blog content here..."
              />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-xl pointer-events-none"></div>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleUpdate("content", content)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <FaCheck className="text-sm" />
                <span className="hidden sm:inline">Save Changes</span>
                <span className="sm:hidden">Save</span>
              </button>
              <button
                onClick={() => {
                  setEditingContent(false);
                  setContent(blog.content);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <FaTimes className="text-sm" />
                <span className="hidden sm:inline">Cancel</span>
                <span className="sm:hidden">Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed sm:leading-loose whitespace-pre-wrap text-center px-2 sm:px-4 lg:px-6 py-4 sm:py-6 bg-gray-900/30 rounded-xl border border-gray-800/50 pr-12 sm:pr-16">
              {content}
            </div>
            {isAuthor && (
              <button
                onClick={() => setEditingContent(true)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 text-gray-400 hover:text-white transition-all duration-200 p-2 sm:p-2.5 md:p-3 rounded-full hover:bg-gray-800/70 bg-gray-900/60 backdrop-blur-sm border border-gray-600/40 shadow-lg z-10"
                title="Edit content"
              >
                <FaEdit className="text-xs sm:text-sm md:text-base" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}