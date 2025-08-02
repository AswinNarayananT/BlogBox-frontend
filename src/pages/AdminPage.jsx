import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUsers, toggleUserActive } from "../redux/admin/userThunk";
import { fetchBlogs, blockBlog } from "../redux/blog/blogThunk";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-hot-toast";
import { FaArrowLeft, FaToggleOff, FaToggleOn, FaUsers, FaBlog } from "react-icons/fa";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

export default function AdminPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // User-related state
  const users = useSelector((state) => state.users.items);
  const currentUser = useSelector((state) => state.auth.user);
  
  // Blog-related state
  const { items: blogs, loading, error, pagination } = useSelector(
    (state) => state.blogs
  );
  
  // Local state
  const [activeTab, setActiveTab] = useState("users");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  
  // Confirmation dialog state
  const [userConfirmDialog, setUserConfirmDialog] = useState({
    open: false,
    userId: null,
    isActive: null,
    username: ""
  });
  const [blogConfirmDialog, setBlogConfirmDialog] = useState({
    open: false,
    blogId: null,
    isPublished: null,
    title: ""
  });

  useEffect(() => {
    if (!currentUser || !currentUser.is_superuser) {
      navigate("/");
    } else {
      // Fetch users data
      dispatch(fetchUsers());
      // Fetch blogs data
      dispatch(fetchBlogs({ page: currentPage, pageSize }));
    }
  }, [currentUser, dispatch, navigate, currentPage]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // User management handlers
  const handleToggleUserActive = (userId, isActive, username) => {
    setUserConfirmDialog({
      open: true,
      userId,
      isActive,
      username
    });
  };

  const handleUserToggleConfirmed = () => {
    const { userId, isActive } = userConfirmDialog;
    dispatch(toggleUserActive({ userId, isActive: !isActive }));
    setUserConfirmDialog({ open: false, userId: null, isActive: null, username: "" });
  };

  // Blog management handlers
  const handleToggleBlogPublish = (blogId, isPublished, title) => {
    setBlogConfirmDialog({
      open: true,
      blogId,
      isPublished,
      title
    });
  };

  const handleBlogToggleConfirmed = () => {
    const { blogId } = blogConfirmDialog;
    dispatch(blockBlog(blogId))
      .unwrap()
      .catch(() => {
        toast.error("Failed to toggle blog visibility");
      });
    setBlogConfirmDialog({ open: false, blogId: null, isPublished: null, title: "" });
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page !== currentPage) setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const totalPages = pagination?.total_pages || 1;
    const pages = [];

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={i === currentPage}
          className={`px-3 py-1 rounded-full mx-1 ${
            i === currentPage
              ? "bg-purple-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-purple-500 hover:text-white transition-all"
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  const renderUsersTable = () => (
    <div className="w-full max-w-7xl overflow-x-auto bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl shadow-lg">
      <table className="min-w-full text-left">
        <thead className="bg-gray-800">
          <tr>
            <th className="py-4 px-6 font-medium">Profile</th>
            <th className="py-4 px-6 font-medium">Username</th>
            <th className="py-4 px-6 font-medium">Email</th>
            <th className="py-4 px-6 font-medium">Joined</th>
            <th className="py-4 px-6 font-medium">Last Login</th>
            <th className="py-4 px-6 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-gray-800 hover:bg-gray-800/50 transition-all">
              <td className="py-4 px-6">
                {u.profile_pic ? (
                  <img
                    src={u.profile_pic}
                    alt={u.username}
                    className="w-10 h-10 rounded-full object-cover border border-gray-700"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white">
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </td>
              <td className="py-4 px-6">{u.username}</td>
              <td className="py-4 px-6">{u.email}</td>
              <td className="py-4 px-6">{new Date(u.created_at).toLocaleDateString()}</td>
              <td className="py-4 px-6">
                {u.last_login ? new Date(u.last_login).toLocaleDateString() : "Never"}
              </td>
              <td className="py-4 px-6">
                <button
                  onClick={() => handleToggleUserActive(u.id, u.is_active, u.username)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all shadow-lg ${
                    u.is_active
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {u.is_active ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBlogsTable = () => (
    <div className="w-full max-w-7xl overflow-x-auto bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl shadow-lg">
      <table className="min-w-full text-left">
        <thead className="bg-gray-800">
          <tr>
            <th className="py-4 px-6 font-medium">Thumbnail</th>
            <th className="py-4 px-6 font-medium">Title</th>
            <th className="py-4 px-6 font-medium">Status</th>
            <th className="py-4 px-6 font-medium">Action</th>
            <th className="py-4 px-6 font-medium">Details</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id} className="border-t border-gray-800 hover:bg-gray-800/50 transition-all">
              <td className="py-4 px-6">
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-12 h-12 object-cover rounded-lg border border-gray-700"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-xs">
                    N/A
                  </div>
                )}
              </td>
              <td className="py-4 px-6 truncate max-w-[200px]">{blog.title}</td>
              <td className="py-4 px-6">
                {blog.is_published ? "Published" : "Blocked"}
              </td>
              <td className="py-4 px-6">
                <button
                  onClick={() => handleToggleBlogPublish(blog.id, blog.is_published, blog.title)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all shadow-lg ${
                    blog.is_published
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {blog.is_published ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                </button>
              </td>
              <td className="py-4 px-6">
                <button
                  onClick={() => navigate(`/blogs/${blog.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-full"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {activeTab === "blogs" && (
        <div className="flex justify-center mt-6 mb-4">{renderPageNumbers()}</div>
      )}
    </div>
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition mb-8 self-start"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Management
        </h1>

        {/* Tab Navigation */}
        <div className="flex mb-8 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-full p-2">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center px-6 py-3 rounded-full transition-all ${
              activeTab === "users"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            <FaUsers className="mr-2" />
            Users Management
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`flex items-center px-6 py-3 rounded-full transition-all ${
              activeTab === "blogs"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            <FaBlog className="mr-2" />
            Blogs Management
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "users" && (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-center">All Users</h2>
            {users.length === 0 ? (
              <p className="text-gray-500 italic">No users found.</p>
            ) : (
              renderUsersTable()
            )}
          </>
        )}

        {activeTab === "blogs" && (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-center">All Blogs</h2>
            {blogs.length === 0 ? (
              <p className="text-gray-500 italic">No blogs found.</p>
            ) : (
              renderBlogsTable()
            )}
          </>
        )}
      </div>

      {/* User Confirmation Dialog */}
      <Dialog 
        open={userConfirmDialog.open} 
        onClose={() => setUserConfirmDialog({ open: false, userId: null, isActive: null, username: "" })}
        PaperProps={{
          style: {
            backgroundColor: '#1f2937',
            border: '1px solid #4b5563'
          }
        }}
      >
        <DialogTitle style={{ color: '#f3f4f6' }}>
          {userConfirmDialog.isActive ? 'Deactivate User' : 'Activate User'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: '#d1d5db' }}>
            Are you sure you want to {userConfirmDialog.isActive ? 'deactivate' : 'activate'} user "{userConfirmDialog.username}"? 
            {userConfirmDialog.isActive 
              ? ' This will prevent them from accessing their account.' 
              : ' This will restore their access to the platform.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setUserConfirmDialog({ open: false, userId: null, isActive: null, username: "" })} 
            style={{ color: '#9ca3af' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUserToggleConfirmed} 
            style={{ color: userConfirmDialog.isActive ? '#ef4444' : '#10b981' }}
          >
            {userConfirmDialog.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Blog Confirmation Dialog */}
      <Dialog 
        open={blogConfirmDialog.open} 
        onClose={() => setBlogConfirmDialog({ open: false, blogId: null, isPublished: null, title: "" })}
        PaperProps={{
          style: {
            backgroundColor: '#1f2937',
            border: '1px solid #4b5563'
          }
        }}
      >
        <DialogTitle style={{ color: '#f3f4f6' }}>
          {blogConfirmDialog.isPublished ? 'Block Blog' : 'Publish Blog'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: '#d1d5db' }}>
            Are you sure you want to {blogConfirmDialog.isPublished ? 'block' : 'publish'} the blog "{blogConfirmDialog.title}"?
            {blogConfirmDialog.isPublished 
              ? ' This will hide it from public view.' 
              : ' This will make it visible to all users.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setBlogConfirmDialog({ open: false, blogId: null, isPublished: null, title: "" })} 
            style={{ color: '#9ca3af' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleBlogToggleConfirmed} 
            style={{ color: blogConfirmDialog.isPublished ? '#ef4444' : '#10b981' }}
          >
            {blogConfirmDialog.isPublished ? 'Block' : 'Publish'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
}