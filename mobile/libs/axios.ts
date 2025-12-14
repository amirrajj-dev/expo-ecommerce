import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { useEffect } from "react";

const url = process.env.EXPO_PUBLIC_BACKEND_URL;
const axiosInstance = axios.create({
  baseURL: url,
  headers : {
    "Content-Type" : "application/json"
  }
});

export const useApi = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(interceptor);
    };
  }, [getToken]);

  return axiosInstance;
};

export default axiosInstance;
