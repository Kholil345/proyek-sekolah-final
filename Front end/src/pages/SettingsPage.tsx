import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  UserCircleIcon,
  LockClosedIcon,
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { updateProfile, changePassword } from "../api/akun";

const SettingsPage: React.FC = () => {
  const { user, logoutUser } = useAuth();

  // State untuk form update profil
  const [profileData, setProfileData] = useState({
    first_name: user?.full_name.split(" ")[0] || "",
    last_name: user?.full_name.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
  });
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);

  // State untuk form ganti password
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    new_password2: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = new FormData();
    // Buat objek user bersarang sesuai serializer
    dataToSubmit.append("user.first_name", profileData.first_name);
    dataToSubmit.append("user.last_name", profileData.last_name);
    dataToSubmit.append("user.email", profileData.email);
    if (newProfilePic) {
      dataToSubmit.append("foto_profil", newProfilePic);
    }

    try {
      await updateProfile(dataToSubmit);
      toast.success(
        "Profil berhasil diperbarui! Silakan login ulang untuk melihat perubahan."
      );
      logoutUser(); // Paksa logout agar user login ulang dan mendapat token baru
    } catch (error) {
      toast.error("Gagal memperbarui profil.");
      console.error(error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.new_password2) {
      toast.error("Password baru dan konfirmasi tidak cocok.");
      return;
    }
    try {
      await changePassword(passwordData);
      toast.success("Password berhasil diganti! Silakan login ulang.");
      logoutUser();
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.old_password?.[0] || "Gagal mengganti password.";
      toast.error(errorMsg);
      console.error(error);
    }
  };

  const inputClass =
    "w-full border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-shadow shadow-sm px-3 py-2.5";

  return (
    <div className="bg-slate-100 min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Pengaturan Akun
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kartu Update Profil */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-800 border-b border-slate-200 pb-4 mb-6">
              <UserCircleIcon className="w-6 h-6 text-indigo-500" />
              Update Profil
            </h2>
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Nama Depan
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={profileData.first_name}
                  onChange={handleProfileChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Nama Belakang
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={profileData.last_name}
                  onChange={handleProfileChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Foto Profil Baru
                </label>
                <input
                  type="file"
                  name="foto_profil"
                  onChange={(e) =>
                    e.target.files && setNewProfilePic(e.target.files[0])
                  }
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-50 file:text-indigo-600 hover:file:bg-indigo-100"
                />
              </div>
              <div className="pt-2 text-right">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
                >
                  Simpan Profil
                </button>
              </div>
            </form>
          </div>

          {/* Kartu Ganti Password */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-800 border-b border-slate-200 pb-4 mb-6">
              <LockClosedIcon className="w-6 h-6 text-indigo-500" />
              Ganti Password
            </h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div className="relative">
                <label htmlFor="old_password">Password Lama</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="old_password"
                  onChange={handlePasswordChange}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-slate-400"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div>
                <label htmlFor="new_password">Password Baru</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="new_password"
                  onChange={handlePasswordChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="new_password2">Konfirmasi Password Baru</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="new_password2"
                  onChange={handlePasswordChange}
                  className={inputClass}
                />
              </div>
              <div className="pt-2 text-right">
                <button
                  type="submit"
                  className="px-6 py-2 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800"
                >
                  Ganti Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
