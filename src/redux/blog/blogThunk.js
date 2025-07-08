import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

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



