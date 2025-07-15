import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBlogs,
  createBlog,
  markBlogAsSeen,
  likeBlog,
  unlikeBlog,
  updateBlog,
  deleteBlog,
  fetchBlogDetail,
  fetchBlogComments,
  fetchBlogAttachments,
  createComment,
  toggleCommentApproval,
  updateComment,
  deleteComment,
  createBlogAttachment,
  deleteAttachment,
} from "./blogThunk";

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    items: [],
    loading: false,
    error: null,

    // Selected blog detail
    selectedBlog: null,
    selectedLoading: false,
    selectedError: null,

    // Comments for selected blog
    selectedComments: [],
    selectedCommentsLoading: false,
    selectedCommentsError: null,

    // Attachments for selected blog
    selectedAttachments: [],
    selectedAttachmentsLoading: false,
    selectedAttachmentsError: null,
  },
  reducers: {
    clearSelectedBlog(state) {
      state.selectedBlog = null;
      state.selectedComments = [];
      state.selectedAttachments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // All blogs list
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.skip === 0) {
          state.items = action.payload;
        } else {
          const existingIds = state.items.map((b) => b.id);
          const newBlogs = action.payload.filter((b) => !existingIds.includes(b.id));
          state.items = [...state.items, ...newBlogs];
        }
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [action.payload, ...state.items];
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update blog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBlog = action.payload;
        const index = state.items.findIndex((item) => item.id === updatedBlog.id);
        if (index !== -1) {
          state.items[index] = updatedBlog;
        }

        if (state.selectedBlog && state.selectedBlog.id === updatedBlog.id) {
          state.selectedBlog = updatedBlog;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        const deletedBlog = action.payload;

        state.items = state.items.filter((item) => item.id !== deletedBlog.id);

        if (state.selectedBlog && state.selectedBlog.id === deletedBlog.id) {
          state.selectedBlog = null;
        }
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark as seen
      .addCase(markBlogAsSeen.fulfilled, (state, action) => {
        const { id, read_count } = action.payload;
        const blog = state.items.find((b) => b.id === id);
        if (blog) {
          blog.read_count = read_count;
          if (blog.interaction) {
            blog.interaction.seen = true;
          }
        }

        if (state.selectedBlog && state.selectedBlog.id === id) {
          state.selectedBlog.read_count = read_count;
          if (state.selectedBlog.interaction) {
            state.selectedBlog.interaction.seen = true;
          }
        }
      })

      // Like
      .addCase(likeBlog.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex((b) => b.id === updated.id);
        if (index !== -1) {
          state.items[index] = updated;
        }

        if (state.selectedBlog && state.selectedBlog.id === updated.id) {
          state.selectedBlog = updated;
        }
      })

      // Unlike
      .addCase(unlikeBlog.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex((b) => b.id === updated.id);
        if (index !== -1) {
          state.items[index] = updated;
        }

        // ✅ Also update selectedBlog
        if (state.selectedBlog && state.selectedBlog.id === updated.id) {
          state.selectedBlog = updated;
        }
      })

      // Fetch blog detail
      .addCase(fetchBlogDetail.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
        state.selectedBlog = null;
      })
      .addCase(fetchBlogDetail.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selectedBlog = action.payload;
      })
      .addCase(fetchBlogDetail.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = action.payload;
      })

      // Fetch comments 
      .addCase(fetchBlogComments.pending, (state) => {
        state.selectedCommentsLoading = true;
        state.selectedCommentsError = null;
      })
      .addCase(fetchBlogComments.fulfilled, (state, action) => {
        state.selectedCommentsLoading = false;
        state.selectedCommentsError = null;

        if (action.payload.skip === 0) {
          state.selectedComments = action.payload.comments;
        } else {
          state.selectedComments = [...state.selectedComments, ...action.payload.comments];
        }
      })
      .addCase(fetchBlogComments.rejected, (state, action) => {
        state.selectedCommentsLoading = false;
        state.selectedCommentsError = action.payload;
      })

      // Fetch attachments
      .addCase(fetchBlogAttachments.pending, (state) => {
        state.selectedAttachmentsLoading = true;
        state.selectedAttachmentsError = null;
      })
      .addCase(fetchBlogAttachments.fulfilled, (state, action) => {
        state.selectedAttachmentsLoading = false;
        state.selectedAttachments = action.payload;
      })
      .addCase(fetchBlogAttachments.rejected, (state, action) => {
        state.selectedAttachmentsLoading = false;
        state.selectedAttachmentsError = action.payload;
      })

      // Create comment
      .addCase(createComment.pending, (state) => {
        state.selectedCommentsLoading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.selectedCommentsLoading = false;
        state.selectedComments = [...state.selectedComments, action.payload];
      })
      .addCase(createComment.rejected, (state, action) => {
        state.selectedCommentsLoading = false;
        state.selectedCommentsError = action.payload;
      })

      //update comment

      .addCase(updateComment.pending, (state) => {
        state.selectedCommentsLoading = true;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.selectedCommentsLoading = false;
        const updated = action.payload;
        const index = state.selectedComments.findIndex((c) => c.id === updated.id);
        if (index !== -1) {
          state.selectedComments[index] = updated;
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.selectedCommentsLoading = false;
        state.selectedCommentsError = action.payload;
      })

      //delete comment
      .addCase(deleteComment.pending, (state) => {
        state.selectedCommentsLoading = true;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.selectedCommentsLoading = false;
        // Remove deleted comment by id
        state.selectedComments = state.selectedComments.filter(
          (comment) => comment.id !== action.payload.id
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.selectedCommentsLoading = false;
        state.selectedCommentsError = action.payload;
      })


      // Toggle comment approval
      .addCase(toggleCommentApproval.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        state.selectedComments = state.selectedComments.map((c) =>
          c.id === updatedComment.id ? updatedComment : c
        );
      })

      // Create attachment
      .addCase(createBlogAttachment.pending, (state) => {
        state.selectedAttachmentsLoading = true;
        state.selectedAttachmentsError = null;
      })
      .addCase(createBlogAttachment.fulfilled, (state, action) => {
        state.selectedAttachmentsLoading = false;
        // Add new attachment to existing array
        state.selectedAttachments.push(action.payload);
      })
      .addCase(createBlogAttachment.rejected, (state, action) => {
        state.selectedAttachmentsLoading = false;
        state.selectedAttachmentsError = action.payload;
      })

      // Delete attachment
      .addCase(deleteAttachment.pending, (state) => {
        state.selectedAttachmentsLoading = true;
        state.selectedAttachmentsError = null;
      })
      .addCase(deleteAttachment.fulfilled, (state, action) => {
        state.selectedAttachmentsLoading = false;
        // Remove the deleted attachment from state
        state.selectedAttachments = state.selectedAttachments.filter(
          (att) => att.id !== action.payload
        );
      })
      .addCase(deleteAttachment.rejected, (state, action) => {
        state.selectedAttachmentsLoading = false;
        state.selectedAttachmentsError = action.payload;
      });
  },
});

export const { clearSelectedBlog } = blogSlice.actions;
export default blogSlice.reducer;
