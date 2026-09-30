import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  UtensilsCrossed,
  Tag,
  QrCode,
  BarChart3,
  Settings,
  ShieldAlert,
  LogOut,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Package,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { resolveImageUrl } from '../../services/api';
import { clsx } from 'clsx';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user, currentBusiness, businesses, setCurrentBusiness, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Business Profile', path: '/business', icon: Store },
    { name: 'Products & Services', path: '/menu', icon: Package },
    { name: 'Offers & Deals', path: '/offers', icon: Tag },
    { name: 'QR Code Studio', path: '/qr', icon: QrCode },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ name: 'Admin Portal', path: '/admin', icon: ShieldAlert });
  }

  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 select-none">
      {/* Brand & Business Selector */}
      <div className="p-5 pb-3">
        {/* App Logo */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-brand-400 flex items-center justify-center font-bold text-lg shadow-sm">
            <QrCode className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <span className="font-bold text-base text-slate-900 tracking-tight block leading-none">
              PriceQR
            </span>
            <span className="text-[11px] font-medium text-slate-400">Digital Business & Price List</span>
          </div>
        </div>

        {/* Business Selector / Current Active Card */}
        {currentBusiness && (
          <div className="relative mb-2">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <div className="flex items-center gap-2.5">
                {currentBusiness.logoUrl ? (
                  <img
                    src={resolveImageUrl(currentBusiness.logoUrl)}
                    alt={currentBusiness.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {currentBusiness.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-xs text-slate-900 truncate">
                    {currentBusiness.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {currentBusiness.publicId}
                  </div>
                </div>
              </div>

              {/* Public Link button */}
              <a
                href={`/m/${currentBusiness.publicId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <span>Live Storefront</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>

            {/* Switcher if multiple businesses exist */}
            {businesses.length > 1 && (
              <div className="mt-1">
                <select
                  value={currentBusiness.id}
                  onChange={(e) => {
                    const found = businesses.find((b) => b.id === e.target.value);
                    if (found) setCurrentBusiness(found);
                  }}
                  className="w-full text-[11px] text-slate-600 bg-transparent border-0 py-1 pl-1 cursor-pointer focus:outline-none"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      Switch to: {b.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Nav Items */}
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* User Footer & Logout */}
      <div className="p-3 border-t border-slate-200/80">
        <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <div className="text-xs font-bold text-slate-900 truncate">{user?.name}</div>
            <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-danger hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
