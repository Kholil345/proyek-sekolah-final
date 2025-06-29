import React from 'react';
import Sidebar from '../components/Sidebar';

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 w-full bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
