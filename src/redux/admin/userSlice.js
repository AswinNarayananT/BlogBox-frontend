import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers,toggleUserActive } from "./userThunk";

const userSlice = createSlice({
  name: "users",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       .addCase(toggleUserActive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleUserActive.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        const index = state.items.findIndex((user) => user.id === updatedUser.id);
        if (index !== -1) {
          state.items[index] = updatedUser;
        }
      })
      .addCase(toggleUserActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
