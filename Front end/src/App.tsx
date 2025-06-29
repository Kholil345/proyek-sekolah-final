import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AnimatePresence } from "framer-motion";

// Context & Utils
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import PublicRegistrationRoute from './utils/PublicRegistrationRoute';

// Layouts & Pages
import DashboardLayout from "./layouts/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import DashboardSiswa from "./pages/DashboardSiswa";
import RegisterPage from "./pages/RegisterPage";
import SiswaList from "./pages/SiswaList";
import SiswaTambah from "./pages/SiswaForm";
import SiswaDetail from "./pages/SiswaDetail";
import SiswaEdit from "./pages/SiswaEdit";
import PendaftaranSiswa from "./pages/PendaftaranSiswa";
import PendaftaranSukses from "./pages/PendaftaranSukses";
import SettingsPage from "./pages/SettingsPage";
import TunggakanSiswa from "./pages/TunggakanSiswa";

// Styles
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

// Komponen ini membungkus semua halaman yang memiliki sidebar dan header
const AppLayout: React.FC = () => (
  <DashboardLayout>
    <Outlet />
  </DashboardLayout>
);

// Komponen untuk halaman 404 yang lebih baik
const NotFoundPage: React.FC = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 text-center p-4">
        <h1 className="text-6xl font-extrabold text-indigo-600">404</h1>
        <h2 className="mt-2 text-2xl font-semibold text-slate-800">Halaman Tidak Ditemukan</h2>
        <p className="mt-2 text-slate-500">Maaf, kami tidak dapat menemukan halaman yang Anda cari.</p>
        <Link to="/dashboard" className="mt-6 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
            Kembali ke Dashboard
        </Link>
    </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* --- Rute Publik --- */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* --- Rute Pendaftaran (bisa diaktifkan/dinonaktifkan) --- */}
        <Route element={<PublicRegistrationRoute />}>
            <Route path="/pendaftaran" element={<PendaftaranSiswa />} />
            <Route path="/pendaftaran-sukses" element={<PendaftaranSukses />} />
        </Route>

        {/* --- Rute Privat (Hanya untuk user yang sudah login) --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardSiswa />} />
            <Route path="/siswa" element={<SiswaList />} />
            <Route path="/siswa/tambah" element={<SiswaTambah />} />
            <Route path="/siswa/detail/:id" element={<SiswaDetail />} />
            <Route path="/siswa/edit/:id" element={<SiswaEdit />} />
            <Route path="/tunggakan" element={<TunggakanSiswa />} />
            <Route path="/akun/tambah" element={<RegisterPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* --- Rute Fallback untuk Halaman Tidak Ditemukan --- */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};


function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Router>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;