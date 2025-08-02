import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaFile, FaFilePdf, FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import {
  fetchBlogAttachments,
  createBlogAttachment,
  deleteAttachment,
} from "../redux/blog/blogThunk";
import { useParams } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const AttachmentGrid = ({
  setShowImagePreview,
  setShowAttachmentPreview,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const selectedBlog = useSelector((state) => state.blogs.selectedBlog);
  const attachments = useSelector((state) => state.blogs.selectedAttachments);
  const attachmentsLoading = useSelector(
    (state) => state.blogs.selectedAttachmentsLoading
  );
  const user = useSelector((state) => state.auth.user);

  const attachInputRef = useRef(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [attachmentToDelete, setAttachmentToDelete] = useState(null);
  const [deletingAttachmentId, setDeletingAttachmentId] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogAttachments(id));
    }
  }, [id, dispatch]);

  const isAuthor = user?.id === selectedBlog?.author_id;

  const handleDeleteClick = (attId) => {
    setAttachmentToDelete(attId);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirmed = () => {
    setDeletingAttachmentId(attachmentToDelete);
    dispatch(deleteAttachment(attachmentToDelete))
      .unwrap()
      .then(() => {
        toast.success("Attachment deleted!");
        setDeletingAttachmentId(null);
        setOpenDeleteModal(false);
      })
      .catch(() => {
        toast.error("Failed to delete attachment");
        setDeletingAttachmentId(null);
        setOpenDeleteModal(false);
      });
  };

  const handlePreview = (url) => {
    const type = getFileType(url);
    if (type === "image") {
      setShowImagePreview(url);
    } else {
      setShowAttachmentPreview(url);
    }
  };

  const handleAddAttachment = () => {
    attachInputRef.current.click();
  };

  const handleAttachmentSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!selectedBlog?.id) {
      toast.error("Blog ID not found!");
      return;
    }

    dispatch(createBlogAttachment({ blogId: selectedBlog.id, file }))
      .unwrap()
      .then(() => toast.success("Attachment uploaded!"))
      .catch(() => toast.error("Failed to upload attachment"));
  };

  const getFileName = (url) => url?.split("/").pop() || "Unknown file";

  const getFileType = (url) => {
    if (!url) return "unknown";
    const ext = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (["pdf"].includes(ext)) return "pdf";
    return "file";
  };

  return (
    <>
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <div className="mb-12">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
         Attachments
        </h3>
        <div className="w-full h-px bg-gradient-to-r from-purple-500 to-pink-500" />
      </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 mt-8 sm:mt-12">
          {attachments.map((att) => {
            const type = getFileType(att.file_url);
            return (
              <div
                key={att.id}
                className="bg-gray-900/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-700 shadow-lg flex flex-col items-center relative transition-all duration-200 hover:border-gray-600 hover:shadow-xl"
              >
                <div
                  onClick={() => handlePreview(att.file_url)}
                  className="cursor-pointer w-full text-center group"
                >
                  {type === "image" ? (
                    <div className="w-full h-16 sm:h-20 md:h-24 overflow-hidden rounded-lg mb-2">
                      <img
                        src={att.file_url}
                        alt="Attachment"
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      <p className="text-gray-300 text-xs sm:text-sm truncate px-1">
                        {getFileName(att.file_url)}
                      </p>
                    </div>
                  ) : type === "pdf" ? (
                    <>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-2 bg-red-600 rounded-lg flex items-center justify-center transition-colors duration-200 group-hover:bg-red-700">
                        <FaFilePdf className="text-white text-lg sm:text-xl" />
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm truncate px-1">
                        {getFileName(att.file_url)}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-2 bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200 group-hover:bg-gray-700">
                        <FaFile className="text-white text-lg sm:text-xl" />
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm truncate px-1">
                        {getFileName(att.file_url)}
                      </p>
                    </>
                  )}
                </div>

                {isAuthor && (
                  <button
                    onClick={() => handleDeleteClick(att.id)}
                    disabled={deletingAttachmentId === att.id}
                    className={`bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3 py-1 rounded-full text-xs mt-2 transition-all duration-200 flex items-center ${
                      deletingAttachmentId === att.id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <FaTrash className="inline mr-1" />
                    <span className="hidden sm:inline">
                      {deletingAttachmentId === att.id
                        ? "Deleting..."
                        : "Delete"}
                    </span>
                    <span className="sm:hidden">
                      {deletingAttachmentId === att.id ? "..." : "Del"}
                    </span>
                  </button>
                )}
              </div>
            );
          })}

          {isAuthor && (
            <div
              onClick={handleAddAttachment}
              className={`bg-gray-900/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-700 shadow-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-all duration-200 hover:shadow-xl min-h-[120px] sm:min-h-[140px] ${
                attachmentsLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-purple-600 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-purple-700">
                <FaPlus className="text-white text-lg sm:text-xl md:text-2xl" />
              </div>
              <p className="text-gray-300 text-xs sm:text-sm mt-2 text-center px-1">
                {attachmentsLoading ? "Updating..." : "Add Attachment"}
              </p>
            </div>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={attachInputRef}
        onChange={handleAttachmentSelect}
        className="hidden"
      />

      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        PaperProps={{
          className: "mx-4",
        }}
      >
        <DialogTitle className="text-base sm:text-lg">
          Delete Attachment
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="text-sm sm:text-base">
            Are you sure you want to delete this attachment? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="px-4 pb-4">
          <Button
            onClick={() => setOpenDeleteModal(false)}
            color="primary"
            size="small"
            className="text-xs sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirmed}
            color="error"
            size="small"
            className="text-xs sm:text-sm"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AttachmentGrid;
