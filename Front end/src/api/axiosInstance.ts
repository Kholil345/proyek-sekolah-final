// src/api/axiosInstance.ts

import axios from "axios";
import { BASE_URL } from "./config";
import { AuthTokens } from "../context/AuthContext";

// Buat instance axios dengan konfigurasi dasar
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Ini adalah bagian terpenting: INTERCEPTOR
// Kode ini akan berjalan PADA SETIAP permintaan yang menggunakan 'axiosInstance'
axiosInstance.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage TEPAT SEBELUM request dikirim
    const tokensString = localStorage.getItem("authTokens");

    if (tokensString) {
      const tokens: AuthTokens = JSON.parse(tokensString);
      // Jika token ada, tambahkan ke header Authorization
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config; // Lanjutkan request dengan config yang sudah dimodifikasi
  },
  (error) => {
    // Lakukan sesuatu jika ada error pada konfigurasi request
    return Promise.reject(error);
  }
);

export default axiosInstance;
