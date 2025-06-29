// src/pages/PendaftaranSukses.tsx

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const PendaftaranSukses: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <motion.div
        className="w-full max-w-lg text-center bg-white p-8 sm:p-12 rounded-2xl shadow-2xl border border-slate-200"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto" />

        <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-slate-800">
          Pendaftaran Berhasil!
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600">
          Terima kasih telah melakukan pendaftaran. Formulir Anda telah kami
          terima dan akan segera kami proses.
        </p>

        <div className="mt-8 text-left bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h3 className="font-semibold text-slate-700">Langkah Selanjutnya:</h3>
          <ul className="list-decimal list-inside mt-2 space-y-1 text-sm text-slate-500">
            <li>Tim kami akan memverifikasi data dan dokumen Anda.</li>
            <li>
              Anda akan menerima pemberitahuan melalui No. WhatsApp Orang Tua
              yang telah didaftarkan.
            </li>
            <li>
              Harap simpan bukti pendaftaran ini (Anda bisa screenshot halaman
              ini).
            </li>
          </ul>
        </div>

        <div className="mt-8">
          <Link
            to="/pendaftaran"
            className="inline-block w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
          >
            Kembali ke Halaman Utama
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PendaftaranSukses;
