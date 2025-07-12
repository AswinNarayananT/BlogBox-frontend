import { FaUserCircle, FaThumbsUp, FaThumbsDown, FaEye, FaBookmark, FaQuoteLeft, FaCoffee } from "react-icons/fa";
import BlogLoader from "./BlogLoader";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchBlogs } from "../redux/blog/blogThunk";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

const BlogFeed = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: blogs, loading, error } = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.auth.user);

  const skip = blogs.length;
  const limit = 5;

  useEffect(() => {
    if (blogs.length === 0) {
      dispatch(fetchBlogs({ skip: 0, limit }));
    }
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const loadMore = () => {
    dispatch(fetchBlogs({ skip, limit }));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {!loading && blogs.length === 0 && !error && (
        <div className="text-center py-20">
          <div className="relative">
            <FaQuoteLeft className="text-6xl text-gray-700 mx-auto mb-6 opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <FaCoffee className="text-3xl text-purple-400 animate-pulse" />
            </div>
          </div>
          <p className="text-xl mb-8 text-gray-400 font-light italic">
            "The page is blank, but the possibilities are endless..."
          </p>
          {user?.is_superuser && (
            <button
              onClick={() => navigate("/blogs/create")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full transition-all font-medium shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
            >
              Begin Your Journey
            </button>
          )}
        </div>
      )}

      <div className="space-y-8">
        {blogs.map((blog) => (
          <article
            key={blog.id}
            className="group cursor-pointer"
            onClick={() => navigate(`/blogs/${blog.id}`)}
          >
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 transform hover:scale-[1.02]">
              <div className="flex flex-col lg:flex-row">
                {blog.image && (
                  <div className="lg:w-80 h-48 lg:h-auto overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="flex-1 p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <FaUserCircle className="text-sm" />
                      <span className="text-sm font-medium">
                        {blog.author?.username || "Anonymous"}
                      </span>
                    </div>
                    <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                    <div className="flex items-center space-x-4 text-gray-400 text-sm">
                      <span className="flex items-center space-x-1">
                        <FaEye className="text-xs" />
                        <span>{blog.read_count}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FaThumbsUp className="text-xs" />
                        <span>{blog.likes}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FaThumbsDown className="text-xs" />
                        <span>{blog.unlikes}</span>
                      </span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors line-clamp-2 leading-tight">
                    {blog.title}
                  </h2>

                  <p className="text-gray-300 line-clamp-3 mb-6 leading-relaxed text-lg">
                    {blog.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-purple-400 font-medium">
                      <span className="text-sm">Read more</span>
                      <div className="w-6 h-0.5 bg-purple-400 group-hover:w-12 transition-all duration-300"></div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-800/50 rounded-full">
                      <FaBookmark className="text-gray-400 hover:text-purple-400 transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {loading && <BlogLoader />}

      {blogs.length > 0 && (
        <div className="text-center mt-16">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-8 py-4 rounded-full transition-all font-medium shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 disabled:transform-none"
          >
            {loading ? "Loading..." : "Discover More Stories"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogFeed;
