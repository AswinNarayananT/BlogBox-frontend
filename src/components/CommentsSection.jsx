import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaComments, FaEdit, FaTrash, FaCheck, FaTimes, FaSpinner, FaUserCheck, FaUserTimes } from "react-icons/fa";
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
  const skip = useSelector((state) => state.blogs.selectedCommentsSkip);
  const limit = useSelector((state) => state.blogs.selectedCommentsLimit);
  const total = useSelector((state) => state.blogs.selectedCommentsTotal);


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

  const handleLoadMore = () => {
  if (id) {
    dispatch(fetchBlogComments({ blogId: id, skip: comments.length, limit }));
  }
};


  if (commentsLoading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-xl text-gray-400 mr-2" />
          <p className="text-gray-400 text-sm sm:text-base">Loading comments...</p>
        </div>
      </div>
    );
  }

  if (commentsError) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center text-red-500 py-8 text-sm sm:text-base">Failed to load comments</p>
      </div>
    );
  }

  return (
    <div className="w-full px-3 sm:px-4 lg:px-6 mt-2 pt-4">
      {/* Comments Header */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">
          Comments ({comments.length})
        </h3>
        <div className="w-full h-px bg-gradient-to-r from-purple-500 to-pink-500" />
      </div>

      {/* Add Comment Form */}
      <div className="mb-8 sm:mb-10 py-4 sm:py-6">
        <h4 className="text-base sm:text-lg font-semibold text-gray-200 mb-4">Leave a comment</h4>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          className="w-full bg-transparent text-gray-100 p-3 sm:p-4 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none text-sm sm:text-base placeholder-gray-400 border border-gray-600"
          placeholder="Share your thoughts..."
          disabled={addingComment}
        />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2">
          <p className="text-xs sm:text-sm text-gray-400">
            {newComment.length}/1000 characters
          </p>
          <button
            onClick={handleCommentSubmit}
            disabled={addingComment || !newComment.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-all font-medium flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
          >
            {addingComment ? (
              <>
                <FaSpinner className="animate-spin text-xs sm:text-sm" />
                <span className="hidden xs:inline">Posting...</span>
                <span className="xs:hidden">Post</span>
              </>
            ) : (
              "Post Comment"
            )}
          </button>
        </div>
      </div>

    {/* Comments List */}
{comments.length === 0 ? (
  <div className="text-center py-12 sm:py-16">
    <div className="mb-4">
      <FaComments className="mx-auto text-4xl sm:text-5xl text-gray-600 opacity-50" />
    </div>
    <h4 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">No comments yet</h4>
    <p className="text-sm sm:text-base text-gray-400">Be the first to share your thoughts!</p>
  </div>
) : (
  <>
    <div className="space-y-4 sm:space-y-6">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className={`group transition-all duration-200 py-3 sm:py-4 ${
            deletingCommentId === comment.id ? 'opacity-50' : ''
          }`}
        >
          <div className="flex gap-3 sm:gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {comment.user?.profile_pic ? (
                <img
                  src={comment.user.profile_pic}
                  alt={comment.user.username}
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center font-bold text-white text-sm sm:text-base">
                  {comment.user?.username?.charAt(0)?.toUpperCase() || "A"}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {/* Comment Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-3 gap-1 sm:gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="font-semibold text-gray-200 text-sm sm:text-base">
                    {comment.user?.username || "Anonymous"}
                  </span>
                  <span className="text-gray-400 text-xs sm:text-sm">
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
                <div className="flex items-center gap-1 opacity-100 transition-opacity">
                  {user?.is_superuser && (
                    <button
                      onClick={() => handleToggleApproval(comment.id)}
                      className={`p-1.5 sm:p-2 md:p-2.5 lg:p-2 xl:p-2.5 hover:bg-white/20 rounded-lg transition-all ${
                        comment.is_approved
                          ? "text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20"
                          : "text-green-400 hover:text-green-300 bg-green-500/10 hover:bg-green-500/20"
                      }`}
                      title={comment.is_approved ? "Unapprove comment" : "Approve comment"}
                    >
                      {comment.is_approved ? (
                        <FaUserTimes className="text-xs sm:text-sm md:text-base lg:text-sm xl:text-base" />
                      ) : (
                        <FaUserCheck className="text-xs sm:text-sm md:text-base lg:text-sm xl:text-base" />
                      )}
                    </button>
                  )}

                  {user?.id === comment.user?.id && (
                    <>
                      {deletingCommentId === comment.id ? (
                        <FaSpinner className="animate-spin text-gray-400 text-xs sm:text-sm md:text-base lg:text-sm xl:text-base p-1.5 sm:p-2 md:p-2.5 lg:p-2 xl:p-2.5 bg-white/10 rounded-lg" />
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditComment(comment.id)}
                            className="text-gray-400 hover:text-blue-400 p-1.5 sm:p-2 md:p-2.5 lg:p-2 xl:p-2.5 hover:bg-white/20 bg-white/10 rounded-lg transition-all"
                            title="Edit comment"
                            disabled={editingCommentId === comment.id}
                          >
                            <FaEdit className="text-xs sm:text-sm md:text-base lg:text-sm xl:text-base" />
                          </button>
                          <button
                            onClick={() => confirmDeleteComment(comment.id)}
                            className="text-gray-400 hover:text-red-400 p-1.5 sm:p-2 md:p-2.5 lg:p-2 xl:p-2.5 hover:bg-white/20 bg-white/10 rounded-lg transition-all"
                            title="Delete comment"
                            disabled={editingCommentId === comment.id}
                          >
                            <FaTrash className="text-xs sm:text-sm md:text-base lg:text-sm xl:text-base" />
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Comment Content */}
              {editingCommentId === comment.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    rows={3}
                    className="w-full bg-transparent text-gray-100 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none text-sm sm:text-base border border-gray-600"
                    disabled={updatingCommentId === comment.id}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateComment(comment.id)}
                      disabled={updatingCommentId === comment.id}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all flex items-center gap-1"
                    >
                      {updatingCommentId === comment.id ? (
                        <FaSpinner className="animate-spin text-xs" />
                      ) : (
                        <FaCheck className="text-xs" />
                      )}
                      <span className="hidden xs:inline">
                        {updatingCommentId === comment.id ? "Saving..." : "Save"}
                      </span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={updatingCommentId === comment.id}
                      className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-all flex items-center gap-1"
                    >
                      <FaTimes className="text-xs" />
                      <span className="hidden xs:inline">Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base break-words">
                  {comment.content}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Load More Button */}
    {comments.length < total && (
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleLoadMore}
          disabled={commentsLoading}
          className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg text-sm sm:text-base flex items-center gap-2"
        >
          {commentsLoading ? (
            <>
              <FaSpinner className="animate-spin text-sm" />
              Loading...
            </>
          ) : (
            "Load More Comments"
          )}
        </button>
      </div>
    )}
  </>
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