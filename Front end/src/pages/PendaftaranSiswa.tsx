import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSiswa } from "../api/siswa";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  UserCircleIcon,
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CameraIcon,
  DocumentArrowUpIcon,
  CloudArrowUpIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

// --- Komponen-komponen UI Kecil ---

const SubmittingModal: React.FC = () => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center shadow-2xl">
      <CloudArrowUpIcon className="w-12 h-12 text-indigo-500 mx-auto mb-4 animate-bounce" />
      <h3 className="text-lg font-semibold text-slate-800">
        Mengirim Pendaftaran...
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
    <div className="mt-2 flex items-center gap-3 p-3 border border-slate-300 rounded-xl bg-slate-50">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-lg border text-slate-500">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        {file ? (
          <p className="text-sm font-semibold text-indigo-600 truncate">
            {file.name}
          </p>
        ) : (
          <p className="text-sm text-slate-500">Pilih file</p>
        )}
      </div>
      <label
        htmlFor={name}
        className="flex-shrink-0 cursor-pointer text-sm bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold py-1.5 px-3 rounded-md transition-colors"
      >
        <span>{file ? "Ganti" : "Pilih"}</span>
        <input
          id={name}
          name={name}
          type="file"
          className="sr-only"
          onChange={onFileChange}
          accept={accept}
          required={name !== "dok_kip"}
        />
      </label>
    </div>
  </div>
);

// [BARU] Komponen untuk setiap bagian form
const FormSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ icon, title, description, children }) => (
  <motion.div
    className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5 }}
  >
    <div className="border-b border-slate-200 pb-5 mb-6">
      <h2 className="flex items-center gap-3 text-xl font-semibold text-slate-800">
        {icon}
        {title}
      </h2>
      <p className="mt-1 ml-9 text-sm text-slate-500">{description}</p>
    </div>
    {children}
  </motion.div>
);

const PendaftaranSiswa: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{
    [key: string]: string | File | null;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0])
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const dataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) dataToSubmit.append(key, value as string | Blob);
    });

    try {
      await createSiswa(dataToSubmit);
      toast.success("Pendaftaran berhasil dikirim! Terima kasih.");
      navigate("/pendaftaran-sukses");
    } catch (err: any) {
      toast.error("Gagal mengirim pendaftaran. Periksa kembali isian Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full border-slate-300 bg-slate-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition shadow-sm px-3 py-2.5";
  const selectClass = `${inputClass} appearance-none`;
  const textareaClass = `${inputClass} min-h-[80px] p-3`;

  return (
    <div className="bg-slate-100 min-h-screen">
      {isSubmitting && <SubmittingModal />}

      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex items-center gap-4">
          <img
            src="/img/logo.png"
            alt="Logo Sekolah"
            className="h-12 w-12 sm:h-14 sm:w-14"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              Formulir Pendaftaran Siswa Baru
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              SMAS Bina Bhakti
            </p>
          </div>
        </div>
      </header>

      <main className="py-6 sm:py-8">
        <form
          id="pendaftaran-siswa-form"
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
        >
          {/* Bagian 1: Data Diri */}
          <FormSection
            icon={<UserCircleIcon className="w-7 h-7 text-indigo-500" />}
            title="Data Diri Calon Siswa"
            description="Isi semua data diri dengan benar sesuai dengan dokumen resmi."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
          </FormSection>

          {/* Bagian 2: Data Akademik & Ortu */}
          <FormSection
            icon={<AcademicCapIcon className="w-7 h-7 text-indigo-500" />}
            title="Informasi Akademik & Orang Tua"
            description="Lengkapi data asal sekolah dan kontak yang bisa dihubungi."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Alamat Asal Sekolah
                </label>
                <textarea
                  name="alamat_asal_sekolah"
                  onChange={handleChange}
                  required
                  className={textareaClass}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  No. Telepon Siswa (WA)
                </label>
                <input
                  type="tel"
                  name="no_telepon"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
          </FormSection>

          {/* Bagian 3: Dokumen */}
          <FormSection
            icon={<DocumentTextIcon className="w-7 h-7 text-indigo-500" />}
            title="Upload Dokumen Pendaftaran"
            description="Unggah semua dokumen yang diperlukan. Pastikan file jelas dan dapat dibaca."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <FileInput
                label="Foto Profil (3x4)"
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
                label="KIP (jika ada)"
                name="dok_kip"
                file={formData.dok_kip as File}
                onFileChange={handleFileChange}
                icon={<DocumentArrowUpIcon className="w-8 h-8" />}
              />
            </div>
          </FormSection>

          {/* Tombol Kirim */}
          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-green-300"
            >
              <CheckIcon className="w-6 h-6" />
              {isSubmitting ? "Mengirim..." : "Kirim Formulir Pendaftaran"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PendaftaranSiswa;
