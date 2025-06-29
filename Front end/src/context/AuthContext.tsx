import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { BASE_URL } from "../api/config"; // 1. Impor URL terpusat

// --- Tipe Data ---
interface User {
  user_id: number;
  username: string;
  full_name: string;
  email: string;
  profile_picture_url: string;
  role: string;
}
export interface AuthTokens {
  access: string;
  refresh: string;
}

// 2. Perbarui tipe konteks untuk menyertakan 'loading'
interface AuthContextType {
  user: User | null;
  authTokens: AuthTokens | null;
  loginUser: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  logoutUser: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  // State untuk menyimpan token dan data user
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // 3. State 'loading' untuk mencegah render sebelum autentikasi siap
  const [loading, setLoading] = useState(true);

  // Fungsi Login
  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    try {
      const response = await axios.post(`${BASE_URL}/token/`, {
        username: target.username.value,
        password: target.password.value,
      });

      const data: AuthTokens = response.data;
      setAuthTokens(data);
      const decodedUser: User = jwtDecode(data.access);
      setUser(decodedUser);
      localStorage.setItem("authTokens", JSON.stringify(data));

      toast.success(
        `Selamat datang kembali, ${
          decodedUser.full_name || decodedUser.username
        }!`
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Login gagal:", error);
      toast.error("Username atau password salah!");
    }
  };

  // Fungsi Logout
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
  };

  // 4. Efek untuk memeriksa token saat aplikasi pertama kali dimuat
  useEffect(() => {
    const checkUserLoggedIn = () => {
      const tokensString = localStorage.getItem("authTokens");
      if (tokensString) {
        try {
          const tokens: AuthTokens = JSON.parse(tokensString);
          // TODO: Di masa depan, verifikasi token ini ke server untuk keamanan ekstra
          setAuthTokens(tokens);
          setUser(jwtDecode<User>(tokens.access));
        } catch (error) {
          // Jika token tidak valid, bersihkan state
          logoutUser();
        }
      }
      // Setelah selesai memeriksa, set loading ke false
      setLoading(false);
    };

    checkUserLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Data yang akan dibagikan melalui context
  const contextData: AuthContextType = {
    user,
    authTokens,
    loginUser,
    logoutUser,
    loading, // <-- 5. Sertakan 'loading' di sini
  };

  return (
    <AuthContext.Provider value={contextData}>
      {/* 6. Hanya render komponen anak jika proses loading selesai */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook kustom untuk menggunakan context dengan lebih mudah
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
