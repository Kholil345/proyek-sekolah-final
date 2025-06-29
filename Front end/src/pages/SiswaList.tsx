import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSiswaList, deleteSiswa } from "../api/siswa";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion, AnimatePresence } from "framer-motion";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { FaPlus } from "react-icons/fa";

// --- Tipe Data & Komponen Kecil ---
type StatusType = "AKTIF" | "LULUS" | "PINDAH" | "DROPOUT" | "BARU";
interface Siswa {
  id: number;
  nama_lengkap: string;
  nisn: string;
  kelas: string;
  status: StatusType;
  foto_profil?: string;
}
const StatusBadge: React.FC<{ status: StatusType }> = ({ status }) => {
  const statusStyle: { [key in StatusType]: string } = {
    AKTIF: "bg-green-100 text-green-800 ring-green-600/20",
    LULUS: "bg-blue-100 text-blue-800 ring-blue-600/20",
    PINDAH: "bg-yellow-100 text-yellow-700 ring-yellow-600/20",
    DROPOUT: "bg-red-100 text-red-700 ring-red-600/20",
    BARU: "bg-yellow-100 text-yellow-700 ring-yellow-600/20",
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

const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}> = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md"
          >
            <div className="p-6 flex items-start space-x-4">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-0 text-left">
                <h3
                  className="text-lg leading-6 font-semibold text-gray-900"
                  id="modal-title"
                >
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-xl">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onConfirm}
              >
                Hapus
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Batal
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SiswaCardSkeleton: React.FC = () => (
  <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-transparent animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-2/5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-slate-200"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-300 rounded-md w-3/4"></div>
          <div className="h-3 bg-slate-200 rounded-md w-1/2"></div>
        </div>
      </div>
      <div className="w-1/5">
        <div className="h-6 bg-slate-200 rounded-full w-24"></div>
      </div>
      <div className="w-1/5 text-center">
        <div className="h-4 bg-slate-300 rounded-md w-12 mx-auto"></div>
      </div>
      <div className="w-1/5 flex justify-end gap-2">
        <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
        <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
        <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
      </div>
    </div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-16 bg-white rounded-xl shadow-md border">
    <UsersIcon className="mx-auto h-12 w-12 text-slate-300" />
    <h3 className="mt-2 text-sm font-semibold text-slate-800">
      Data Siswa Kosong
    </h3>
    <p className="mt-1 text-sm text-slate-500">
      Coba ubah filter atau tambahkan data siswa baru.
    </p>
  </div>
);

const SiswaList: React.FC = () => {
  const [data, setData] = useState<Siswa[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kelas, setKelas] = useState("");
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [siswaToDelete, setSiswaToDelete] = useState<Siswa | null>(null);

  const fetchData = async (
    reset = false,
    searchParams = { search, kelas, status }
  ) => {
    if (reset) {
      setLoading(true);
      setData([]);
    }
    try {
      const currentPage = reset ? 1 : page;
      const res = await getSiswaList(
        currentPage,
        searchParams.search,
        searchParams.kelas,
        searchParams.status
      );
      const newData = res.results || [];
      setData((prev) => (reset ? newData : [...prev, ...newData]));
      setHasMore(res.next !== null);
      setPage(currentPage + 1);
    } catch (err) {
      console.error("❌ Gagal memuat data:", err);
    } finally {
      if (reset) setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData(true, { search, kelas, status });
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [search, kelas, status]);

  const handleOpenDeleteModal = (siswa: Siswa) => {
    setSiswaToDelete(siswa);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!siswaToDelete) return;
    try {
      await deleteSiswa(siswaToDelete.id);
      setData((prevData) =>
        prevData.filter((item) => item.id !== siswaToDelete.id)
      );
      toast.success(`Siswa "${siswaToDelete.nama_lengkap}" berhasil dihapus.`);
    } catch (error) {
      toast.error("Gagal menghapus siswa.");
      console.error(error);
    } finally {
      setIsModalOpen(false);
      setSiswaToDelete(null);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Data Siswa"
        message={`Apakah Anda yakin ingin menghapus data siswa bernama "${siswaToDelete?.nama_lengkap}"? Tindakan ini tidak dapat dibatalkan.`}
      />

      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-20 border-b border-slate-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UsersIcon className="w-7 h-7 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-800">
              Manajemen Siswa
            </h2>
          </div>
          <Link
            to="/siswa/tambah"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md transition-colors duration-200"
          >
            <FaPlus />
            Tambah Siswa
          </Link>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 p-4 bg-white rounded-xl shadow-md border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div className="relative w-full sm:w-72">
              <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama atau NISN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              <span>Filter:</span>
            </div>
            <div className="flex gap-4">
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white w-full sm:w-auto transition"
              >
                <option value="">Semua Kelas</option>
                <option value="X">Kelas X</option>
                <option value="XI">Kelas XI</option>
                <option value="XII">Kelas XII</option>
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white w-full sm:w-auto transition"
              >
                <option value="">Semua Status</option>
                <option value="AKTIF">Aktif</option>
                <option value="LULUS">Lulus</option>
                <option value="PINDAH">Pindah</option>
                <option value="DROPOUT">Drop Out</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="hidden sm:flex bg-transparent text-slate-500 font-semibold text-xs uppercase px-4 py-2">
            <div className="w-2/5 px-2">Nama</div>
            <div className="w-1/5 px-2">Status</div>
            <div className="w-1/5 px-2 text-center">Kelas</div>
            <div className="w-1/5 px-2 text-end">Aksi</div>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <SiswaCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <InfiniteScroll
              dataLength={data.length}
              next={fetchData}
              hasMore={hasMore}
              loader={<SiswaCardSkeleton />}
              endMessage={
                <p className="py-8 text-center text-sm text-slate-500">
                  Anda telah mencapai akhir daftar.
                </p>
              }
            >
              {data.length > 0 ? (
                <div className="space-y-3">
                  {data.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:ring-2 hover:ring-indigo-500 transition-all duration-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.05,
                        ease: "easeOut",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-2/5 flex items-center gap-4">
                          <img
                            src={
                              item.foto_profil ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                item.nama_lengkap
                              )}&background=random`
                            }
                            alt={item.nama_lengkap}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 truncate">
                              {item.nama_lengkap}
                            </p>
                            <p className="text-xs text-slate-500">
                              NISN: {item.nisn}
                            </p>
                          </div>
                        </div>
                        <div className="w-1/5">
                          <StatusBadge status={item.status} />
                        </div>
                        <div className="w-1/5 font-medium text-slate-700 text-center">
                          {item.kelas}
                        </div>
                        <div className="w-1/5 flex justify-end items-center gap-1">
                          <Link
                            to={`/siswa/detail/${item.id}`}
                            className="p-2 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </Link>
                          <Link
                            to={`/siswa/edit/${item.id}`}
                            className="p-2 text-slate-400 hover:text-amber-600 rounded-full hover:bg-amber-50 transition-colors"
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleOpenDeleteModal(item)}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
            </InfiniteScroll>
          )}
        </div>
      </main>
    </div>
  );
};

export default SiswaList;
