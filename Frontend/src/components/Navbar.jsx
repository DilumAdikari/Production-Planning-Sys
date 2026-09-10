import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const navClass = ({ isActive }) =>
    `flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
      isActive
        ? 'bg-blue-50 text-blue-600'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Container - full screen width with horizontal padding */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Top bar: Brand & Title */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-sm shadow-blue-500/20">
             
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                <span className="text-blue-800">Elisha</span> Clothing
              </span>
            </div>
          </div>

          
        </div>

        {/* Navigation links bar */}
        <nav className="flex space-x-2 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          <NavLink to="/" className={navClass}>
          
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/plants" className={navClass}>
            
            <span>Plants Registration</span>
          </NavLink>
          <NavLink to="/cut-loading" className={navClass}>
            
            <span>Cut Loading</span>
          </NavLink>
          <NavLink to="/grn" className={navClass}>
            
            <span>Daily GRN</span>
          </NavLink>
          <NavLink to="/balance" className={navClass}>
            
            <span>WIP Balance</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;