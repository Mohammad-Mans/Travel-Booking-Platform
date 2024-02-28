import axios, { AxiosError } from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export default axios.create({
  baseURL,
});

const plainAxiosInstance = axios.create({
  baseURL,
});

const axiosInstanceWithInterceptors = axios.create({
  baseURL,
});

axiosInstanceWithInterceptors.interceptors.request.use(
  (config) => {
    const userData = JSON.parse(localStorage.getItem("user_data") ?? "");
    const accessToken = userData.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstanceWithInterceptors.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const axiosError = error as AxiosError;
    if (!axiosError?.response) {
      console.error("No Server Response");
    } else if (axiosError.response?.status === 401) {
      console.error("Unauthorized Access");
    } else {
      console.error("Request Failed");
    }
    return Promise.reject(error);
  }
);

export { plainAxiosInstance, axiosInstanceWithInterceptors};
