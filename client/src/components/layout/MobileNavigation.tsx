import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Tag, QrCode, Store } from 'lucide-react';
import { clsx } from 'clsx';

export const MobileNavigation: React.FC = () => {
  const navTabs = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Menu', path: '/menu', icon: UtensilsCrossed },
    { name: 'Offers', path: '/offers', icon: Tag },
    { name: 'QR Code', path: '/qr', icon: QrCode },
    { name: 'Profile', path: '/business', icon: Store },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around shadow-lg no-print">
      {navTabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center justify-center py-1 px-2.5 rounded-xl min-w-[56px] text-[10px] font-semibold transition-colors',
                isActive ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600',
              )
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span>{tab.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
