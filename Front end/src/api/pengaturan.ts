// src/api/pengaturan.ts

import axiosInstance from "./axiosInstance"; // 1. Impor instance axios terpusat

// 2. Tidak ada lagi impor 'axios', 'AuthTokens', atau fungsi 'getAuthAxios'.
//    Semua sudah ditangani oleh axiosInstance.

/**
 * Mengambil pengaturan pendaftaran saat ini dari server.
 * Menggunakan instance axios terpusat yang sudah menangani otentikasi.
 */
export const getPengaturanPendaftaran = async () => {
  // 3. Langsung gunakan axiosInstance untuk membuat permintaan GET.
  //    Endpoint '/pengaturan/pendaftaran/1/' akan otomatis digabung dengan BASE_URL.
  const response = await axiosInstance.get(`/pengaturan/pendaftaran/1/`);
  return response.data;
};

/**
 * Memperbarui pengaturan pendaftaran di server.
 * @param data Objek yang berisi status baru, contoh: { is_open: boolean }
 */
export const updatePengaturanPendaftaran = async (data: {
  is_open: boolean;
}) => {
  // 4. Langsung gunakan axiosInstance untuk membuat permintaan PATCH.
  //    Token otentikasi akan ditambahkan secara otomatis oleh interceptor.
  return axiosInstance.patch(`/pengaturan/pendaftaran/1/`, data);
};
