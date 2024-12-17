


import axios from "axios";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";

export default function useAxiosStore() {
  const router = useRouter();
  const axiosInstance = axios.create({
    // baseURL: import.meta.env.VITE_API_URL || "https://taskflow.local/api",
    baseURL: import.meta.env.VITE_API_URL,
    headers: { "Content-Type": "application/json" },
  });

  // Thêm interceptor để kiểm tra lỗi xác thực
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Nếu lỗi 401, điều hướng về login
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("accessToken"); // Xóa token cũ
        router.push({ name: "admin-login" });
      }
      return Promise.reject(error);
    }
  );

  const initializeAxios = (token) => {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  return { axiosInstance, initializeAxios };
}
