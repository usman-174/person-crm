import axios, { AxiosInstance, AxiosError } from "axios";

const axiosInstance: AxiosInstance = axios.create({
  // Your default configuration here
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    console.log("Error: ", error.response?.data);
    
    if (
      error.response &&
      (error.response.status === 401 ||
        (error.response.data as any).message.includes("Unauthorized") ||
        (error.response.data as any).message.includes("no token"))
    ) {
      // Redirect to signIn page
      window.location.href = "/signIn"; // Change "/signIn" to your signIn page route
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;