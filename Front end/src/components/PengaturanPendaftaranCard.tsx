// src/components/PengaturanPendaftaranCard.tsx

import React, { useState, useEffect } from 'react';
import { getPengaturanPendaftaran, updatePengaturanPendaftaran } from '../api/pengaturan';
import { toast } from 'react-toastify';
import { MegaphoneIcon } from '@heroicons/react/24/outline';

const PengaturanPendaftaranCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getPengaturanPendaftaran();
        setIsOpen(res.is_open);
      } catch (error) {
        toast.error("Gagal memuat status pendaftaran.");
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleToggle = async () => {
    const newStatus = !isOpen;
    // Update UI langsung untuk respons yang cepat (Optimistic UI)
    setIsOpen(newStatus); 
    
    try {
      await updatePengaturanPendaftaran({ is_open: newStatus });
      toast.success(`Pendaftaran siswa berhasil ${newStatus ? 'DIBUKA' : 'DITUTUP'}.`);
    } catch (error) {
      // Jika gagal, kembalikan ke state semula
      setIsOpen(!newStatus);
      toast.error("Gagal mengubah status pendaftaran.");
    }
  };

  if (loading) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200 animate-pulse">
            <div className="h-6 bg-slate-200 rounded-md w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded-md w-full"></div>
            <div className="h-10 bg-slate-200 rounded-lg w-1/2 mt-4"></div>
        </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 h-full">
      <h3 className="flex items-center gap-3 text-lg font-semibold text-slate-800 mb-2">
        <MegaphoneIcon className="w-6 h-6 text-indigo-500"/>
        Status Pendaftaran
      </h3>
      <p className="text-sm text-slate-500 mb-4">
        Aktifkan untuk membuka formulir pendaftaran siswa baru untuk publik.
      </p>
      
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isOpen ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isOpen ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className={`text-sm font-semibold ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
            Pendaftaran {isOpen ? 'Dibuka' : 'Ditutup'}
        </span>
      </div>
    </div>
  );
};

export default PengaturanPendaftaranCard;