import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const LoginPage: React.FC = () => {
  const { loginUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    try {
      await loginUser(e);
    } catch (error) {
      // AuthContext sudah menangani alert, kita hanya set submitting kembali
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Bagian Kiri (Form) */}
        <div className="p-8 md:p-12">
          <div className="mb-8 text-center lg:text-left">
            <img
              src="/img/logo.png"
              alt="Logo"
              className="w-16 h-16 mx-auto lg:mx-0 mb-4"
            />
            <h1 className="text-3xl font-bold text-slate-800">
              Selamat Datang Kembali
            </h1>
            <p className="text-slate-500 mt-1">
              Silakan login untuk mengakses dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  placeholder="Masukkan username Anda"
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="remember" className="text-slate-600">
                  Ingat saya
                </label>
              </div>
              <a
                href="#"
                className="font-semibold text-indigo-600 hover:underline"
              >
                Lupa password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Memproses..." : "Login"}
            </button>
          </form>
        </div>

        {/* Bagian Kanan (Gambar/Branding) */}
        <div className="hidden lg:block relative">
          <img
            src="/img/gedung.png" // <-- Ganti URL di sini
            alt="Gedung sekolah SMAS Bina Bhakti"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h2 className="text-2xl font-bold">
              Sistem Informasi Manajemen Sekolah
            </h2>
            <p className="mt-2 text-sm text-slate-200">
              Platform terpusat untuk mengelola semua data akademik dengan
              efisien dan modern.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
