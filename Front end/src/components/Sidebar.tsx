import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BASE_URL } from "../api/config";
import {
  ChartPieIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  ArrowLeftOnRectangleIcon,
  UserPlusIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

// Komponen NavItem tidak ada perubahan
const NavItem: React.FC<{
  to: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
}> = ({ to, icon, label, exact = false }) => {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <li>
      <Link
        to={to}
        className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 font-semibold text-sm relative ${
          isActive
            ? "bg-indigo-100 text-indigo-700"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="active-sidebar-pill"
            className="absolute left-0 h-6 w-1 bg-indigo-600 rounded-r-full"
            initial={false}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
        <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
        <span>{label}</span>
      </Link>
    </li>
  );
};

const Sidebar: React.FC = () => {
  const { user, logoutUser } = useAuth();

  const getDisplayRole = (role?: string) => {
    if (!role) return "User";
    return role
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getInitials = (name: string): string => {
    if (!name) return "A";
    const words = name.split(" ");
    if (words.length > 1) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (!user) {
    // Skeleton loader tidak berubah
    return (
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 shadow-xl z-30 flex flex-col animate-pulse">
        <div className="p-5 border-b border-slate-200">
          <div className="h-12 bg-slate-200 rounded-md"></div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-lg"></div>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <div className="h-12 bg-slate-200 rounded-lg"></div>
        </div>
      </aside>
    );
  }

  const fullName = user.full_name || user.username;
  const initials = getInitials(fullName);

  const getAvatarUrl = () => {
    const backendUrl = { BASE_URL };
    const profilePic = user.profile_picture_url;

    if (profilePic && !profilePic.includes("default.jpg")) {
      if (profilePic.startsWith("http")) {
        return profilePic;
      } else {
        return `${backendUrl}${profilePic}`;
      }
    }

    return `https://ui-avatars.com/api/?name=${initials}&background=6366f1&color=fff&font-size=0.5`;
  };

  const avatarUrl = getAvatarUrl();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 shadow-xl z-30 flex flex-col">
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center space-x-4">
          <img
            className="w-12 h-12 rounded-full object-cover shadow-md bg-white p-1"
            src="/img/logo.png"
            alt="Logo SMA"
          />
          <div>
            <h2 className="text-lg font-bold text-slate-800">SMAS BB</h2>
            <p className="text-sm text-slate-500">Kronjo</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Menu Utama
        </p>
        <ul className="space-y-2">
          <NavItem
            to="/dashboard"
            icon={<ChartPieIcon className="w-5 h-5" />}
            label="Dashboard"
            exact={true}
          />
          <NavItem
            to="/siswa"
            icon={<UsersIcon className="w-5 h-5" />}
            label="Manajemen Siswa"
          />
          <NavItem
            to="/tunggakan"
            icon={<ExclamationTriangleIcon className="w-5 h-5" />}
            label="Tunggakan Siswa"
          />
        </ul>

        {/* [DIUBAH] Grup menu Administrasi sekarang hanya muncul untuk role ADMIN */}
        {user.role === "ADMIN" && (
          <>
            <p className="px-4 py-2 mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Administrasi
            </p>
            <ul className="space-y-2">
              <NavItem
                to="/akun/tambah"
                icon={<UserPlusIcon className="w-5 h-5" />}
                label="Tambah User"
              />
            </ul>
          </>
        )}

        <p className="px-4 py-2 mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Akun
        </p>
        <ul className="space-y-2">
          <NavItem
            to="/settings"
            icon={<Cog6ToothIcon className="w-5 h-5" />}
            label="Pengaturan Akun"
          />
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center justify-between p-2 rounded-lg">
          <div className="flex items-center gap-3">
            <img
              className="w-10 h-10 rounded-full object-cover bg-indigo-500"
              src={avatarUrl}
              alt={fullName}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {fullName}
              </p>
              <p className="text-xs text-slate-500">
                {getDisplayRole(user.role)}
              </p>
            </div>
          </div>
          <button
            title="Logout"
            onClick={logoutUser}
            className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
