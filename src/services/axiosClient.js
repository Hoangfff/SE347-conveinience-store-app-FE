import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Lấy từ file .env
  headers: {
    'Content-Type': 'application/json',
  },
});

// Có thể thêm interceptors để tự động gắn Token vào header ở đây
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;