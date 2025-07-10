import { createSlice } from "@reduxjs/toolkit";
import { fetchBlogs, createBlog, markBlogAsSeen, likeBlog, unlikeBlog, fetchComments, createComment, toggleCommentApproval, updateBlog } from "./blogThunk";


const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    items: [],
    loading: false,
    error: null,
    comments: [],       
    commentsLoading: false,
    commentsError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
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

      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = [action.payload, ...state.items];
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const updatedBlog = action.payload;

        const index = state.items.findIndex((item) => item.id === updatedBlog.id);
        if (index !== -1) {
          state.items[index] = updatedBlog;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(markBlogAsSeen.fulfilled, (state, action) => {
        const { id, read_count } = action.payload;
        const blog = state.items.find((b) => b.id === id);
        if (blog) {
          blog.read_count = read_count;
          if (blog.interaction) {
            blog.interaction.seen = true;
          }
        }
      })

      .addCase(likeBlog.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex((b) => b.id === updated.id);
        if (index !== -1) {
          state.items[index] = updated;
        }
      })
      .addCase(unlikeBlog.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex((b) => b.id === updated.id);
        if (index !== -1) {
          state.items[index] = updated;
        }
      })

      .addCase(fetchComments.pending, (state) => {
        state.commentsLoading = true;
        state.commentsError = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.commentsLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.commentsLoading = false;
        state.commentsError = action.payload;
      })

      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.comments = [...state.comments, action.payload];
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(toggleCommentApproval.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        state.comments = state.comments.map((c) =>
          c.id === updatedComment.id ? updatedComment : c
        );
      });

  },
});

export default blogSlice.reducer;
