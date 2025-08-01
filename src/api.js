import axios from "axios";
import { store } from "./redux/store";
import { logout } from "./redux/auth/authThunk";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

const clearAuthData = () => {
  localStorage.removeItem("access_token");
  store.dispatch(logout());
  console.log("Current path:", window.location.pathname);
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log("Interceptor error caught:", error.response?.status, error.response?.data);

    if (
      error.response?.status === 403 &&
      typeof error.response.data?.detail === "string" &&
      error.response.data.detail.includes("inactive")
    ) {
      clearAuthData();
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}auth/token/refresh/`,
          {},
          { withCredentials: true }
        );
        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem("access_token", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearAuthData();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
