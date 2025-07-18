import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaComments, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import {
  fetchBlogComments,
  createComment,
  toggleCommentApproval,
  updateComment,
  deleteComment,
} from "../redux/blog/blogThunk";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const CommentsSection = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const comments = useSelector((state) => state.blogs.selectedComments);
  const commentsLoading = useSelector((state) => state.blogs.selectedCommentsLoading);
  const commentsError = useSelector((state) => state.blogs.selectedCommentsError);

  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  // Modal state
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogComments({ blogId: id }));
    }
  }, [id, dispatch]);

  const handleToggleApproval = (commentId) => {
    if (!user?.is_superuser) {
      toast.error("Only admins can toggle approval");
      return;
    }
    dispatch(toggleCommentApproval(commentId))
      .unwrap()
      .then(() => toast.success("Comment status updated"))
      .catch(() => toast.error("Failed to update comment status"));
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    dispatch(createComment({ blogId: id, content: newComment }))
      .unwrap()
      .then(() => {
        setNewComment("");
        toast.success("Comment added successfully!");
        dispatch(fetchBlogComments({ blogId: id })); // ✅ Reload only the comments
      })
      .catch(() => toast.error("Failed to add comment"));
  };

  const handleEditComment = (commentId) => {
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      setEditingCommentId(commentId);
      setEditingContent(comment.content);
    }
  };

  const handleUpdateComment = (commentId) => {
    if (!editingContent.trim()) return;
    dispatch(updateComment({ commentId, content: editingContent }))
      .unwrap()
      .then(() => {
        setEditingCommentId(null);
        setEditingContent("");
        toast.success("Comment updated successfully!");
        dispatch(fetchBlogComments({ blogId: id })); // ✅ Reload only comments
      })
      .catch(() => toast.error("Failed to update comment"));
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const confirmDeleteComment = (commentId) => {
    setCommentToDelete(commentId);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirmed = () => {
    if (commentToDelete) {
      dispatch(deleteComment(commentToDelete))
        .unwrap()
        .then(() => {
          toast.success("Comment deleted successfully!");
          dispatch(fetchBlogComments({ blogId: id })); // ✅ Reload only comments
        })
        .catch(() => toast.error("Failed to delete comment"))
        .finally(() => {
          setOpenDeleteModal(false);
          setCommentToDelete(null);
        });
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteModal(false);
    setCommentToDelete(null);
  };

  if (commentsLoading) {
    return <p className="text-center text-gray-400 py-10">Loading comments...</p>;
  }

  if (commentsError) {
    return <p className="text-center text-red-500 py-10">Failed to load comments</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 rounded-3xl p-12 shadow-2xl transition-all">

        {/* Add Comment */}
        <div className="mb-14 p-8 bg-gray-800/60 border border-gray-700 rounded-2xl shadow-inner">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={5}
            className="w-full bg-black/80 text-gray-200 p-5 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none transition-all resize-none text-lg"
            placeholder="Write your comment here..."
          />
          <div className="text-center mt-6">
            <button
              onClick={handleCommentSubmit}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 rounded-full transition-all font-semibold shadow-lg hover:shadow-purple-500/30 transform hover:scale-105"
            >
              Post Comment
            </button>
          </div>
        </div>

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-24">
            <FaComments className="mx-auto text-7xl text-gray-700 mb-6 opacity-40" />
            <p className="text-gray-400 text-xl italic">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-800/70 border border-gray-700 p-8 rounded-2xl transition-all hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10"
              >
                <div className="flex items-start space-x-5">
                  {comment.user?.profile_pic ? (
                    <img
                      src={comment.user.profile_pic}
                      alt={comment.user.username}
                      className="w-14 h-14 rounded-full object-cover border border-gray-700 shadow-md"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xl text-white shadow-md">
                      {comment.user?.username?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-4">
                        <span className="font-bold text-purple-400">
                          {comment.user?.username || "Anonymous"}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {new Date(comment.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {user?.id === comment.user?.id && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditComment(comment.id)}
                            className="text-gray-400 hover:text-purple-400 p-1 rounded transition-colors"
                            title="Edit comment"
                          >
                            <FaEdit className="text-sm" />
                          </button>
                          <button
                            onClick={() => confirmDeleteComment(comment.id)}
                            className="text-gray-400 hover:text-red-400 p-1 rounded transition-colors"
                            title="Delete comment"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      )}
                    </div>

                    {editingCommentId === comment.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          rows={3}
                          className="w-full bg-black/80 text-gray-200 p-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-all resize-none"
                        />
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateComment(comment.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center space-x-1"
                          >
                            <FaCheck className="text-xs" />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center space-x-1"
                          >
                            <FaTimes className="text-xs" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-300 leading-relaxed text-lg">
                        {comment.content}
                      </p>
                    )}

                    {user?.is_superuser && editingCommentId !== comment.id && (
                      <div className="mt-4">
                        <button
                          onClick={() => handleToggleApproval(comment.id)}
                          className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${
                            comment.is_approved
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                        >
                          {comment.is_approved ? "Block" : "Approve"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Dialog open={openDeleteModal} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmed} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CommentsSection;
