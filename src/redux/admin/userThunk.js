import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api"; 

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/admin/users/");
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch users");
  }
});


export const toggleUserActive = createAsyncThunk(
  "users/toggleUserActive",
  async ({ userId, isActive }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/toggle-active`, {
        is_active: isActive,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to update user status");
    }
  }
);
