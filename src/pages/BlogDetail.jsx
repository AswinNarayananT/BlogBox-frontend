import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaTrash, FaBan } from "react-icons/fa";
import { toast } from "react-hot-toast";
import {
  fetchBlogDetail,
  fetchBlogAttachments,
  markBlogAsSeen,
  deleteBlog,
  blockBlog,
} from "../redux/blog/blogThunk";
import AttachmentPreviewModal from "../components/AttachmentPreviewModal";
import ImagePreviewModal from "../components/ImagePreviewModal";
import CommentsSection from "../components/CommentsSection";
import BlogContentSection from "../components/BlogContentSection";
import AttachmentGrid from "../components/AttachmentGrid";
import BlogLoader from "../components/BlogLoader";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

export default function BlogDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const blog = useSelector((state) => state.blogs.selectedBlog);
  const user = useSelector((state) => state.auth.user);
  const attachments = useSelector((state) => state.blogs.selectedAttachments);

  const [imagePreview, setImagePreview] = useState({ show: false, url: null });
  const [attachmentPreview, setAttachmentPreview] = useState({
    show: false,
    url: null,
    type: null,
  });

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openBlockModal, setOpenBlockModal] = useState(false);

  const isAuthor = user?.id === blog?.author_id;
  const isAdmin = user?.is_superuser;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        await dispatch(fetchBlogDetail(id)).unwrap(); 
        dispatch(fetchBlogAttachments(id));
      } catch (error) {
        if (error?.status === 403 || error?.response?.status === 403) {
          navigate("/");
        } else {
          toast.error("An error occurred while loading the blog.");
        }
      }
    };

    loadBlog();
  }, [dispatch, id, navigate]);

  useEffect(() => {
    if (blog && (!blog.interaction || !blog.interaction.seen)) {
      dispatch(markBlogAsSeen(blog.id));
    }
  }, [blog, dispatch]);

  const getFileType = (url) => {
    if (!url) return "unknown";
    const ext = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
    if (["pdf"].includes(ext)) return "pdf";
    if (["mp4", "webm", "mov"].includes(ext)) return "video";
    return "file";
  };

  const handleImagePreview = (imageUrl) => {
    setImagePreview({ show: true, url: imageUrl });
  };

  const handleAttachmentPreview = (attachmentUrl, fileType) => {
    setAttachmentPreview({
      show: true,
      url: attachmentUrl,
      type: fileType || getFileType(attachmentUrl),
    });
  };

  const closeImagePreview = () => setImagePreview({ show: false, url: null });
  const closeAttachmentPreview = () =>
    setAttachmentPreview({ show: false, url: null, type: null });

  const handleDeleteConfirmed = () => {
    dispatch(deleteBlog(blog.id))
      .unwrap()
      .then(() => {
        toast.success("Blog deleted successfully!");
        navigate("/");
      })
      .catch(() => toast.error("Failed to delete"));
    setOpenDeleteModal(false);
  };

  const handleBlockConfirmed = () => {
    dispatch(blockBlog(blog.id))
      .unwrap()
      .then((res) => {
        const verb = res.is_published ? "unblocked" : "blocked";
        toast.success(`Blog ${verb} successfully!`);
      })
      .catch(() => toast.error("Failed to toggle blog visibility"));
    setOpenBlockModal(false);
  };

  if (!blog) return <BlogLoader />;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />

      <main className="flex-grow">
        {/* Back Button Container */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-200 text-sm sm:text-base font-medium"
            >
              <FaArrowLeft className="mr-2 text-sm" />
              <span className="hidden sm:inline">Back to Blogs</span>
              <span className="sm:hidden">Back</span>
            </button>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-6xl mx-auto">
            {/* Blog Content */}
            <div className="mb-8 lg:mb-12">
              <BlogContentSection
                blog={blog}
                setShowImagePreview={handleImagePreview}
                setShowAttachmentPreview={handleAttachmentPreview}
              />
            </div>

            {/* Attachments Section */}
            {attachments?.length > 0 && (
              <div className="mb-8 lg:mb-12">
                <AttachmentGrid
                  setShowImagePreview={handleImagePreview}
                  setShowAttachmentPreview={(url) =>
                    handleAttachmentPreview(url)
                  }
                />
              </div>
            )}

            {/* Comments Section */}
            <div className="mb-8 lg:mb-12">
              <CommentsSection />
            </div>

            {/* Admin/Author Actions */}
            {(isAuthor || isAdmin) && (
              <div className="border-t border-gray-800 pt-8">
                <div className="flex flex-col items-center space-y-4">
                  <h4 className="text-lg font-semibold text-gray-300 mb-2">
                    Blog Management
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                    {isAuthor && (
                      <button
                        onClick={() => setOpenDeleteModal(true)}
                        className="flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg transition-all duration-200 shadow-lg text-sm sm:text-base font-medium min-w-[140px]"
                      >
                        <FaTrash className="mr-2 text-sm" />
                        Delete Blog
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => setOpenBlockModal(true)}
                        className={`flex items-center justify-center ${
                          blog.is_published
                            ? "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                            : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        } text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg transition-all duration-200 shadow-lg text-sm sm:text-base font-medium min-w-[140px]`}
                      >
                        <FaBan className="mr-2 text-sm" />
                        {blog.is_published ? "Block Blog" : "Unblock Blog"}
                      </button>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 text-center max-w-md">
                    {isAuthor && isAdmin 
                      ? "As the author and admin, you can delete or block/unblock this blog."
                      : isAuthor 
                      ? "As the author, you can delete this blog."
                      : "As an admin, you can block/unblock this blog."
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        show={imagePreview.show}
        onClose={closeImagePreview}
        imageUrl={imagePreview.url}
      />

      {/* Attachment Preview Modal */}
      <AttachmentPreviewModal
        show={attachmentPreview.show}
        onClose={closeAttachmentPreview}
        attachmentUrl={attachmentPreview.url}
        type={attachmentPreview.type}
      />

      {/* Delete Confirmation Modal */}
      <Dialog 
        open={openDeleteModal} 
        onClose={() => setOpenDeleteModal(false)} 
        PaperProps={{ 
          className: "mx-4",
          style: {
            backgroundColor: '#1f2937',
            color: '#f3f4f6'
          }
        }}
      >
        <DialogTitle style={{ color: '#f3f4f6' }}>
          Delete Blog
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: '#d1d5db' }}>
            Are you sure you want to delete this blog? This action cannot be undone and will permanently remove the blog and all its comments.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteModal(false)} 
            style={{ color: '#9ca3af' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirmed} 
            style={{ color: '#ef4444' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Block/Unblock Confirmation Modal */}
      <Dialog 
        open={openBlockModal} 
        onClose={() => setOpenBlockModal(false)} 
        PaperProps={{ 
          className: "mx-4",
          style: {
            backgroundColor: '#1f2937',
            color: '#f3f4f6'
          }
        }}
      >
        <DialogTitle style={{ color: '#f3f4f6' }}>
          {blog.is_published ? "Block" : "Unblock"} Blog
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: '#d1d5db' }}>
            {blog.is_published
              ? "Are you sure you want to block this blog? It will be hidden from all users and won't appear in search results."
              : "Do you want to unblock this blog and make it visible to users again?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenBlockModal(false)} 
            style={{ color: '#9ca3af' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleBlockConfirmed} 
            style={{ color: blog.is_published ? '#f59e0b' : '#10b981' }}
          >
            {blog.is_published ? "Block" : "Unblock"}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
}