import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSiswa } from "../api/siswa";
import { toast } from "react-toastify";
import {
  ArrowLeftIcon,
  UserCircleIcon,
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CameraIcon,
  CloudArrowUpIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Tipe Data untuk Form
interface SiswaFormData {
  [key: string]: string | File | null;
}

// --- Komponen-komponen UI Kecil ---

const UploadProgressModal: React.FC = () => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center shadow-2xl">
      <CloudArrowUpIcon className="w-12 h-12 text-indigo-500 mx-auto mb-4 animate-bounce" />
      <h3 className="text-lg font-semibold text-slate-800">
        Menyimpan Data...
      </h3>
      <p className="text-sm text-slate-500">Mohon tunggu sebentar.</p>
    </div>
  </div>
);

const FileInput: React.FC<{
  label: string;
  name: string;
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  icon: React.ReactNode;
}> = ({ label, name, file, onFileChange, accept, icon }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700">
      {label}
    </label>
    <div className="mt-2 flex items-center gap-4 p-3 border border-slate-300 rounded-xl bg-slate-50">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-lg border text-slate-500">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        {file ? (
          <p className="text-sm font-semibold text-indigo-600 truncate">
            {file.name}
          </p>
        ) : (
          <p className="text-sm text-slate-500">Pilih file untuk diunggah</p>
        )}
      </div>
      <label
        htmlFor={name}
        className="relative cursor-pointer text-sm bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold py-1.5 px-3 rounded-md transition-colors"
      >
        <span>{file ? "Ganti" : "Pilih File"}</span>
        <input
          id={name}
          name={name}
          type="file"
          className="sr-only"
          onChange={onFileChange}
          accept={accept}
        />
      </label>
    </div>
  </div>
);

