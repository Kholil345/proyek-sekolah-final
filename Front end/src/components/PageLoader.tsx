// src/components/PageLoader.tsx

import React from "react";
import { motion } from "framer-motion";

const PageLoader: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <img
        src="/img/logo.png"
        alt="Logo Sekolah"
        className="w-24 h-24 mx-auto mb-6"
      />
      <div className="flex items-center justify-center space-x-2">
        <div className="w-5 h-5 border-2 border-t-indigo-600 border-r-indigo-600 border-b-indigo-600 border-l-transparent rounded-full animate-spin"></div>
        <span className="text-lg font-medium text-slate-600">{message}</span>
      </div>
    </motion.div>
  </div>
);

export default PageLoader;
