import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getSiswaDetail } from "../api/siswa";
import { toast } from "react-toastify";
import {
  ArrowLeftIcon,
  UserCircleIcon,
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CakeIcon,
  MapPinIcon,
  DevicePhoneMobileIcon,
  HomeModernIcon,
  IdentificationIcon,
  HashtagIcon,
  GlobeAltIcon,
  LinkIcon,
  BookmarkSquareIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

// --- Tipe Data ---
interface SiswaDetailData {
  id: number;
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
  foto_profil?: string;
  dok_kk?: string;
  dok_akte?: string;
  dok_ijazah?: string;
  dok_ktp_ortu?: string;
  dok_kip?: string;
}

// --- Komponen-komponen UI Kecil ---

const StatusBadge: React.FC<{ status: SiswaDetailData["status"] }> = ({
  status,
}) => {
  const statusStyle: { [key in SiswaDetailData["status"]]: string } = {
    AKTIF: "bg-green-100 text-green-700 ring-green-600/20",
    LULUS: "bg-blue-100 text-blue-700 ring-blue-600/20",
    PINDAH: "bg-yellow-100 text-yellow-700 ring-yellow-600/20",
    DROPOUT: "bg-red-100 text-red-700 ring-red-600/20",
  };
  return (
    <span
      className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ring-1 ring-inset ${
        statusStyle[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

const DetailItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: string | React.ReactNode | null;
}> = ({ icon, label, value }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg text-slate-500">
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-sm text-slate-800 font-semibold">{value || "-"}</p>
    </div>
  </div>
);

const DocumentLink: React.FC<{ label: string; url?: string | null }> = ({
  label,
  url,
}) => (
  <div className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
    <span className="font-medium text-sm text-indigo-700">{label}</span>
    {url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
      >
        <LinkIcon className="w-5 h-5" />
      </a>
    ) : (
      <span className="text-xs text-slate-400 font-medium">Tidak Ada</span>
    )}
  </div>
);

const DetailSiswaSkeleton: React.FC = () => (
  <div className="bg-slate-100 min-h-screen animate-pulse">
    <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b px-6 py-4 sticky top-0 z-20">
      <div className="flex items-center">
        <div className="h-5 bg-gray-200 rounded-md w-32"></div>
      </div>
    </div>
    <main className="p-4 sm:p-6">
      <div className="w-full mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-28 h-28 rounded-full bg-gray-300"></div>
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-gray-300 rounded-md w-3/4"></div>
              <div className="h-5 bg-gray-200 rounded-md w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded-full w-24"></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <div className="h-6 bg-gray-300 rounded-md w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  </div>
);

const SiswaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [siswa, setSiswa] = useState<SiswaDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getSiswaDetail(Number(id))
        .then((data) => setSiswa(data))
        .catch((err) => {
          console.error(err);
          toast.error("Gagal memuat detail siswa.");
          navigate("/siswa");
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  if (loading) return <DetailSiswaSkeleton />;
  if (!siswa)
    return <div className="p-6 text-center">Siswa tidak ditemukan.</div>;

  return (
    <div className="bg-slate-100 min-h-screen">
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center justify-start">
          <Link
            to="/siswa"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 font-semibold"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Kembali ke Daftar Siswa
          </Link>
        </div>
      </header>

      <main className="p-4 sm:p-6">
        <motion.div
          className="w-full mx-auto space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative">
            <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-50 rounded-bl-full"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
              <motion.img
                src={
                  siswa.foto_profil ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    siswa.nama_lengkap
                  )}&background=random`
                }
                alt={siswa.nama_lengkap}
                className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-lg"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2,
                }}
              />
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-3xl font-bold text-slate-900">
                  {siswa.nama_lengkap}
                </h1>
                <p className="text-md text-slate-500 mt-1">
                  Kelas {siswa.kelas}
                </p>
                <div className="mt-4">
                  <StatusBadge status={siswa.status} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-800 border-b border-slate-200 pb-4 mb-6">
              <UserCircleIcon className="w-6 h-6 text-indigo-500" />
              Data Diri
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <DetailItem
                icon={<IdentificationIcon className="w-5 h-5" />}
                label="NIK"
                value={siswa.nik}
              />
              <DetailItem
                icon={<HashtagIcon className="w-5 h-5" />}
                label="NISN"
                value={siswa.nisn}
              />
              <DetailItem
                icon={<UserCircleIcon className="w-5 h-5" />}
                label="Jenis Kelamin"
                value={siswa.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
              />
              <DetailItem
                icon={<MapPinIcon className="w-5 h-5" />}
                label="Tempat Lahir"
                value={siswa.tempat_lahir}
              />
              <DetailItem
                icon={<CakeIcon className="w-5 h-5" />}
                label="Tanggal Lahir"
                value={new Date(siswa.tanggal_lahir).toLocaleDateString(
                  "id-ID",
                  { day: "2-digit", month: "long", year: "numeric" }
                )}
              />
              <DetailItem
                icon={<DevicePhoneMobileIcon className="w-5 h-5" />}
                label="No. Telepon"
                value={siswa.no_telepon}
              />
              <DetailItem
                icon={<GlobeAltIcon className="w-5 h-5" />}
                label="Alamat"
                value={siswa.alamat}
              />
            </dl>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-800 border-b border-slate-200 pb-4 mb-6">
              <AcademicCapIcon className="w-6 h-6 text-indigo-500" />
              Data Akademik
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <DetailItem
                icon={<BookmarkSquareIcon className="w-5 h-5" />}
                label="Kelas Saat Ini"
                value={siswa.kelas}
              />
              <DetailItem
                icon={<HomeModernIcon className="w-5 h-5" />}
                label="Asal Sekolah"
                value={siswa.asal_sekolah}
              />
              <DetailItem
                icon={<MapPinIcon className="w-5 h-5" />}
                label="Alamat Asal Sekolah"
                value={siswa.alamat_asal_sekolah}
              />
            </dl>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-800 border-b border-slate-200 pb-4 mb-6">
              <UserGroupIcon className="w-6 h-6 text-indigo-500" />
              Data Orang Tua
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <DetailItem
                icon={<UserCircleIcon className="w-5 h-5" />}
                label="Nama Ayah"
                value={siswa.nama_ayah}
              />
              <DetailItem
                icon={<UserCircleIcon className="w-5 h-5" />}
                label="Nama Ibu"
                value={siswa.nama_ibu}
              />
              <DetailItem
                icon={<DevicePhoneMobileIcon className="w-5 h-5" />}
                label="No. Telepon Ortu"
                value={siswa.no_telepon_ortu}
              />
            </dl>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-800 border-b border-slate-200 pb-4 mb-6">
              <DocumentTextIcon className="w-6 h-6 text-indigo-500" />
              Dokumen Terlampir
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DocumentLink label="Kartu Keluarga (KK)" url={siswa.dok_kk} />
              <DocumentLink label="Akte Kelahiran" url={siswa.dok_akte} />
              <DocumentLink label="Ijazah Terakhir" url={siswa.dok_ijazah} />
              <DocumentLink label="KTP Orang Tua" url={siswa.dok_ktp_ortu} />
              <DocumentLink
                label="Kartu Indonesia Pintar (KIP)"
                url={siswa.dok_kip}
              />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SiswaDetail;
