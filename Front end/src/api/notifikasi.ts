// src/api/notifikasi.ts

import axiosInstance from "./axiosInstance"; // 1. Impor instance axios terpusat

// 2. Tidak ada lagi impor lain atau fungsi getAuthAxios yang diperlukan.

/**
 * Mengambil daftar notifikasi untuk user yang sedang login.
 * Menggunakan axiosInstance yang secara otomatis menangani header otentikasi.
 */
export const getNotifikasiList = async () => {
  // 3. Langsung gunakan axiosInstance untuk membuat permintaan GET.
  const response = await axiosInstance.get(`/notifikasi/`);
  return response; // Mengembalikan seluruh response agar bisa diakses .data di komponen
};

/**
 * Menandai notifikasi spesifik sebagai sudah dibaca.
 * @param id ID dari notifikasi yang akan ditandai.
 */
export const markNotifikasiAsRead = async (id: number) => {
  // 4. Langsung gunakan axiosInstance untuk membuat permintaan POST.
  return axiosInstance.post(`/notifikasi/${id}/mark_as_read/`);
};
