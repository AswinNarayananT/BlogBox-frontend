import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const uploadToCloudinary = async (file) => {
  console.log("📁 Selected file to upload:", file);


  const sigRes = await axios.get(`${BASE_URL}auth/generate-signature`);
  const { signature, timestamp } = sigRes.data;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  try {
    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );

    console.log("🌥️ Cloudinary upload response:", uploadRes.data);

    return uploadRes.data.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error.response?.data || error.message);
    return "";
  }
};


export const register = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      let profilePicUrl = "";

      if (formData.profile_pic instanceof File) {
        profilePicUrl = await uploadToCloudinary(formData.profile_pic);
      }

      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profile_pic: profilePicUrl,
      };

      const res = await axios.post(`${BASE_URL}auth/register`, payload);
      return res.data;
    } catch (err) {
      console.error("Registration error:", err);
      let message = "Registration failed";

      if (err.response?.data?.detail) {
        message = err.response.data.detail;
      } else if (err.message) {
        message = err.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}auth/login`, {
        email,
        password,
      });

      localStorage.setItem("access_token", res.data.access_token);

      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Login failed");
    }
  }
);


export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${BASE_URL}auth/logout`);

      localStorage.removeItem("access_token");

      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Logout failed");
    }
  }
);


