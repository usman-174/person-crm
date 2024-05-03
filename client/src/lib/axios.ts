import axios, { AxiosInstance, AxiosError } from "axios";
import { signOut } from "next-auth/react";

const axiosInstance: AxiosInstance = axios.create({
  // Your default configuration here
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // console.log("Error: ", error.response?.data);

    if (
      error.response &&
      (error.response.status === 401 ||
        (error.response.data as any).message.includes("Unauthorized") ||
        (error.response.data as any).message.includes("no token"))
    ) {
      // Redirect to signIn page
      await signOut();
      // const currentUrl = window.location.pathname;
      // const loginUrl = `/login?callbackUrl=${encodeURIComponent(currentUrl)}`;
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
