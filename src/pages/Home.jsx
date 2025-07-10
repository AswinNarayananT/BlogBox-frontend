import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../redux/blog/blogThunk";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaPlus,
  FaThumbsUp,
  FaThumbsDown,
  FaSignOutAlt,
  FaUsersCog,
  FaSignInAlt,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaHeart,
  FaCode,
  FaRss,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { logout } from "../redux/auth/authThunk";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <nav className="bg-white border-b-2 border-black shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center h-20">
          <h1
            className="text-3xl font-bold cursor-pointer hover:text-gray-600 transition-colors tracking-tight"
            onClick={() => navigate("/")}
          >
            BLOGBOX
          </h1>

          <div className="flex items-center space-x-6">
            {user?.is_superuser && (
              <>
                <button
                  onClick={() => navigate("/blogs/create")}
                  className="flex items-center bg-black text-white px-6 py-3 rounded-none hover:bg-gray-800 transition-colors font-medium border-2 border-black"
                >
                  <FaPlus className="mr-2" />
                  New Post
                </button>

                <button
                  onClick={() => navigate("/users/manage")}
                  className="text-2xl hover:text-gray-600 transition-colors p-2"
                  title="Manage Users"
                >
                  <FaUsersCog />
                </button>
              </>
            )}

            {user ? (
              <>
                <button
                  onClick={() => navigate("/profile")}
                  className="text-2xl hover:text-gray-600 transition-colors p-2"
                  title="Profile"
                >
                  <FaUserCircle />
                </button>
                <button
                  onClick={handleLogout}
                  className="text-2xl hover:text-gray-600 transition-colors p-2"
                  title="Logout"
                >
                  <FaSignOutAlt />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center bg-black text-white px-6 py-3 rounded-none hover:bg-gray-800 transition-colors font-medium border-2 border-black"
                title="Login"
              >
                <FaSignInAlt className="mr-2" />
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 text-center border-b-2 border-black">
        <h2 className="text-5xl font-bold mb-6 tracking-tight">
          Welcome to My Blog
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Discover stories, insights, and ideas. A place where thoughts come to life
          and conversations begin.
        </p>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Latest Posts</h3>
          <div className="w-24 h-1 bg-black mx-auto"></div>
        </div>

        {!loading && blogs.length === 0 && !error && (
          <div className="text-center py-20">
            <FaCode className="text-6xl text-gray-300 mx-auto mb-6" />
            <p className="text-2xl mb-6 text-gray-600">No stories yet.</p>
            {user?.is_superuser && (
              <button
                onClick={() => navigate("/blogs/create")}
                className="bg-black text-white px-8 py-4 rounded-none hover:bg-gray-800 transition-colors font-medium border-2 border-black"
              >
                Write Your First Post
              </button>
            )}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white border-2 border-black hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate(`/blogs/${blog.id}`)}
            >
              {blog.image && (
                <div className="overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <h4 className="text-xl font-bold mb-3 group-hover:text-gray-600 transition-colors line-clamp-2">
                  {blog.title}
                </h4>
                <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                  {blog.content}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-4">
                  <div className="flex items-center">
                    <FaUserCircle className="mr-2" />
                    {blog.author?.username || "Anonymous"}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <FaThumbsUp className="mr-1" />
                      {blog.likes}
                    </span>
                    <span className="flex items-center">
                      <FaThumbsDown className="mr-1" />
                      {blog.unlikes}
                    </span>
                    <span>{blog.read_count} reads</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            <p className="mt-4 text-lg text-gray-600">Loading amazing content...</p>
          </div>
        )}

        {blogs.length > 0 && (
          <div className="text-center mt-16">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed px-8 py-4 rounded-none transition-colors font-medium border-2 border-black"
            >
              {loading ? "Loading..." : "Load More Stories"}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-black mt-20">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <h4 className="text-xl font-bold mb-4">About BlogBox</h4>
              <p className="text-gray-600 leading-relaxed">
                A minimalist blog platform where stories matter. Clean design,
                powerful content, meaningful conversations.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="/" className="hover:text-black transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-black transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="/archive" className="hover:text-black transition-colors">
                    Archive
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-black transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xl font-bold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="/tech" className="hover:text-black transition-colors">
                    Technology
                  </a>
                </li>
                <li>
                  <a href="/lifestyle" className="hover:text-black transition-colors">
                    Lifestyle
                  </a>
                </li>
                <li>
                  <a href="/thoughts" className="hover:text-black transition-colors">
                    Thoughts
                  </a>
                </li>
                <li>
                  <a href="/tutorials" className="hover:text-black transition-colors">
                    Tutorials
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-xl font-bold mb-4">Connect</h4>
              <div className="flex space-x-4 mb-4">
                <a
                  href="https://twitter.com"
                  className="text-2xl hover:text-gray-600 transition-colors"
                  title="Twitter"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://github.com"
                  className="text-2xl hover:text-gray-600 transition-colors"
                  title="GitHub"
                >
                  <FaGithub />
                </a>
                <a
                  href="https://linkedin.com"
                  className="text-2xl hover:text-gray-600 transition-colors"
                  title="LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="mailto:hello@blogbox.com"
                  className="text-2xl hover:text-gray-600 transition-colors"
                  title="Email"
                >
                  <FaEnvelope />
                </a>
              </div>
              <a
                href="/rss"
                className="flex items-center text-gray-600 hover:text-black transition-colors"
              >
                <FaRss className="mr-2" />
                RSS Feed
              </a>
            </div>
          </div>

          <div className="border-t border-black mt-12 pt-8 text-center">
            <p className="text-gray-600 mb-2">
              Made with <FaHeart className="inline text-red-500 mx-1" /> by BlogBox
            </p>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} BlogBox. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}