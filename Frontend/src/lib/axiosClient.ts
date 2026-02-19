// lib/axiosClient.ts
import axios from "axios";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


// ✅ REQUEST INTERCEPTOR
axiosClient.interceptors.request.use(
  (config) => {

    if (typeof window !== "undefined") {

      const token = localStorage.getItem("access_token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const guestId = localStorage.getItem("guest_id");

      if (guestId) {
        config.headers["X-Guest-Id"] = guestId;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);



// ✅ RESPONSE INTERCEPTOR (AUTO REFRESH TOKEN)
axiosClient.interceptors.response.use(
  (response) => {

    // store guest id automatically
    if (typeof window !== "undefined") {
      if (response.data?.guest_id) {
        localStorage.setItem("guest_id", response.data.guest_id);
      }
    }

    return response;
  },

  async (error) => {

    const originalRequest = error.config;

    // 🔥 Prevent infinite retry loop
    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      if (typeof window !== "undefined") {

        const refresh = localStorage.getItem("refresh_token");

        // No refresh → logout
        if (!refresh) {
          localStorage.clear();
          return Promise.reject(error);
        }

        try {

          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh/`,
            { refresh },
            {withCredentials: true}
          );

          const newAccess = res.data.access;

          localStorage.setItem("access_token", newAccess);

          // attach new token
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;

          return axiosClient(originalRequest);

        } catch (refreshError) {

          // refresh failed → logout
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);
