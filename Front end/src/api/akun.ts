// src/api/akun.ts

import axios from "axios";
import axiosInstance from "./axiosInstance"; // 1. Impor instance axios terpusat untuk rute terproteksi
import { BASE_URL } from "./config"; // 2. Impor BASE_URL untuk rute publik

// 3. Fungsi 'getAuthAxios' dan impor 'AuthTokens' sudah tidak diperlukan lagi dan dihapus.

/**
 * Mendaftarkan user/admin baru.
 * Fungsi ini tidak memerlukan otentikasi, jadi kita menggunakan 'axios' biasa.
 * @param data Data formulir yang berisi detail user baru.
 */
export const registerUser = async (data: FormData) => {
  // Menggunakan axios biasa karena ini adalah endpoint publik.
  return axios.post(`${BASE_URL}/auth/register/`, data);
};

/**
 * Memperbarui profil user yang sedang login.
 * Menggunakan axiosInstance yang akan menyisipkan token otentikasi secara otomatis.
 * @param data Data formulir yang berisi pembaruan profil.
 */
export const updateProfile = async (data: FormData) => {
  // Langsung gunakan axiosInstance. Otentikasi sudah ditangani.
  return axiosInstance.put(`/auth/profile/update/`, data);
};

/**
 * Mengganti password user yang sedang login.
 * Menggunakan axiosInstance yang akan menyisipkan token otentikasi secara otomatis.
 * @param data Objek yang berisi password lama dan baru.
 */
export const changePassword = async (data: object) => {
  // Langsung gunakan axiosInstance. Otentikasi sudah ditangani.
  return axiosInstance.put(`/auth/change-password/`, data);
};
