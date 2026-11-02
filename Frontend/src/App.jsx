import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Plants from './pages/Plants';
import CutLoading from './pages/CutLoading';
import GrnReceipts from './pages/GrnReceipts';
import BalanceReports from './pages/BalanceReports';
import Departments from './pages/Departments';

function App() {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('sidebarCollapsed') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(collapsed));
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar Navigation */}
      <Navbar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      
      <div className={`transition-[padding] duration-200 ease-in-out ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 lg:pt-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/plants" element={<Plants />} />
            <Route path="/cut-loading" element={<CutLoading />} />
            <Route path="/grn" element={<GrnReceipts />} />
            <Route path="/balance" element={<BalanceReports />} />
            <Route path="/departments" element={<Departments />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;