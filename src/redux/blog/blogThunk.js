import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";
import { uploadToCloudinary } from "../auth/authThunk";

export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async ({ page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/blogs/?page=${page}&page_size=${pageSize}`);
      return res.data;
    } catch (err) {
      return rejectWithValue("Network error — check console & backend server.");
    }
  }
);

export const fetchMyBlogs = createAsyncThunk(
  "blogs/fetchMyBlogs",
  async ({ page = 1, page_size = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`blogs/myblogs/?page=${page}&page_size=${page_size}`);
      return response.data; // contains { data, pagination }
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Failed to fetch your blogs");
    }
  }
);


export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (blogData, { rejectWithValue }) => {
    try {
      let imageUrl = "";

      if (blogData.image && typeof blogData.image !== "string") {
        const uploadRes = await uploadToCloudinary(blogData.image);
        imageUrl = uploadRes.url;
      } else if (typeof blogData.image === "string") {
        imageUrl = blogData.image;
      }

      const payload = {
        title: blogData.title,
        content: blogData.content,
        image: imageUrl || null,
        is_published: blogData.is_published,
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
      let payload = { ...data };

       if (data.image && typeof data.image !== "string") {
        const uploadRes = await uploadToCloudinary(data.image);
        if (!uploadRes.url) return rejectWithValue("Image upload failed");
        payload.image = uploadRes.url; 
      }

      if (!("image" in data)) {
        delete payload.image;
      }

      const res = await api.patch(`/blogs/${blogId}`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to update blog");
    }
  }
);




export const fetchBlogDetail = createAsyncThunk(
  "blogs/fetchBlogDetail",
  async (blogId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/blogs/${blogId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch blog detail — see console for details.");
    }
  }
);


export const fetchBlogComments = createAsyncThunk(
  "blogs/fetchComments",
  async ({ blogId, skip = 0, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/blogs/${blogId}/comments?skip=${skip}&limit=${limit}`);
      return { comments: res.data, skip }; 
    } catch (err) {
      return rejectWithValue("Failed to fetch comments");
    }
  }
);


export const fetchBlogAttachments = createAsyncThunk(
  "blogs/fetchAttachments",
  async (blogId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/attachments/blog/${blogId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch attachments — see console for details.");
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (blogId, { rejectWithValue }) => {
    try {
        const res = await api.delete(`/blogs/${blogId}`);
        return res.data
    } catch (err) {
      return rejectWithValue("Network error — check console & backend server.");
    }
  }
);


export const blockBlog = createAsyncThunk(
  "blogs/deleteBlog",

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


export const deleteComment = createAsyncThunk(
  "blogs/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/blogs/comments/${commentId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to delete comment");
    }
  }
);

export const updateComment = createAsyncThunk(
  "blogs/updateComment",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/blogs/comments/${commentId}`, { content });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to update comment");
    }
  }
);


export const createBlogAttachment = createAsyncThunk(
  "blogs/createAttachment",
  async ({ blogId, file }, { rejectWithValue }) => {
    try {

      const { url, publicId } = await uploadToCloudinary(file);

      if (!url || !publicId) {
        throw new Error("Cloudinary upload failed");
      }

      const res = await api.post(`/attachments/blog/${blogId}`, {
        file_url: url,
        file_public_id: publicId,
      });

      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to create attachment");
    }
  }
);

export const deleteAttachment = createAsyncThunk(
  "blogs/deleteAttachment",
  async (attachmentId, { rejectWithValue }) => {
    try {
      await api.delete(`/attachments/${attachmentId}`);

      return attachmentId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to delete attachment");
    }
  }
);