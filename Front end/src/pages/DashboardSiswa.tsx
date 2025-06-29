import React, { useEffect, useState, useRef } from "react";
import { getStatistikSiswa } from "../api/siswa";
import {
  getPengaturanPendaftaran,
  updatePengaturanPendaftaran,
} from "../api/pengaturan";
import { getNotifikasiList, markNotifikasiAsRead } from "../api/notifikasi";
import { toast } from "react-toastify";
import {
  ChartPieIcon,
  UsersIcon as UserGroupIcon,
  UserPlusIcon,
  BellIcon,
  MegaphoneIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { FaMale, FaFemale } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

// --- Tipe Data ---
interface StatistikData {
  total: number;
  kelas: { X: number; XI: number; XII: number };
  laki: number;
  perempuan: number;
  siswa_baru_bulan_lalu: number;
  status: {
    aktif: number;
    lulus: number;
    pindah: number;
    dropout: number;
    [key: string]: number;
  };
  total_baru: number;
}

interface INotification {
  id: number;
  title: string;
  content: string;
  is_read: boolean;
  timestamp: string;
}

interface StatistikFilter {
  tahunAjaran: string;
  semester: string;
}

// --- Komponen-komponen UI Kecil ---

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
}> = ({ icon, label, value }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200 flex items-start gap-4">
      <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

const ClassDistributionBarChart: React.FC<{
  data: { X: number; XI: number; XII: number };
}> = ({ data }) => {
  const total = data.X + data.XI + data.XII;
  const classes = [
    {
      label: "Kelas X",
      value: data.X,
      percentage: total > 0 ? (data.X / total) * 100 : 0,
      color: "bg-indigo-500",
    },
    {
      label: "Kelas XI",
      value: data.XI,
      percentage: total > 0 ? (data.XI / total) * 100 : 0,
      color: "bg-sky-500",
    },
    {
      label: "Kelas XII",
      value: data.XII,
      percentage: total > 0 ? (data.XII / total) * 100 : 0,
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 h-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Distribusi per Kelas
      </h3>
      <div className="space-y-4">
        {classes.map((c) => (
          <div key={c.label}>
            <div className="flex justify-between mb-1 text-sm font-medium text-slate-600">
              <span>{c.label}</span>
              <span>{c.value} Siswa</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div
                className={`${c.color} h-2.5 rounded-full transition-all duration-500`}
                style={{ width: `${c.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatusDistributionDonut: React.FC<{ data: StatistikData["status"] }> = ({
  data,
}) => {
  const statusConfig = {
    aktif: {
      label: "Aktif",
      color: "#10b981",
      icon: <CheckCircleIcon className="w-5 h-5 text-emerald-500" />,
    },
    lulus: {
      label: "Lulus",
      color: "#3b82f6",
      icon: <AcademicCapIcon className="w-5 h-5 text-blue-500" />,
    },
    pindah: {
      label: "Pindah",
      color: "#f97316",
      icon: <ArrowRightOnRectangleIcon className="w-5 h-5 text-orange-500" />,
    },
    dropout: {
      label: "Drop Out",
      color: "#ef4444",
      icon: <XCircleIcon className="w-5 h-5 text-red-500" />,
    },
  };

  const validKeys = Object.keys(data).filter(
    (key) => key in statusConfig
  ) as Array<keyof typeof statusConfig>;
  const total = validKeys.reduce((sum, key) => sum + data[key], 0);
  let currentPercentage = 0;

  const gradientColors = validKeys
    .map((key) => {
      const config = statusConfig[key];
      if (!config) return "";

      const percentage = total > 0 ? (data[key] / total) * 100 : 0;
      const start = currentPercentage;
      currentPercentage += percentage;
      const end = currentPercentage;
      return `${config.color} ${start}% ${end}%`;
    })
    .filter(Boolean)
    .join(", ");

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 h-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Distribusi Status
      </h3>
      <div className="grid grid-cols-2 gap-6 items-center">
        <div className="relative flex justify-center">
          <div
            style={{
              background: `conic-gradient(${gradientColors || "#e2e8f0"})`,
            }}
            className="w-32 h-32 rounded-full"
          ></div>
          <div className="absolute w-20 h-20 bg-white rounded-full flex items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="text-center">
              <span className="text-2xl font-bold text-slate-800">{total}</span>
              <p className="text-xs text-slate-500">Siswa</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {validKeys.map((key) => {
            const config = statusConfig[key];
            if (!config) return null;
            return (
              <div key={key} className="flex items-center text-sm gap-2">
                {config.icon}
                <span className="text-slate-600 font-medium flex-1">
                  {config.label}
                </span>
                <span className="font-semibold text-slate-800">
                  {data[key]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PengaturanPendaftaranCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPengaturanPendaftaran()
      .then((res) => setIsOpen(res.is_open))
      .catch(() => toast.error("Gagal memuat status pendaftaran."))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async () => {
    const newStatus = !isOpen;
    setIsOpen(newStatus);
    try {
      await updatePengaturanPendaftaran({ is_open: newStatus });
      toast.success(
        `Pendaftaran siswa berhasil ${newStatus ? "DIBUKA" : "DITUTUP"}.`
      );
    } catch (error) {
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
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 h-full">
      <h3 className="flex items-center gap-3 text-lg font-semibold text-slate-800 mb-2">
        <MegaphoneIcon className="w-6 h-6 text-indigo-500" />
        Status Pendaftaran
      </h3>
      <p className="text-sm text-slate-500 mb-4">
        Aktifkan untuk membuka formulir pendaftaran siswa baru untuk publik.
      </p>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isOpen ? "bg-indigo-600" : "bg-gray-200"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isOpen ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span
          className={`text-sm font-semibold ${
            isOpen ? "text-green-600" : "text-red-600"
          }`}
        >
          Pendaftaran {isOpen ? "Dibuka" : "Ditutup"}
        </span>
      </div>
    </div>
  );
};

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchNotifications = async () => {
    try {
      const res = await getNotifikasiList();
      setNotifications(res.data.results || res.data || []);
    } catch (error) {
      console.error("Gagal mengambil notifikasi", error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    try {
      await markNotifikasiAsRead(id);
    } catch (error) {
      console.error("Gagal menandai notifikasi", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 text-white text-[8px] items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-30 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">Notifikasi</h3>
              {unreadCount > 0 && (
                <span className="text-xs font-bold text-white bg-indigo-600 rounded-full px-2 py-0.5">
                  {unreadCount} Baru
                </span>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkAsRead(notif.id)}
                    className={`p-4 flex gap-4 hover:bg-slate-50 border-b border-slate-100 cursor-pointer ${
                      !notif.is_read ? "bg-indigo-50/50" : ""
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <UserPlusIcon className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {notif.title}
                      </p>
                      <p className="text-sm text-slate-500">{notif.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-8 text-center text-sm text-slate-500">
                  Tidak ada notifikasi.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DashboardSkeleton: React.FC = () => (
  <div className="bg-slate-100 min-h-screen animate-pulse">
    <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b px-6 py-4 sticky top-0 z-20">
      <div className="flex justify-between items-center">
        <div className="h-7 bg-slate-300 rounded-md w-1/3"></div>
        <div className="flex items-center gap-4">
          <div className="h-10 bg-slate-200 rounded-lg w-32"></div>
          <div className="h-10 bg-slate-200 rounded-lg w-32"></div>
          <div className="h-8 w-8 rounded-full bg-slate-200"></div>
          <div className="h-10 w-10 rounded-full bg-slate-200"></div>
        </div>
      </div>
    </div>
    <main className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow-md border">
            <div className="h-5 bg-slate-200 rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-slate-300 rounded w-1/4"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-md border h-52"
          ></div>
        ))}
      </div>
    </main>
  </div>
);

const getCurrentAcademicYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 7 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
};

// --- Komponen Utama Halaman Dashboard ---
const DashboardSiswa: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<StatistikData | null>(null);
  const [filters, setFilters] = useState<StatistikFilter>({
    tahunAjaran: getCurrentAcademicYear(),
    semester: "Semua",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistik = async () => {
      setLoading(true);
      try {
        const res = await getStatistikSiswa(filters);
        setData(res);
      } catch (err) {
        console.error("❌ Gagal mengambil statistik siswa:", err);
        toast.error("Gagal mengambil data statistik.");
      } finally {
        setLoading(false);
      }
    };
    fetchStatistik();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getAvatarUrl = () => {
    if (!user) return "";
    const backendUrl =
      "https://best-repairs-cluster-eligible.trycloudflare.com";
    const profilePic = user.profile_picture_url;
    if (profilePic && !profilePic.includes("default.jpg")) {
      return profilePic.startsWith("http")
        ? profilePic
        : `${backendUrl}${profilePic}`;
    }
    const initials = (user.full_name || user.username)
      .split(" ")
      .map((n) => n[0])
      .join("");
    return `https://ui-avatars.com/api/?name=${
      initials || "A"
    }&background=6366f1&color=fff`;
  };

  if (loading) return <DashboardSkeleton />;
  if (!data)
    return (
      <div className="p-6 text-center">Tidak ada data untuk ditampilkan.</div>
    );

  return (
    <div className="bg-slate-100 min-h-screen">
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-20 border-b border-slate-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChartPieIcon className="w-7 h-7 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-800">
              Dashboard Statistik
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <select
              name="tahunAjaran"
              value={filters.tahunAjaran}
              onChange={handleFilterChange}
              className="border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm transition"
            >
              <option>2025/2026</option>
              <option>2024/2025</option>
              <option>2023/2024</option>
            </select>
            <select
              name="semester"
              value={filters.semester}
              onChange={handleFilterChange}
              className="border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm transition"
            >
              <option>Semua</option>
              <option>Ganjil</option>
              <option>Genap</option>
            </select>
            <div className="w-px h-6 bg-slate-200"></div>
            <NotificationDropdown />
            {user && (
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={getAvatarUrl()}
                alt="user profile"
              />
            )}
          </div>
        </div>
      </header>

      <motion.main
        className="p-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            icon={<UserGroupIcon className="w-6 h-6" />}
            label="Total Siswa Aktif"
            value={data.status.aktif}
          />
          <StatCard
            icon={<UserPlusIcon className="w-6 h-6" />}
            label="Murid Baru"
            value={data.total_baru}
          />
          <StatCard
            icon={<FaMale className="w-6 h-6" />}
            label="Siswa Laki-laki"
            value={data.laki}
          />
          <StatCard
            icon={<FaFemale className="w-6 h-6" />}
            label="Siswa Perempuan"
            value={data.perempuan}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ClassDistributionBarChart data={data.kelas} />
          <StatusDistributionDonut data={data.status} />
          <PengaturanPendaftaranCard />
        </div>
      </motion.main>
    </div>
  );
};

export default DashboardSiswa;
