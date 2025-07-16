import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaFile,
  FaFileImage,
  FaFilePdf,
  FaPlus,
  FaDownload,
  FaTrash,
} from "react-icons/fa";
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

const AttachmentGrid = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const selectedBlog = useSelector((state) => state.blogs.selectedBlog);
  const attachments = useSelector((state) => state.blogs.selectedAttachments);
  const attachmentsLoading = useSelector((state) => state.blogs.selectedAttachmentsLoading);
  const user = useSelector((state) => state.auth.user);

  const attachInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);

  // Modal state
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [attachmentToDelete, setAttachmentToDelete] = useState(null);
  const [deletingAttachmentId, setDeletingAttachmentId] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogAttachments(id));
    }
  }, [id, dispatch]);

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

  const handlePreview = (url, type) => {
    setPreviewUrl(url);
    setPreviewType(type);
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

  const getFileName = (url) => {
    if (!url) return "Unknown file";
    return url.split("/").pop() || "Unknown file";
  };

  const getFileType = (url) => {
    if (!url) return "unknown";
    const ext = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (["pdf"].includes(ext)) return "pdf";
    return "file";
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-12">
        {attachments.map((att) => {
          const type = getFileType(att.file_url);
          return (
            <div
              key={att.id}
              className="bg-gray-900/60 rounded-2xl p-4 border border-gray-700 shadow-lg flex flex-col items-center relative"
            >
              <div
                onClick={() => handlePreview(att.file_url, type)}
                className="cursor-pointer w-full text-center"
              >
                {type === "image" ? (
                  <>
                    <img
                      src={att.file_url}
                      alt="Attachment"
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                    <p className="text-gray-300 text-xs">{getFileName(att.file_url)}</p>
                  </>
                ) : type === "pdf" ? (
                  <>
                    <div className="w-16 h-16 mx-auto mb-2 bg-red-600 rounded-lg flex items-center justify-center">
                      <FaFilePdf className="text-white text-xl" />
                    </div>
                    <p className="text-gray-300 text-xs">{getFileName(att.file_url)}</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-600 rounded-lg flex items-center justify-center">
                      <FaFile className="text-white text-xl" />
                    </div>
                    <p className="text-gray-300 text-xs">{getFileName(att.file_url)}</p>
                  </>
                )}
              </div>
              {user?.is_superuser && (
                <button
                  onClick={() => handleDeleteClick(att.id)}
                  disabled={deletingAttachmentId === att.id}
                  className={`bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-xs mt-2 ${
                    deletingAttachmentId === att.id ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FaTrash className="inline mr-1" />
                  {deletingAttachmentId === att.id ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          );
        })}

        {user?.is_superuser && (
          <div
            onClick={handleAddAttachment}
            className={`bg-gray-900/60 rounded-2xl p-4 border border-gray-700 shadow-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-all ${
              attachmentsLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center">
              <FaPlus className="text-white text-2xl" />
            </div>
            <p className="text-gray-300 text-sm mt-2">
              {attachmentsLoading ? "Updating..." : "Add Attachment"}
            </p>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={attachInputRef}
        onChange={handleAttachmentSelect}
        className="hidden"
      />

      {/* Big preview modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
          <div className="relative max-w-3xl w-full p-6">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-full"
            >
              Close
            </button>
            {previewType === "image" ? (
              <img src={previewUrl} alt="Preview" className="w-full rounded-lg" />
            ) : (
              <iframe
                src={previewUrl}
                title="Preview"
                className="w-full h-[80vh] rounded-lg"
              ></iframe>
            )}
            <div className="text-center mt-4">
              <a
                href={previewUrl}
                download
                className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg flex items-center justify-center mx-auto"
              >
                <FaDownload className="mr-2" />
                Download
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      >
        <DialogTitle>Delete Attachment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this attachment? This action cannot be undone.
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
    </>
  );
};

export default AttachmentGrid;
