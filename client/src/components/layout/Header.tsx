import React from 'react';
import { Menu, ExternalLink, QrCode } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const { user, currentBusiness } = useAuthStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
      <div className="flex items-center gap-3">
        {/* Mobile menu hamburger */}
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Greeting & Business Title */}
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{getGreeting()}, {user?.name?.split(' ')[0] || 'Partner'}</span>
          </h2>
          {currentBusiness && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">{currentBusiness.name}</span>
              <span>·</span>
              <span className="font-mono text-[11px] text-slate-400">{currentBusiness.publicId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {currentBusiness && (
          <a
            href={`/m/${currentBusiness.publicId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-subtle"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Public Storefront</span>
          </a>
        )}

        <Button
          variant="brand"
          size="sm"
          onClick={() => (window.location.href = '/qr')}
          leftIcon={<QrCode className="w-3.5 h-3.5" />}
        >
          <span className="hidden sm:inline">My QR Code</span>
          <span className="sm:hidden">QR</span>
        </Button>
      </div>
    </header>
  );
};
