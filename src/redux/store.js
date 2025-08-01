import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import blogReducer from "./blog/blogSlice";
import userReducer from "./admin/userSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  blogs: blogReducer,
  users: userReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export { store };

