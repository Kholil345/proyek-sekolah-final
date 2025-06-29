import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSiswaDetail, updateSiswa } from "../api/siswa";
import { toast } from "react-toastify";
import {
  ArrowLeftIcon,
  DocumentArrowUpIcon,
  LinkIcon,
  UserCircleIcon,
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CameraIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// --- Tipe Data ---
interface SiswaFormData {
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
  status: "AKTIF" | "LULUS" | "PINDAH" | "DROPOUT";
}

// --- Komponen-komponen Kecil ---

const UploadProgressModal: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center shadow-2xl">
      <CloudArrowUpIcon className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-slate-800">
        Mengunggah Data...
      </h3>
      <p className="text-sm text-slate-500 mb-4">
        Mohon tunggu, jangan tutup jendela ini.
      </p>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-center font-bold text-indigo-600 mt-2 text-lg">
        {progress}%
      </p>
    </div>
  </div>
);

const FileInput: React.FC<{
  label: string;
  name: string;
  currentFileUrl?: string;
  newFile?: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  icon: React.ReactNode;
}> = ({ label, name, currentFileUrl, newFile, onFileChange, accept, icon }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700">
      {label}
    </label>
    <div className="mt-2 flex items-center gap-4 p-3 border border-slate-300 rounded-xl bg-slate-50">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-lg border text-slate-500">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        {newFile ? (
          <p className="text-sm font-semibold text-indigo-600 truncate">
            {newFile.name}
          </p>
        ) : currentFileUrl ? (
          <a
            href={currentFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-indigo-600 hover:underline flex items-center gap-1.5 truncate"
          >
            <LinkIcon className="w-4 h-4" />
            <span>Lihat File Saat Ini</span>
          </a>
        ) : (
          <p className="text-sm text-slate-500">Belum ada file.</p>
        )}
      </div>
      <label
        htmlFor={name}
        className="relative cursor-pointer text-sm bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold py-1.5 px-3 rounded-md transition-colors"
      >
        <span>{currentFileUrl || newFile ? "Ganti" : "Pilih File"}</span>
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

