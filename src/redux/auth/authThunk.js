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

    return {
      url: uploadRes.data.secure_url,
      publicId: uploadRes.data.public_id,
    };
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error.response?.data || error.message);
    return { url: "", publicId: "" };
  }
};


export const register = createAsyncThunk(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const res = await axios.post(`${BASE_URL}auth/register`, payload, {
        withCredentials: true,
      });

      localStorage.setItem("access_token", res.data.access_token);

      return res.data.user;
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
      const res = await axios.post(
        `${BASE_URL}auth/login`,
        { email, password },
        { withCredentials: true }
      );

      localStorage.setItem("access_token", res.data.access_token);

      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Login failed");
    }
  }
);


export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
      try {
        const res = await api.get("/auth/me");
      const user = res.data.user;

      if (!user || user.is_active === false) {
        return rejectWithValue("Your account is inactive.");
      }
      return user; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to fetch user");
    }
  }
);

export const updateUsername = createAsyncThunk(
  "auth/updateUsername",
  async (username, { rejectWithValue }) => {
    try {
      const res = await api.patch("/auth/update-profile", { username });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to update username");
    }
  }
);


export const updateProfilePic = createAsyncThunk(
  "auth/updateProfilePic",
  async (file, { rejectWithValue }) => {
    try {
      const { url } = await uploadToCloudinary(file);
      if (!url) throw new Error("Failed to upload image to Cloudinary");

      const res = await api.patch("/auth/update-profile", { profile_pic: url });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to update profile picture");
    }
  }
);


export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await api.put("/auth/change-password", passwordData );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to change password"
      );
    }
  }
);



export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");

      localStorage.removeItem("access_token");

      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Logout failed");
    }
  }
);


