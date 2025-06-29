// src/api/siswa.ts

import axios from "axios";
import axiosInstance from "./axiosInstance"; // Impor instance axios terpusat
import { BASE_URL } from "./config";

// Tipe data Siswa tidak berubah
export type Siswa = {
  id: number;
  nama_lengkap: string;
  nisn: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  nik: string;
  jenis_kelamin: "L" | "P";
  alamat: string;
  no_telepon: string;
  asal_sekolah: string;
  alamat_asal_sekolah: string;
  nama_ayah: string;
  nama_ibu: string;
  no_telepon_ortu: string;
  kelas: "X" | "XI" | "XII";
  foto_profil?: string;
  dok_kk: string;
  dok_akte: string;
  dok_ijazah: string;
  dok_ktp_ortu: string;
  dok_kip?: string;
};

/**
 * [FIX] Mengambil daftar siswa (perlu login).
 * Sekarang menggunakan axiosInstance untuk menyertakan token otentikasi.
 */
export const getSiswaList = async (
  page = 1,
  search = "",
  kelas = "",
  status = ""
) => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (kelas) params.append("kelas", kelas);

  // Menggunakan axiosInstance karena endpoint ini memerlukan otentikasi
  const res = await axiosInstance.get(`/siswa/?${params.toString()}`);
  return res.data; // axios respons datanya ada di .data
};

/**
 * Mengambil detail siswa spesifik (perlu login).
 */
export const getSiswaDetail = async (id: number) => {
  const res = await axiosInstance.get(`/siswa/${id}/`);
  return res.data;
};

/**
 * Membuat data siswa baru (publik, untuk formulir pendaftaran).
 */
export const createSiswa = async (data: FormData) => {
  return axios.post(`${BASE_URL}/siswa/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Menghapus data siswa (perlu login).
 */
export const deleteSiswa = async (id: number) => {
  return axiosInstance.delete(`/siswa/${id}/`);
};

/**
 * Memperbarui data siswa (perlu login).
 */
export const updateSiswa = async (
  id: number,
  data: FormData,
  onProgress: (progress: number) => void
) => {
  return axiosInstance.put(`/siswa/${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Tipe data untuk filter statistik
interface StatistikFilter {
  tahunAjaran: string;
  semester: string;
}

/**
 * Mengambil data statistik siswa (perlu login).
 */
export const getStatistikSiswa = async (filters: StatistikFilter) => {
  const res = await axiosInstance.get(`/statistik-siswa/`, {
    params: {
      tahunAjaran: filters.tahunAjaran,
      semester: filters.semester,
    },
  });
  return res.data;
};
