import React from 'react';
import { NavLink } from 'react-router-dom';
import { Layers, LayoutDashboard, Factory, Scissors, PackageCheck, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const navClass = ({ isActive }) =>
    `flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
      isActive
        ? 'bg-blue-50 text-blue-600'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900">Tex<span className="text-blue-600">Track</span></span>
              <span className="ml-2 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">ERP</span>
            </div>
          </div>
          <div className="text-xs font-medium text-slate-500 hidden md:block">
            Apparel Subcontracting & WIP Management
          </div>
        </div>

        <nav className="flex space-x-2 overflow-x-auto py-2 border-t border-slate-100">
          <NavLink to="/" className={navClass}>
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/plants" className={navClass}>
            <Factory className="w-4 h-4" />
            <span>Subcon Plants</span>
          </NavLink>
          <NavLink to="/cut-loading" className={navClass}>
            <Scissors className="w-4 h-4" />
            <span>Cut Loading</span>
          </NavLink>
          <NavLink to="/grn" className={navClass}>
            <PackageCheck className="w-4 h-4" />
            <span>Daily GRN</span>
          </NavLink>
          <NavLink to="/balance" className={navClass}>
            <BarChart3 className="w-4 h-4" />
            <span>WIP Balance</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;