import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Factory, 
  Scissors, 
  ClipboardCheck, 
  Scale, 
  Building2, 
  Layers 
} from 'lucide-react';

const Navbar = () => {
  // LocalStorage එකෙන් login වූ පරිශීලක තොරතුරු ලබා ගැනීම (default: admin)
  const user = JSON.parse(localStorage.getItem('user') || '{"role": "admin", "name": "Admin User"}');
  const isAdmin = user?.role === 'admin';

  const navClass = ({ isActive }) =>
    `flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
      isActive
        ? 'bg-blue-50 text-blue-600'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Top bar: Brand & Active Profile */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-sm shadow-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                <span className="text-blue-700">Elisha</span> Clothing
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full border border-slate-200">
                ERP SubCon
              </span>
            </div>
          </div>

          {/* User Role Badge */}
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-500 font-medium hidden sm:inline">
              {user?.name || 'Dilum Adikari'}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
              isAdmin 
                ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              {isAdmin ? 'Super Admin' : user?.department || 'Department User'}
            </span>
          </div>
        </div>

        {/* Navigation links bar */}
        <nav className="flex space-x-2 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          <NavLink to="/" className={navClass}>
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/plants" className={navClass}>
            <Factory className="w-3.5 h-3.5" />
            <span>Plants Registration</span>
          </NavLink>

          <NavLink to="/cut-loading" className={navClass}>
            <Scissors className="w-3.5 h-3.5" />
            <span>Cut Loading</span>
          </NavLink>

          <NavLink to="/grn" className={navClass}>
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Daily GRN</span>
          </NavLink>

          <NavLink to="/balance" className={navClass}>
            <Scale className="w-3.5 h-3.5" />
            <span>WIP Balance</span>
          </NavLink>

          {/* Admin පරිශීලකයාට පමණක් පෙනෙන Master File Tab එක */}
          {isAdmin && (
            <NavLink to="/departments" className={navClass}>
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-purple-700 font-bold">Departments (Admin)</span>
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;