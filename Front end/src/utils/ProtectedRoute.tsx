// src/utils/ProtectedRoute.tsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../components/PageLoader"; // 1. Impor komponen PageLoader

const ProtectedRoute: React.FC = () => {
  // 2. Ambil 'user' dan 'loading' dari AuthContext
  const { user, loading } = useAuth();

  // 3. Jika context masih memuat status autentikasi, tampilkan layar loading
  // Ini adalah kunci untuk mencegah race condition.
  if (loading) {
    return <PageLoader message="Mempersiapkan sesi Anda..." />;
  }

  // 4. Setelah loading selesai, baru periksa apakah user ada (sudah login)
  // Jika ada, tampilkan halaman yang diminta. Jika tidak, arahkan ke login.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
