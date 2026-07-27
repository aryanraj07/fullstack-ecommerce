import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, tokenRefreshed: boolean) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(tokenRefreshed);
  });
  failedQueue = [];
};
// intereceprtor is the middleware
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // capturing the failed request
    // originalRequest contains url , method body ,headers
    const originalRequest = error.config;

    // If 401 + not already retrying
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;

      // If refresh already running, wait
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      isRefreshing = true;

      try {
        await axiosInstance.post("/auth/refresh"); // refresh cookies
        //releasing waitng requests telling refresh worked
        processQueue(null, true);
        //  this repeats the exact  api call but now with new access token and cookie
        return axiosInstance(originalRequest); // retry original request
      } catch (refreshError) {
        processQueue(refreshError, false);

        // redirect to login if refresh failed
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
