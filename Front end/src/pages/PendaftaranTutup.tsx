// src/pages/PendaftaranTutup.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/24/solid';

const PendaftaranTutup: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-md text-center bg-white p-8 rounded-2xl shadow-xl">
        <LockClosedIcon className="w-16 h-16 text-slate-400 mx-auto" />
        <h1 className="mt-6 text-2xl font-bold text-slate-800">
          Pendaftaran Ditutup
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Mohon maaf, saat ini pendaftaran siswa baru sedang tidak dibuka. Silakan kembali lagi nanti atau hubungi pihak sekolah untuk informasi lebih lanjut.
        </p>
      </div>
    </div>
  );
};

export default PendaftaranTutup;