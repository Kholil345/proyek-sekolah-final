import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ArrowLeftIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { registerUser } from "../api/akun"; // Mengganti nama import agar lebih jelas

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password2: "",
    role: "ADMIN", // Nilai default
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      toast.error("Password dan konfirmasi password tidak cocok!");
      return;
    }

    setIsSubmitting(true);
    const dataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      dataToSubmit.append(key, value);
    });

    try {
      await registerUser(dataToSubmit);
      toast.success("Admin baru berhasil dibuat!");
      navigate("/dashboard"); // Arahkan ke dashboard atau halaman list user
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData) {
        Object.entries(errorData).forEach(([field, message]) => {
          if (Array.isArray(message)) {
            toast.error(`${field}: ${message.join(", ")}`);
          } else {
            toast.error(`${field}: ${message}`);
          }
        });
      } else {
        toast.error("Gagal membuat admin baru.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-shadow shadow-sm px-3 py-2.5";

  return (
    <div className="bg-slate-100 min-h-screen">
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 font-semibold"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Kembali
          </Link>
          <h1 className="text-xl font-bold text-slate-800">
            Registrasi Admin Baru
          </h1>
          <button
            type="submit"
            form="register-form"
            disabled={isSubmitting}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Mendaftarkan..." : "Daftarkan Admin"}
          </button>
        </div>
      </header>

      <motion.main
        className="p-4 sm:p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-full mx-auto">
          <form
            id="register-form"
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 rounded-xl shadow-md border border-slate-200"
          >
            <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-800 border-b border-slate-200 pb-4">
              <UserPlusIcon className="w-6 h-6 text-indigo-500" />
              Formulir Pendaftaran Akun
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Nama Depan
                </label>
                <input
                  type="text"
                  name="first_name"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Nama Belakang
                </label>
                <input
                  type="text"
                  name="last_name"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="password2"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  name="password2"
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Peran / Status
                </label>
                <select
                  name="role"
                  onChange={handleChange}
                  defaultValue="ADMIN"
                  required
                  className={`${inputClass} appearance-none`}
                >
                  <option value="ADMIN">Administrator</option>
                  <option value="BENDAHARA">Bendahara</option>
                  <option value="KEPALA_SEKOLAH">Kepala Sekolah</option>
                </select>
              </div>
            </div>
          </form>
        </div>
      </motion.main>
    </div>
  );
};

export default RegisterPage;
