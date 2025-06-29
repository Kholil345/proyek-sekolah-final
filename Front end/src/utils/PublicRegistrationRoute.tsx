import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../api/config";
import PendaftaranTutup from "../pages/PendaftaranTutup";
import { motion } from "framer-motion";

// [UI/UX] Komponen baru untuk loading screen halaman penuh
const PageLoader: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <img
        src="/img/logo.png"
        alt="Logo Sekolah"
        className="w-24 h-24 mx-auto mb-6"
      />
      <div className="flex items-center justify-center space-x-2">
        {/* Spinner modern */}
        <div className="w-5 h-5 border-2 border-t-indigo-600 border-r-indigo-600 border-b-indigo-600 border-l-transparent rounded-full animate-spin"></div>
        <span className="text-lg font-medium text-slate-600">{message}</span>
      </div>
    </motion.div>
  </div>
);

const PublicRegistrationRoute: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    setTimeout(() => {
      axios
        .get(`${BASE_URL}/pengaturan/pendaftaran/status/`)
        .then((res) => setIsOpen(res.data.is_open))
        .catch(() => setIsOpen(false));
    }, 1000);
  }, []);

  // [UI/UX] Ganti teks loading dengan komponen PageLoader
  if (isOpen === null) {
    return <PageLoader message="Memeriksa Status Pendaftaran..." />;
  }

  return isOpen ? <Outlet /> : <PendaftaranTutup />;
};

export default PublicRegistrationRoute;
