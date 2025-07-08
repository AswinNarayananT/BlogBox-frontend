import { createSlice } from "@reduxjs/toolkit";
import { fetchBlogs } from "./blogThunk";

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateInteraction(state, action) {
      const { blogId, seen, liked, unliked } = action.payload;
      const blog = state.items.find((b) => b.id === blogId);
      if (blog) {
        blog.interaction = { seen, liked, unliked };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null; // ✅ Reset error on success
        state.items = [...state.items, ...action.payload];
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateInteraction } = blogSlice.actions;
export default blogSlice.reducer;