const EditSiswaSkeleton: React.FC = () => (
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

const SiswaEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SiswaFormData>({
    nama_lengkap: "",
    nisn: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    nik: "",
    jenis_kelamin: "L",
    alamat: "",
    no_telepon: "",
    asal_sekolah: "",
    alamat_asal_sekolah: "",
    nama_ayah: "",
    nama_ibu: "",
    no_telepon_ortu: "",
    kelas: "X",
    status: "AKTIF",
  });
  const [currentFiles, setCurrentFiles] = useState<{
    [key: string]: string | undefined;
  }>({});
  const [newFiles, setNewFiles] = useState<{ [key: string]: File | null }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (id) {
      const fetchSiswa = async () => {
        setLoading(true);
        try {
          const siswaData = await getSiswaDetail(Number(id));
          setFormData({
            nama_lengkap: siswaData.nama_lengkap || "",
            nisn: siswaData.nisn || "",
            tempat_lahir: siswaData.tempat_lahir || "",
            tanggal_lahir: siswaData.tanggal_lahir || "",
            nik: siswaData.nik || "",
            jenis_kelamin: siswaData.jenis_kelamin || "L",
            alamat: siswaData.alamat || "",
            no_telepon: siswaData.no_telepon || "",
            asal_sekolah: siswaData.asal_sekolah || "",
            alamat_asal_sekolah: siswaData.alamat_asal_sekolah || "",
            nama_ayah: siswaData.nama_ayah || "",
            nama_ibu: siswaData.nama_ibu || "",
            no_telepon_ortu: siswaData.no_telepon_ortu || "",
            kelas: siswaData.kelas || "X",
            status: siswaData.status || "AKTIF",
          });
          setCurrentFiles({
            foto_profil: siswaData.foto_profil,
            dok_kk: siswaData.dok_kk,
            dok_akte: siswaData.dok_akte,
            dok_ijazah: siswaData.dok_ijazah,
            dok_ktp_ortu: siswaData.dok_ktp_ortu,
            dok_kip: siswaData.dok_kip,
          });
        } catch (err) {
          setError("Gagal memuat data siswa.");
        } finally {
          setLoading(false);
        }
      };
      fetchSiswa();
    }
  }, [id]);

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
      setNewFiles((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsUploading(true);
    setUploadProgress(0);
    const dataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      dataToSubmit.append(key, value)
    );
    Object.entries(newFiles).forEach(([key, file]) => {
      if (file) dataToSubmit.append(key, file);
    });
    try {
      await updateSiswa(Number(id), dataToSubmit, (progress) => {
        setUploadProgress(progress);
      });
      toast.success("Data siswa berhasil diperbarui!");
      navigate("/siswa");
    } catch (err) {
      toast.error("Gagal memperbarui data. Coba lagi.");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <EditSiswaSkeleton />;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  const inputClass =
    "w-full border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-shadow shadow-sm px-3 py-2.5";
  const selectClass = `${inputClass} appearance-none`;
  const textareaClass = `${inputClass} min-h-[80px] p-3`;

  return (
    <div className="bg-slate-100 min-h-screen">
      {isUploading && <UploadProgressModal progress={uploadProgress} />}

      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <Link
            to="/siswa"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 font-semibold"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Kembali
          </Link>
          <h1 className="text-xl font-bold text-slate-800">Edit Siswa</h1>
          <button
            type="submit"
            form="edit-siswa-form"
            disabled={isUploading}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
          >
            {isUploading ? "Menyimpan..." : "Simpan Perubahan"}
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
            id="edit-siswa-form"
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
                    id="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleChange}
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
                    id="nik"
                    value={formData.nik}
                    onChange={handleChange}
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
                    id="nisn"
                    value={formData.nisn}
                    onChange={handleChange}
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
                    id="jenis_kelamin"
                    value={formData.jenis_kelamin}
                    onChange={handleChange}
                    className={selectClass}
                  >
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
                    id="tempat_lahir"
                    value={formData.tempat_lahir}
                    onChange={handleChange}
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
                    id="tanggal_lahir"
                    value={formData.tanggal_lahir}
                    onChange={handleChange}
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
                    id="no_telepon"
                    value={formData.no_telepon}
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
                    id="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    className={textareaClass}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-800 border-b border-slate-200 pb-4 mb-6">
                <AcademicCapIcon className="w-6 h-6 text-indigo-500" />
                Data Akademik & Status
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
                    id="kelas"
                    value={formData.kelas}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={selectClass}
                  >
                    <option value="AKTIF">Aktif</option>
                    <option value="LULUS">Lulus</option>
                    <option value="PINDAH">Pindah</option>
                    <option value="DROPOUT">Drop Out</option>
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
                    id="asal_sekolah"
                    value={formData.asal_sekolah}
                    onChange={handleChange}
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
                    id="alamat_asal_sekolah"
                    value={formData.alamat_asal_sekolah}
                    onChange={handleChange}
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
                    id="nama_ayah"
                    value={formData.nama_ayah}
                    onChange={handleChange}
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
                    id="nama_ibu"
                    value={formData.nama_ibu}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="no_telepon_ortu"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    No. Telepon Orang Tua / Wali
                  </label>
                  <input
                    type="tel"
                    name="no_telepon_ortu"
                    id="no_telepon_ortu"
                    value={formData.no_telepon_ortu}
                    onChange={handleChange}
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
                  currentFileUrl={currentFiles.foto_profil}
                  newFile={newFiles.foto_profil}
                  onFileChange={handleFileChange}
                  accept="image/*"
                  icon={<CameraIcon className="w-8 h-8" />}
                />
                <FileInput
                  label="Kartu Keluarga (KK)"
                  name="dok_kk"
                  currentFileUrl={currentFiles.dok_kk}
                  newFile={newFiles.dok_kk}
                  onFileChange={handleFileChange}
                  icon={<DocumentArrowUpIcon className="w-8 h-8" />}
                />
                <FileInput
                  label="Akte Kelahiran"
                  name="dok_akte"
                  currentFileUrl={currentFiles.dok_akte}
                  newFile={newFiles.dok_akte}
                  onFileChange={handleFileChange}
                  icon={<DocumentArrowUpIcon className="w-8 h-8" />}
                />
                <FileInput
                  label="Ijazah Terakhir"
                  name="dok_ijazah"
                  currentFileUrl={currentFiles.dok_ijazah}
                  newFile={newFiles.dok_ijazah}
                  onFileChange={handleFileChange}
                  icon={<DocumentArrowUpIcon className="w-8 h-8" />}
                />
                <FileInput
                  label="KTP Orang Tua"
                  name="dok_ktp_ortu"
                  currentFileUrl={currentFiles.dok_ktp_ortu}
                  newFile={newFiles.dok_ktp_ortu}
                  onFileChange={handleFileChange}
                  icon={<DocumentArrowUpIcon className="w-8 h-8" />}
                />
                <FileInput
                  label="KIP (jika ada)"
                  name="dok_kip"
                  currentFileUrl={currentFiles.dok_kip}
                  newFile={newFiles.dok_kip}
                  onFileChange={handleFileChange}
                  icon={<DocumentArrowUpIcon className="w-8 h-8" />}
                />
              </div>
              <div className="mt-4 space-y-1 text-xs text-gray-500">
                {Object.entries(newFiles).map(
                  ([key, file]) =>
                    file && (
                      <p key={key}>
                        File baru untuk <strong>{key}</strong>: {file.name}
                      </p>
                    )
                )}
              </div>
            </div>
          </form>
        </div>
      </motion.main>
    </div>
  );
};

export default SiswaEdit;
