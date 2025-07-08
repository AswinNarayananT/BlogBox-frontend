import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../redux/blog/blogThunk";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaPlus } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: blogs, loading, error } = useSelector((state) => state.blogs);

  const skip = blogs.length;
  const limit = 5;

  useEffect(() => {
    if (blogs.length === 0) {
      dispatch(fetchBlogs({ skip: 0, limit }));
    }
  }, []);

  // Show toast when error changes
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const loadMore = () => {
    dispatch(fetchBlogs({ skip, limit }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white">BLOGBOX</h1>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex items-center space-x-4">
              {/* Add Post Button */}
              <button
                onClick={() => navigate("/blogs/create")}
                className="flex items-center space-x-2 bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg transition"
              >
                <FaPlus />
                <span>Add Post</span>
              </button>
              
              {/* Profile Icon */}
              <button
                onClick={() => navigate("/profile")}
                className="text-white text-3xl hover:text-gray-300 transition"
              >
                <FaUserCircle />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Explore Blogs</h2>
        </div>

        {/* Empty state */}
        {!loading && blogs.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-xl mb-4">No blogs yet.</p>
            <button
              onClick={() => navigate("/blogs/create")}
              className="text-gray-400 underline hover:text-white"
            >
              Create one
            </button>
          </div>
        )}

        {/* Blogs list */}
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:bg-gray-800 transition cursor-pointer"
              onClick={() => navigate(`/blogs/${blog.id}`)}
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">
                  {blog.title}
                </h3>
                <p className="text-gray-300 line-clamp-3">
                  {blog.content}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>Reads: {blog.read_count}</span>
                  <span>👍 {blog.likes} | 👎 {blog.unlikes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="text-lg">Loading...</div>
          </div>
        )}

        {/* Load More button (only if blogs exist) */}
        {blogs.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-white text-black hover:bg-gray-200 disabled:bg-gray-400 px-6 py-2 rounded-lg transition"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}