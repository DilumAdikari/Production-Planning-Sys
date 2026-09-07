import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Plants from './pages/Plants';
import CutLoading from './pages/CutLoading';
import GrnReceipts from './pages/GrnReceipts';
import BalanceReports from './pages/BalanceReports';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Routed Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plants" element={<Plants />} />
          <Route path="/cut-loading" element={<CutLoading />} />
          <Route path="/grn" element={<GrnReceipts />} />
          <Route path="/balance" element={<BalanceReports />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;