const FormSkeleton: React.FC = () => (
  <div className="bg-slate-100 min-h-screen animate-pulse">
    <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b px-6 py-4 sticky top-0 z-20">
      <div className="flex justify-between items-center">
        <div className="h-5 bg-slate-200 rounded-md w-32"></div>
        <div className="h-6 bg-slate-300 rounded-md w-36"></div>
        <div className="h-9 bg-slate-300 rounded-lg w-36"></div>
      </div>
    </div>
    <div className="p-4 sm:p-6 w-full mx-auto space-y-8">
      {[...Array(4)].map((_, cardIndex) => (
        <div
          key={cardIndex}
          className="bg-white p-6 rounded-xl shadow-sm border"
        >
          <div className="h-6 bg-slate-300 rounded-md w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
                <div className="h-11 bg-slate-200 rounded-lg w-full"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SiswaTambah: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SiswaFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi loading awal halaman
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const dataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) dataToSubmit.append(key, value);
    });

    try {
      await createSiswa(dataToSubmit);
      toast.success("Siswa baru berhasil ditambahkan!");
      navigate("/siswa");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail ||
        "Gagal menambahkan siswa. Periksa kembali isian Anda.";
      toast.error(errorMsg);
      console.error(err.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <FormSkeleton />;

  const inputClass =
    "w-full border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-shadow shadow-sm px-3 py-2.5";
  const selectClass = `${inputClass} appearance-none`;
  const textareaClass = `${inputClass} min-h-[80px] p-3`;

  return (
    <div className="bg-slate-100 min-h-screen">
      {isSubmitting && <UploadProgressModal />}

      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <Link
            to="/siswa"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 font-semibold"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Kembali
          </Link>
          <h1 className="text-xl font-bold text-slate-800">
            Tambah Siswa Baru
          </h1>
          <button
            type="submit"
            form="tambah-siswa-form"
            disabled={isSubmitting}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Siswa"}
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
            id="tambah-siswa-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-800 border-b border-slate-200 pb-4 mb-6">
                <UserCircleIcon className="w-6 h-6 text-indigo-500" />
                Data Diri Siswa
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label
                    htmlFor="nama_lengkap"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="nik"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    NIK
                  </label>
                  <input
                    type="text"
                    name="nik"
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="nisn"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    NISN
                  </label>
                  <input
                    type="text"
                    name="nisn"
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="jenis_kelamin"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Jenis Kelamin
                  </label>
                  <select
                    name="jenis_kelamin"
                    onChange={handleChange}
                    required
                    className={selectClass}
                    defaultValue=""
                  >
                    <option disabled value="">
                      Pilih...
                    </option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="tempat_lahir"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    name="tempat_lahir"
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="tanggal_lahir"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    name="tanggal_lahir"
                    onChange={handleChange}
                    required
                    className={`${inputClass} text-slate-600`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="no_telepon"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    No. Telepon Siswa
                  </label>
                  <input
                    type="tel"
                    name="no_telepon"
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="alamat"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="alamat"
                    onChange={handleChange}
                    required
                    className={textareaClass}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-800 border-b border-slate-200 pb-4 mb-6">
                <AcademicCapIcon className="w-6 h-6 text-indigo-500" />
                Data Akademik
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label
                    htmlFor="kelas"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Kelas
                  </label>
                  <select
                    name="kelas"
                    onChange={handleChange}
                    required
                    className={selectClass}
                    defaultValue=""
                  >
                    <option disabled value="">
                      Pilih...
                    </option>
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="asal_sekolah"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Asal Sekolah
                  </label>
                  <input
                    type="text"
                    name="asal_sekolah"
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="alamat_asal_sekolah"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Alamat Asal Sekolah
                  </label>
                  <textarea
                    name="alamat_asal_sekolah"
                    onChange={handleChange}
                    required
                    className={textareaClass}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-800 border-b border-slate-200 pb-4 mb-6">
                <UserGroupIcon className="w-6 h-6 text-indigo-500" />
                Data Orang Tua / Wali
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label
                    htmlFor="nama_ayah"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Nama Ayah
                  </label>
                  <input
                    type="text"
                    name="nama_ayah"
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="nama_ibu"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Nama Ibu
                  </label>
                  <input
                    type="text"
                    name="nama_ibu"
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="no_telepon_ortu"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    No. Telepon Orang Tua
                  </label>
                  <input
                    type="tel"
                    name="no_telepon_ortu"
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-800 border-b border-slate-200 pb-4 mb-6">
                <DocumentTextIcon className="w-6 h-6 text-indigo-500" />
                Foto & Dokumen
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <FileInput
                  label="Foto Profil"
                  name="foto_profil"
                  file={formData.foto_profil as File}
                  onFileChange={handleFileChange}
                  accept="image/*"
                  icon={<CameraIcon className="w-8 h-8" />}
                />
                <FileInput
                  label="Kartu Keluarga (KK)"
                  name="dok_kk"
                  file={formData.dok_kk as File}
                  onFileChange={handleFileChange}
                  icon={<DocumentArrowUpIcon className="w-8 h-8" />}
                />
                <FileInput
                  label="Akte Kelahiran"
                  name="dok_akte"
                  file={formData.dok_akte as File}
                  onFileChange={handleFileChange}
                  icon={<DocumentArrowUpIcon className="w-8 h-8" />}
                />
                <FileInput
                  label="Ijazah Terakhir"
                  name="dok_ijazah"
                  file={formData.dok_ijazah as File}
                  onFileChange={handleFileChange}
                  icon={<DocumentArrowUpIcon className="w-8 h-8" />}
                />
                <FileInput
                  label="KTP Orang Tua"
                  name="dok_ktp_ortu"
                  file={formData.dok_ktp_ortu as File}
                  onFileChange={handleFileChange}
                  icon={<DocumentArrowUpIcon className="w-8 h-8" />}
                />
                <FileInput
                  label="KIP (opsional)"
                  name="dok_kip"
                  file={formData.dok_kip as File}
                  onFileChange={handleFileChange}
                  icon={<DocumentArrowUpIcon className="w-8 h-8" />}
                />
              </div>
            </div>
          </form>
        </div>
      </motion.main>
    </div>
  );
};

export default SiswaTambah;
