import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";
import { uploadToCloudinary } from "../auth/authThunk";

export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async ({ skip = 0, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/blogs/?skip=${skip}&limit=${limit}`);
      console.log("Fetched blogs:", res.data);
      return res.data;
    } catch (err) {
         console.log("❌ Full Axios error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
  return rejectWithValue("Network error — check console & backend server.");
    }
  }
);

export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (blogData, { rejectWithValue }) => {
    try {
      let imageUrl = "";
      let attachmentUrl = "";

      if (blogData.image && typeof blogData.image !== "string") {
        imageUrl = await uploadToCloudinary(blogData.image);
      } else if (typeof blogData.image === "string") {
        imageUrl = blogData.image;
      }

      if (blogData.attachment && typeof blogData.attachment !== "string") {
        attachmentUrl = await uploadToCloudinary(blogData.attachment);
      } else if (typeof blogData.attachment === "string") {
        attachmentUrl = blogData.attachment;
      }

      const payload = {
        ...blogData,
        image: imageUrl || null,
        attachment: attachmentUrl || null,
      };

      const res = await api.post("/blogs/", payload);

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to create blog");
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ blogId, data }, { rejectWithValue }) => {
    try {
      let imageUrl = data.image;
      let attachmentUrl = data.attachment;

      if (data.image && typeof data.image !== "string") {
        imageUrl = await uploadToCloudinary(data.image);
        if (!imageUrl) {
          return rejectWithValue("Image upload failed");
        }
      }

      if (data.attachment && typeof data.attachment !== "string") {
        attachmentUrl = await uploadToCloudinary(data.attachment);
        if (!attachmentUrl) {
          return rejectWithValue("Attachment upload failed");
        }
      }

      const payload = {
        ...data,
        image: imageUrl || null,
        attachment: attachmentUrl || null,
      };

      const res = await api.patch(`/blogs/${blogId}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to update blog");
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/markAsSeen",
  async (blogId, { rejectWithValue }) => {
    try {
        console.log("jdslkj")
    } catch (err) {
      console.log("❌ Full Axios error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
      return rejectWithValue("Network error — check console & backend server.");
    }
  }
);


export const markBlogAsSeen = createAsyncThunk(
  "blogs/markAsSeen",
  async (blogId, { rejectWithValue }) => {
    try {
      const res = await api.post(`/blogs/${blogId}/mark-seen`);
      return { id: res.data.id, read_count: res.data.read_count };
    } catch (err) {
      console.log("❌ Full Axios error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
      return rejectWithValue("Network error — check console & backend server.");
    }
  }
);


export const likeBlog = createAsyncThunk(
  "blogs/likeBlog",
  async (blogId, { rejectWithValue }) => {
    try {
      console.log("Sending like request for blog:", blogId);
      const res = await api.post(`/blogs/${blogId}/like`);
      console.log("👍 Liked blog, updated data:", res.data);
      return res.data;
    } catch (err) {
      console.log("❌ Full Axios error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
      return rejectWithValue("Failed to like blog — see console for details.");
    }
  }
);

export const unlikeBlog = createAsyncThunk(
  "blogs/unlikeBlog",
  async (blogId, { rejectWithValue }) => {
    try {
      console.log("Sending unlike request for blog:", blogId);
      const res = await api.post(`/blogs/${blogId}/unlike`);
      console.log("👎 Unliked blog, updated data:", res.data);
      return res.data;
    } catch (err) {
      console.log("❌ Full Axios error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
      return rejectWithValue("Failed to unlike blog — see console for details.");
    }
  }
);


export const fetchComments = createAsyncThunk(
  "blogs/fetchComments",
  async (blogId, { rejectWithValue }) => {
    try {
      console.log("📄 Fetching comments for blog:", blogId);
      const res = await api.get(`/blogs/${blogId}/comments`);
      console.log("✅ Fetched comments:", res.data);
      return res.data;
    } catch (err) {
      console.log("❌ Failed to fetch comments:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
      return rejectWithValue("Failed to fetch comments — see console for details.");
    }
  }
);


export const createComment = createAsyncThunk(
  "blogs/createComment",
  async ({ blogId, content }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/blogs/${blogId}/comments`, {
        content,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to create comment");
    }
  }
);


export const toggleCommentApproval = createAsyncThunk(
  "blogs/toggleCommentApproval",
  async (commentId, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/blogs/comments/${commentId}/toggle-approval`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to toggle approval");
    }
  }
);