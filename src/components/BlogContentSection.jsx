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
import AttachmentGrid from "./AttachmentGrid";

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
    <div className="w-full max-w-6xl mx-auto bg-black/80 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-20">

      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6 sm:mb-8">
        {editingTitle ? (
          <div className="w-full flex flex-col sm:flex-row items-center gap-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-900 text-white p-3 rounded mr-0 sm:mr-2"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdate("title", title)}
                className="bg-green-600 text-white px-4 py-3 rounded"
              >
                <FaCheck />
              </button>
              <button
                onClick={() => {
                  setEditingTitle(false);
                  setTitle(blog.title);
                }}
                className="bg-red-600 text-white px-4 py-3 rounded"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent tracking-tight">
              {title}
            </h1>
            {isAuthor && (
              <button
                onClick={() => setEditingTitle(true)}
                className="ml-0 sm:ml-3 mt-2 sm:mt-0 text-gray-400 hover:text-white transition-colors"
              >
                <FaEdit />
              </button>
            )}
          </>
        )}
      </div>

      {/* Image */}
      {previewImage ? (
        <div className="relative mb-6 sm:mb-8">
          <img
            src={previewImage}
            alt="Blog"
            className="w-full h-48 sm:h-64 md:h-80 lg:h-[450px] object-cover rounded-xl sm:rounded-2xl cursor-pointer shadow-lg"
            onClick={() => setShowImagePreview(true)}
          />

          {/* Loader overlay only for image */}
          {imageLoading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl sm:rounded-2xl">
              <FaSpinner className="animate-spin text-white text-2xl sm:text-3xl" />
            </div>
          )}

          {isAuthor && (
            <>
              <button
                onClick={() => imageInputRef.current.click()}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gray-700/90 text-white p-2 sm:p-3 rounded-full hover:bg-gray-800 transition-all duration-200 shadow-lg"
              >
                <FaEdit />
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
                className="flex items-center space-x-2 bg-gray-800 text-white px-4 sm:px-5 py-3 rounded-full hover:bg-gray-700 transition-colors shadow-lg"
              >
                <FaPlus className="text-base sm:text-lg" />
                <span className="text-sm sm:text-base">Add Image</span>
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

      {/* Meta */}
      <div className="flex justify-center flex-wrap gap-4 sm:gap-6 text-gray-400 text-xs sm:text-sm mb-8 sm:mb-10">
        <div className="flex items-center">
          <FaCalendarAlt className="mr-2" />
          {new Date(blog.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div className="flex items-center">
          <FaEye className="mr-2" />
          {blog.read_count} reads
        </div>
        <div className="flex items-center">
          <FaComments className="mr-2" />
          {selectedComments ? selectedComments.length : 0} comments
        </div>
      </div>

      {/* Like and Share Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10 sm:mb-12 pb-6 sm:pb-8 border-b border-gray-700">
        <button
          onClick={handleLike}
          className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <FaThumbsUp className="text-sm" />
          <span>{blog.likes || 0}</span>
        </button>
        
        <button
          onClick={handleUnlike}
          className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gray-600 text-white font-medium hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <FaThumbsDown className="text-sm" />
          <span>{blog.unlikes || 0}</span>
        </button>
        
        <button
          onClick={handleShare}
          className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <FaShare className="text-sm" />
          <span>Share</span>
        </button>
      </div>

      {/* Content */}
      <div className="relative max-w-3xl mx-auto mb-8 sm:mb-14">
        {isAuthor && (
          <button
            onClick={() => setEditingContent(true)}
            className="absolute -right-2 sm:-right-12 top-0 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
            title="Edit content"
          >
            <FaEdit />
          </button>
        )}
        
        <div className="text-gray-300 text-base sm:text-lg whitespace-pre-wrap text-center">
          {editingContent ? (
            <>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full bg-gray-900 text-white p-4 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none transition-all"
              />
              <div className="flex justify-center mt-3 gap-2">
                <button
                  onClick={() => handleUpdate("content", content)}
                  className="bg-green-600 text-white px-5 py-3 rounded hover:bg-green-700 transition-colors"
                >
                  <FaCheck />
                </button>
                <button
                  onClick={() => {
                    setEditingContent(false);
                    setContent(blog.content);
                  }}
                  className="bg-red-600 text-white px-5 py-3 rounded hover:bg-red-700 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </>
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
}