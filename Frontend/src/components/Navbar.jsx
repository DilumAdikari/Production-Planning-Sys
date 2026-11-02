import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Factory,
  Scissors,
  ClipboardCheck,
  Scale,
  Building2,
  Layers,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Settings
} from 'lucide-react';

const MAIN_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/cut-loading', label: 'Cut Loading', icon: Scissors },
  { to: '/grn', label: 'Daily GRN', icon: ClipboardCheck },
  { to: '/balance', label: 'WIP Balance', icon: Scale }
];

const Navbar = ({ collapsed = false, onToggle }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // LocalStorage එකෙන් login වූ පරිශීලක තොරතුරු ලබා ගැනීම (default: admin)
  const user = JSON.parse(localStorage.getItem('user') || '{"role": "admin", "name": "Admin User"}');
  const isAdmin = user?.role === 'admin';

  // Settings dropdown එකට අයත් items (Departments admin සඳහා පමණයි)
  const SETTINGS_ITEMS = [
    { to: '/plants', label: 'Plants Registration', icon: Factory },
    ...(isAdmin ? [{ to: '/departments', label: 'Departments', icon: Building2 }] : [])
  ];

  // Settings යටතේ page එකක ඉන්නවා නම් dropdown එක ස්වයංක්‍රීයව විවෘත වේ
  const isSettingsRoute = SETTINGS_ITEMS.some((item) => location.pathname.startsWith(item.to));
  const [settingsOpen, setSettingsOpen] = useState(isSettingsRoute);

  useEffect(() => {
    if (isSettingsRoute) setSettingsOpen(true);
  }, [isSettingsRoute]);

  // Route එක වෙනස් වෙද්දී mobile drawer එක වසන්න
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Desktop collapsed වූ විට text හංගන class (mobile drawer එකේ text සැමවිටම පෙනෙයි)
  const hideWhenCollapsed = collapsed ? 'lg:hidden' : '';

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
      collapsed ? 'lg:justify-center lg:px-0' : ''
    } ${
      isActive
        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`;

  const renderLink = ({ to, label, icon: Icon, end }) => (
    <NavLink key={to} to={to} end={end} className={linkClass} title={collapsed ? label : undefined}>
      {({ isActive }) => (
        <>
          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-200'}`} />
          <span className={`truncate ${hideWhenCollapsed}`}>{label}</span>
        </>
      )}
    </NavLink>
  );

  // Settings dropdown toggle. Collapsed නම් click කළ විට sidebar එක විවෘත කර dropdown එක ඇරේ.
  const handleSettingsClick = () => {
    if (collapsed) {
      onToggle?.();
      setSettingsOpen(true);
    } else {
      setSettingsOpen((v) => !v);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand + desktop collapse toggle */}
      <div
        className={`flex items-center h-16 border-b border-white/10 shrink-0 px-5 gap-3 ${
          collapsed ? 'lg:px-0 lg:justify-center' : ''
        }`}
      >
        <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-600/30 shrink-0">
          <Layers className="w-5 h-5" />
        </div>
        <div className={`min-w-0 flex-1 ${hideWhenCollapsed}`}>
          <p className="font-extrabold text-base tracking-tight text-white leading-tight">
            <span className="text-blue-400">Elisha</span> Clothing
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">ERP SubCon</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className={`px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 ${hideWhenCollapsed}`}>
          Menu
        </p>
        {MAIN_ITEMS.map(renderLink)}

        {/* Settings dropdown */}
        <div className="pt-4">
          <button
            onClick={handleSettingsClick}
            aria-expanded={settingsOpen}
            title={collapsed ? 'Settings' : undefined}
            className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              collapsed ? 'lg:justify-center lg:px-0' : ''
            } ${
              isSettingsRoute && !settingsOpen
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : isSettingsRoute
                ? 'text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings
              className={`w-4 h-4 shrink-0 ${isSettingsRoute ? 'text-white' : 'text-slate-500 group-hover:text-slate-200'}`}
            />
            <span className={`truncate flex-1 text-left ${hideWhenCollapsed}`}>Settings</span>
            <ChevronDown
              className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                settingsOpen ? 'rotate-180' : ''
              } ${hideWhenCollapsed}`}
            />
          </button>

          {settingsOpen && (
            <div className={`mt-1 space-y-1 ${collapsed ? '' : 'pl-3'}`}>
              {SETTINGS_ITEMS.map(renderLink)}
            </div>
          )}
        </div>
      </nav>

      {/* User profile */}
      <div className={`border-t border-white/10 p-4 shrink-0 ${collapsed ? 'lg:p-3' : ''}`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'lg:justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {(user?.name || 'DA').slice(0, 2).toUpperCase()}
          </div>
          <div className={`min-w-0 flex-1 ${hideWhenCollapsed}`}>
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'Dilum Adikari'}</p>
            <span
              className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isAdmin ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
              }`}
            >
              {isAdmin ? 'Super Admin' : user?.department || 'Department User'}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop collapse / expand button */}
      <button
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="hidden lg:flex items-center justify-center gap-2 h-11 border-t border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition shrink-0"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        <span className={`text-xs font-semibold ${hideWhenCollapsed}`}>Collapse</span>
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile top bar (lg ට අඩු screens වලට පමණයි) */}
      <div className="font-sans lg:hidden fixed top-0 inset-x-0 h-14 z-40 bg-slate-900 text-white flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <span className="font-extrabold text-sm">Elisha Clothing</span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
          className="p-2 rounded-lg hover:bg-white/10 transition"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`font-sans fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 shadow-xl transition-all duration-200 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Navbar;