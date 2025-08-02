import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaComments, FaEdit, FaTrash, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
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

  // Local loading states
  const [addingComment, setAddingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [updatingCommentId, setUpdatingCommentId] = useState(null);

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
    setAddingComment(true);
    dispatch(createComment({ blogId: id, content: newComment }))
      .unwrap()
      .then(() => {
        setNewComment("");
        toast.success("Comment added successfully!");
        dispatch(fetchBlogComments({ blogId: id }));
      })
      .catch(() => toast.error("Failed to add comment"))
      .finally(() => setAddingComment(false));
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
    setUpdatingCommentId(commentId);
    dispatch(updateComment({ commentId, content: editingContent }))
      .unwrap()
      .then(() => {
        setEditingCommentId(null);
        setEditingContent("");
        toast.success("Comment updated successfully!");
        dispatch(fetchBlogComments({ blogId: id }));
      })
      .catch(() => toast.error("Failed to update comment"))
      .finally(() => setUpdatingCommentId(null));
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
      setDeletingCommentId(commentToDelete);
      dispatch(deleteComment(commentToDelete))
        .unwrap()
        .then(() => {
          toast.success("Comment deleted successfully!");
          dispatch(fetchBlogComments({ blogId: id }));
        })
        .catch(() => toast.error("Failed to delete comment"))
        .finally(() => {
          setOpenDeleteModal(false);
          setCommentToDelete(null);
          setDeletingCommentId(null);
        });
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteModal(false);
    setCommentToDelete(null);
  };

  if (commentsLoading) {
    return (
      <div className="w-full px-6 sm:px-12 lg:px-20 py-8">
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="animate-spin text-2xl text-gray-400 mr-3" />
          <p className="text-gray-400 text-lg">Loading comments...</p>
        </div>
      </div>
    );
  }

  if (commentsError) {
    return (
      <div className="w-full px-6 sm:px-12 lg:px-20 py-8">
        <p className="text-center text-red-500 py-12 text-lg">Failed to load comments</p>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 mt-2 pt-5">
      {/* Comments Header */}
      <div className="mb-12">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Comments ({comments.length})
        </h3>
        <div className="w-full h-px bg-gradient-to-r from-purple-500 to-pink-500" />
      </div>

      {/* Add Comment Form */}
      <div className="mb-16 py-8">
        <h4 className="text-lg font-semibold text-gray-200 mb-6">Leave a comment</h4>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={4}
          className="w-full bg-transparent text-gray-100 p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none text-base placeholder-gray-400 border border-gray-600"
          placeholder="Share your thoughts..."
          disabled={addingComment}
        />
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-400">
            {newComment.length}/1000 characters
          </p>
          <button
            onClick={handleCommentSubmit}
            disabled={addingComment || !newComment.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg transition-all font-medium flex items-center gap-2"
          >
            {addingComment ? (
              <>
                <FaSpinner className="animate-spin text-sm" />
                <span>Posting...</span>
              </>
            ) : (
              "Post Comment"
            )}
          </button>
        </div>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-20">
          <div className="mb-6">
            <FaComments className="mx-auto text-6xl text-gray-600 opacity-50" />
          </div>
          <h4 className="text-xl font-semibold text-gray-300 mb-2">No comments yet</h4>
          <p className="text-gray-400">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-12">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`group transition-all duration-200 py-6 ${
                deletingCommentId === comment.id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {comment.user?.profile_pic ? (
                    <img
                      src={comment.user.profile_pic}
                      alt={comment.user.username}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center font-bold text-white text-lg">
                      {comment.user?.username?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Comment Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <span className="font-semibold text-gray-200 text-lg">
                        {comment.user?.username || "Anonymous"}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {new Date(comment.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    {user?.id === comment.user?.id && (
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {deletingCommentId === comment.id ? (
                          <FaSpinner className="animate-spin text-gray-400 text-sm" />
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditComment(comment.id)}
                              className="text-gray-400 hover:text-blue-400 p-2 hover:bg-white/10 rounded-lg transition-all"
                              title="Edit comment"
                              disabled={editingCommentId === comment.id}
                            >
                              <FaEdit className="text-sm" />
                            </button>
                            <button
                              onClick={() => confirmDeleteComment(comment.id)}
                              className="text-gray-400 hover:text-red-400 p-2 hover:bg-white/10 rounded-lg transition-all"
                              title="Delete comment"
                              disabled={editingCommentId === comment.id}
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Comment Content */}
                  {editingCommentId === comment.id ? (
                    <div className="space-y-4">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows={3}
                        className="w-full bg-transparent text-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none text-base border border-gray-600"
                        disabled={updatingCommentId === comment.id}
                      />
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          disabled={updatingCommentId === comment.id}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          {updatingCommentId === comment.id ? (
                            <FaSpinner className="animate-spin text-xs" />
                          ) : (
                            <FaCheck className="text-xs" />
                          )}
                          <span>{updatingCommentId === comment.id ? "Saving..." : "Save"}</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={updatingCommentId === comment.id}
                          className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2"
                        >
                          <FaTimes className="text-xs" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-300 leading-relaxed text-base sm:text-lg break-words mb-4">
                        {comment.content}
                      </p>

                      {/* Admin Actions */}
                      {user?.is_superuser && (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleApproval(comment.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              comment.is_approved
                                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            }`}
                          >
                            {comment.is_approved ? "Unapprove" : "Approve"}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog 
        open={openDeleteModal} 
        onClose={handleDeleteCancel}
        PaperProps={{
          style: {
            backgroundColor: '#1f2937',
            color: '#f3f4f6'
          }
        }}
      >
        <DialogTitle style={{ color: '#f3f4f6' }}>Delete Comment</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: '#d1d5db' }}>
            Are you sure you want to delete this comment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} style={{ color: '#9ca3af' }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmed} style={{ color: '#ef4444' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CommentsSection;