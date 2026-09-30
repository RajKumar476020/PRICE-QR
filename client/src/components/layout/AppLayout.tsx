import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNavigation } from './MobileNavigation';
import { useAuthStore } from '../../stores/authStore';
import { Skeleton } from '../ui/Skeleton';
import { X } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { user, token, businesses, isLoading, isInitialized } = useAuthStore();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Not logged in -> go to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but no business registered -> go to onboarding wizard (unless ADMIN)
  if (businesses.length === 0 && user.role !== 'ADMIN' && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col lg:flex-row antialiased">
      {/* Desktop Sidebar (visible on lg+) */}
      <div className="hidden lg:block h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer (offcanvas) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white z-10 shadow-2xl flex flex-col">
            <div className="p-3 flex justify-end">
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar onCloseMobile={() => setMobileDrawerOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header onOpenMobileNav={() => setMobileDrawerOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          <Outlet />
        </main>
        <MobileNavigation />
      </div>
    </div>
  );
};
