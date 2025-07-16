import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import {
  fetchBlogDetail,
  markBlogAsSeen,
  deleteBlog,
} from "../redux/blog/blogThunk";
import AttachmentPreviewModal from "../components/AttachmentPreviewModal ";
import ImagePreviewModal from "../components/ImagePreviewModal ";
import CommentsSection from "../components/CommentsSection ";
import BlogContentSection from "../components/BlogContentSection";
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

  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);

  // Modal state
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(fetchBlogDetail(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (blog && (!blog.interaction || !blog.interaction.seen)) {
      dispatch(markBlogAsSeen(blog.id));
    }
  }, [blog, dispatch]);

  if (!blog) {
    return <BlogLoader />;
  }

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

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />

      <main className="flex-grow flex flex-col items-center p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition mb-8 self-start"
        >
          <FaArrowLeft className="mr-2" />
          Back to Blogs
        </button>

        <div className="w-full max-w-6xl bg-black backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
          {/* Header actions */}
          <div className="flex flex-wrap justify-between items-center mb-14">
            <div></div>
            {user?.is_superuser && (
              <button
                onClick={() => setOpenDeleteModal(true)}
                className="flex items-center bg-gradient-to-r from-red-600 to-red-800 text-white px-7 py-3 rounded-full hover:from-red-700 hover:to-red-900 transition shadow-lg"
              >
                <FaTrash className="mr-2" />
                Delete
              </button>
            )}
          </div>

          {/* Content */}
          <BlogContentSection
            blog={blog}
            setShowImagePreview={setShowImagePreview}
            setShowAttachmentPreview={setShowAttachmentPreview}
          />

          {/* Comments */}
          <CommentsSection />
        </div>
      </main>

      {/* Modals */}
      <ImagePreviewModal
        show={showImagePreview}
        onClose={() => setShowImagePreview(false)}
        imageUrl={blog.image}
      />
      <AttachmentPreviewModal
        show={showAttachmentPreview}
        onClose={() => setShowAttachmentPreview(false)}
        attachmentUrl={blog.attachment}
      />

      {/* Delete confirmation modal */}
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      >
        <DialogTitle>Delete Blog</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this blog? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmed} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
}
