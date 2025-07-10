import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import {
  FaArrowLeft,
  FaThumbsUp,
  FaThumbsDown,
  FaPen,
  FaUpload,
  FaDownload,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaFileAlt,
  FaImage,
  FaFilePdf,
  FaFile,
  FaTimes,
  FaSave,
  FaTrash,
  FaHeart,
  FaHeartBroken,
  FaComments
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import {
  markBlogAsSeen,
  likeBlog,
  unlikeBlog,
  fetchComments,
  createComment,
  toggleCommentApproval,
  updateBlog,
  deleteBlog,
} from "../redux/blog/blogThunk";

export default function BlogDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const blog = useSelector((state) =>
    state.blogs.items.find((item) => item.id === parseInt(id))
  );
  const user = useSelector((state) => state.auth.user);
  const comments = useSelector((state) => state.blogs.comments);

  const [newComment, setNewComment] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    content: "",
    image: "",
    attachment: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);

  const imageInputRef = useRef();
  const attachInputRef = useRef();

  useEffect(() => {
    if (!user) {
      toast.error("Login to view this blog");
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (blog) {
      setEditData({
        title: blog.title,
        content: blog.content,
        image: blog.image,
        attachment: blog.attachment,
      });
      if (!blog.interaction || !blog.interaction.seen) {
        dispatch(markBlogAsSeen(blog.id));
      }
    }
  }, [blog, dispatch]);

  useEffect(() => {
    if (user && id) {
      dispatch(fetchComments(id));
    }
  }, [id, user, dispatch]);

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-xl text-black">Loading blog...</p>
        </div>
      </div>
    );
  }

  const getFileType = (url) => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    if (['pdf'].includes(extension)) return 'pdf';
    return 'file';
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <FaImage />;
      case 'pdf': return <FaFilePdf />;
      default: return <FaFile />;
    }
  };

  const handleSaveEdit = () => {
    const payload = {
      title: editData.title,
      content: editData.content,
      image: editData.image,
      attachment: editData.attachment,
    };

    dispatch(updateBlog({ blogId: blog.id, data: payload }))
      .unwrap()
      .then(() => {
        toast.success("Blog updated successfully!");
        setEditMode(false);
        setPreviewImage(null);
        setPreviewAttachment(null);
      })
      .catch(() => toast.error("Failed to update blog"));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData({ ...editData, image: file });
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAttachmentSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData({ ...editData, attachment: file });
      const reader = new FileReader();
      reader.onload = (e) => setPreviewAttachment({ file, preview: e.target.result });
      reader.readAsDataURL(file);
    }
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    dispatch(createComment({ blogId: blog.id, content: newComment }))
      .unwrap()
      .then(() => {
        setNewComment("");
        toast.success("Comment added successfully!");
      })
      .catch(() => toast.error("Failed to add comment"));
  };

  const handleToggleApproval = (commentId) => {
    dispatch(toggleCommentApproval(commentId));
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      dispatch(deleteBlog(blog.id))
        .unwrap()
        .then(() => {
          toast.success("Blog deleted successfully!");
          navigate("/");
        })
        .catch(() => toast.error("Failed to delete"));
    }
  };

  const handleLike = async () => {
    try {
      await dispatch(likeBlog(blog.id)).unwrap();
    } catch (err) {
      toast.error(err || "Failed to like");
    }
  };

  const handleUnlike = async () => {
    try {
      await dispatch(unlikeBlog(blog.id)).unwrap();
    } catch (err) {
      toast.error(err || "Failed to unlike");
    }
  };

  const attachmentType = getFileType(blog.attachment);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-black transition-colors duration-200 border border-gray-300 px-6 py-3 rounded-md hover:border-black"
          >
            <FaArrowLeft className="mr-2" />
            Back to Blogs
          </button>
          
          {user?.is_superuser && (
            <div className="flex space-x-3">
              <button
                onClick={() => setEditMode(!editMode)}
                className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center"
              >
                <FaPen className="mr-2" /> 
                {editMode ? 'Cancel Edit' : 'Edit Blog'}
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center"
              >
                <FaTrash className="mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>

        {!editMode ? (
          <div className="max-w-5xl mx-auto">
            {/* Main Content */}
            <article className="bg-white border border-gray-200 rounded-lg shadow-sm mb-12">
              {/* Featured Image */}
              {blog.image && (
                <div className="w-full h-96 overflow-hidden rounded-t-lg">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-10">
                {/* Title */}
                <h1 className="text-4xl font-bold mb-8 text-black text-center leading-tight">
                  {blog.title}
                </h1>

                {/* Author and Meta Information */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {blog.author?.username?.charAt(0)?.toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-black text-lg">{blog.author?.username || 'Anonymous'}</p>
                      <p className="text-gray-600 text-sm">Author</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-8 text-gray-600 text-sm">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      <span>{new Date(blog.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center">
                      <FaEye className="mr-2" />
                      <span>{blog.read_count} reads</span>
                    </div>
                    <div className="flex items-center">
                      <FaComments className="mr-2" />
                      <span>{comments.length} comments</span>
                    </div>
                  </div>
                </div>

                {/* Interaction Buttons */}
                <div className="flex items-center justify-center space-x-6 mb-8 pb-8 border-b border-gray-200">
                  <button
                    onClick={handleLike}
                    className="flex items-center space-x-2 bg-white border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-md transition-colors"
                  >
                    <FaHeart className="text-red-500" />
                    <span className="text-black font-medium">{blog.likes || 0} Likes</span>
                  </button>
                  <button
                    onClick={handleUnlike}
                    className="flex items-center space-x-2 bg-white border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-md transition-colors"
                  >
                    <FaHeartBroken className="text-gray-500" />
                    <span className="text-black font-medium">{blog.unlikes || 0} Unlikes</span>
                  </button>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none text-center">
                  <div className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap max-w-4xl mx-auto">
                    {blog.content}
                  </div>
                </div>

                {/* Attachment Preview */}
                {blog.attachment && (
                  <div className="mt-12 p-8 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-xl font-semibold mb-6 flex items-center justify-center">
                      <FaFileAlt className="mr-2" />
                      Attachment
                    </h3>
                    
                    <div className="text-center">
                      {attachmentType === 'image' && (
                        <div className="space-y-4">
                          <img
                            src={blog.attachment}
                            alt="Blog attachment"
                            className="max-w-full h-auto rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow mx-auto"
                            onClick={() => setShowImagePreview(true)}
                          />
                          <button
                            onClick={() => setShowImagePreview(true)}
                            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center mx-auto"
                          >
                            <FaEye className="mr-2" />
                            View Full Size
                          </button>
                        </div>
                      )}

                      {attachmentType === 'pdf' && (
                        <div className="space-y-4">
                          <iframe
                            src={blog.attachment}
                            className="w-full h-96 rounded-lg border border-gray-300 mx-auto"
                            title="PDF Preview"
                          />
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={() => setShowAttachmentPreview(true)}
                              className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center"
                            >
                              <FaEye className="mr-2" />
                              View Full Screen
                            </button>
                            <a
                              href={blog.attachment}
                              download
                              className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors flex items-center"
                            >
                              <FaDownload className="mr-2" />
                              Download PDF
                            </a>
                          </div>
                        </div>
                      )}

                      {attachmentType === 'file' && (
                        <div className="flex items-center justify-center p-6 bg-white border border-gray-200 rounded-lg">
                          <div className="flex items-center mr-6">
                            {getFileIcon(attachmentType)}
                            <span className="ml-3 text-lg">Document Attachment</span>
                          </div>
                          <a
                            href={blog.attachment}
                            download
                            className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors flex items-center"
                          >
                            <FaDownload className="mr-2" />
                            Download
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </article>
          </div>
        ) : (
          /* Edit Mode */
          <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-10">
            <h2 className="text-3xl font-bold mb-8 text-center text-black">Edit Blog</h2>
            
            {/* Title Input */}
            <div className="mb-8">
              <label className="block text-lg font-medium mb-3 text-black">Title</label>
              <input
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                placeholder="Enter blog title..."
                className="w-full bg-white text-black p-4 rounded-md border border-gray-300 focus:border-black focus:outline-none transition-colors"
              />
            </div>

            {/* Content Input */}
            <div className="mb-8">
              <label className="block text-lg font-medium mb-3 text-black">Content</label>
              <textarea
                value={editData.content}
                onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                rows={8}
                placeholder="Write your blog content..."
                className="w-full bg-white text-black p-4 rounded-md border border-gray-300 focus:border-black focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="mb-8">
              <label className="block text-lg font-medium mb-3 text-black">Featured Image</label>
              <div className="space-y-4">
                {(previewImage || blog.image) && (
                  <div className="relative">
                    <img
                      src={previewImage || blog.image}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded text-sm">
                      {previewImage ? 'New Image' : 'Current Image'}
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <button
                    onClick={() => imageInputRef.current.click()}
                    className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors flex items-center mx-auto"
                  >
                    <FaUpload className="mr-2" />
                    {editData.image ? 'Change Image' : 'Upload Image'}
                  </button>
                </div>
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Attachment Upload */}
            <div className="mb-10">
              <label className="block text-lg font-medium mb-3 text-black">Attachment</label>
              <div className="space-y-4">
                {(previewAttachment || blog.attachment) && (
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-sm text-gray-600">
                        {previewAttachment ? 'New Attachment' : 'Current Attachment'}
                      </span>
                    </div>
                    
                    <div className="text-center">
                      {previewAttachment ? (
                        <div className="space-y-3">
                          {previewAttachment.file.type.startsWith('image/') ? (
                            <img
                              src={previewAttachment.preview}
                              alt="Attachment preview"
                              className="max-w-full h-48 object-cover rounded mx-auto border border-gray-200"
                            />
                          ) : (
                            <div className="flex items-center justify-center p-4 bg-white rounded border border-gray-200">
                              {getFileIcon(getFileType(previewAttachment.file.name))}
                              <span className="ml-3">{previewAttachment.file.name}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {getFileType(blog.attachment) === 'image' ? (
                            <img
                              src={blog.attachment}
                              alt="Current attachment"
                              className="max-w-full h-48 object-cover rounded mx-auto border border-gray-200"
                            />
                          ) : (
                            <div className="flex items-center justify-center p-4 bg-white rounded border border-gray-200">
                              {getFileIcon(getFileType(blog.attachment))}
                              <span className="ml-3">Current Attachment</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <button
                    onClick={() => attachInputRef.current.click()}
                    className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition-colors flex items-center mx-auto"
                  >
                    <FaUpload className="mr-2" />
                    {editData.attachment ? 'Change Attachment' : 'Upload Attachment'}
                  </button>
                </div>
                <input
                  type="file"
                  ref={attachInputRef}
                  onChange={handleAttachmentSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="text-center">
              <button
                onClick={handleSaveEdit}
                className="bg-black text-white px-10 py-4 rounded-md hover:bg-gray-800 transition-colors flex items-center text-lg font-semibold mx-auto"
              >
                <FaSave className="mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10">
            <h2 className="text-3xl font-bold mb-8 text-center text-black">
              Comments ({comments.length})
            </h2>
            
            {/* Add Comment */}
            <div className="mb-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                className="w-full bg-white text-black p-4 rounded-md border border-gray-300 focus:border-black focus:outline-none transition-colors resize-none"
                placeholder="Share your thoughts..."
              />
              <div className="text-center mt-4">
                <button
                  onClick={handleCommentSubmit}
                  className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-semibold"
                >
                  Post Comment
                </button>
              </div>
            </div>

            {/* Comments List */}
            {comments.length === 0 ? (
              <div className="text-center py-16">
                <FaComments className="mx-auto text-6xl text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex items-start space-x-4">
                      {comment.user?.profile_pic ? (
                        <img
                          src={comment.user.profile_pic}
                          alt={comment.user.username}
                          className="w-12 h-12 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                          <span className="text-white font-bold">
                            {comment.user?.username?.charAt(0)?.toUpperCase() || 'A'}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-semibold text-black">
                            {comment.user?.username || "Anonymous"}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {new Date(comment.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                        
                        {user?.is_superuser && (
                          <button
                            onClick={() => handleToggleApproval(comment.id)}
                            className={`mt-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              comment.is_approved
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                          >
                            {comment.is_approved ? "Block Comment" : "Approve Comment"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-5xl max-h-full">
            <button
              onClick={() => setShowImagePreview(false)}
              className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300"
            >
              <FaTimes />
            </button>
            <img
              src={blog.image}
              alt="Full size preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Attachment Preview Modal */}
      {showAttachmentPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full h-full max-w-6xl max-h-full">
            <button
              onClick={() => setShowAttachmentPreview(false)}
              className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 z-10"
            >
              <FaTimes />
            </button>
            <iframe
              src={blog.attachment}
              className="w-full h-full rounded-lg"
              title="Full Screen Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}