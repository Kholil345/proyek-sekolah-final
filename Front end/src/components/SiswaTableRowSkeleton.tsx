// src/components/SiswaTableRowSkeleton.tsx

import React from "react";

const SiswaTableRowSkeleton: React.FC = () => {
  return (
    // Kita gunakan `animate-pulse` dari Tailwind CSS untuk efek denyut
    <tr className="animate-pulse">
      {/* Kolom Nama & Avatar */}
      <td className="px-6 py-4 flex items-center gap-3">
        {/* Skeleton untuk Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div>
          {/* Skeleton untuk Nama */}
          <div className="h-4 bg-gray-300 rounded-md w-32 mb-1.5"></div>
          {/* Skeleton untuk NIK */}
          <div className="h-3 bg-gray-200 rounded-md w-24"></div>
        </div>
      </td>
      {/* Kolom Status */}
      <td className="px-6 py-4">
        <div className="h-5 bg-gray-300 rounded-full w-20"></div>
      </td>
      {/* Kolom Tempat Lahir */}
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded-md w-28"></div>
      </td>
      {/* Kolom Kelas */}
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded-md w-12"></div>
      </td>
      {/* Kolom Aksi */}
      <td className="px-6 py-4">
        <div className="h-8 bg-gray-300 rounded-md w-24"></div>
      </td>
    </tr>
  );
};

export default SiswaTableRowSkeleton;
