import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { ToastContainer } from './components/ui/Toast';

// Layout
import { AppLayout } from './components/layout/AppLayout';

// Public & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { OnboardingWizard } from './pages/onboarding/OnboardingWizard';
import { PublicBusinessPage } from './pages/public/PublicBusinessPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Authenticated Owner Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { BusinessProfilePage } from './pages/business/BusinessProfilePage';
import { MenuPage } from './pages/menu/MenuPage';
import { OffersPage } from './pages/offers/OffersPage';
import { QrStudioPage } from './pages/qr/QrStudioPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { AdminPage } from './pages/admin/AdminPage';

export const App: React.FC = () => {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Public Customer Doorway - Scan / Visit by ID */}
        <Route path="/m/:businessId" element={<PublicBusinessPage />} />

        {/* Guided Owner Onboarding */}
        <Route path="/onboarding" element={<OnboardingWizard />} />

        {/* Authenticated Business Owner Experience */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/business" element={<BusinessProfilePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/categories" element={<MenuPage />} />
          <Route path="/menu/products" element={<MenuPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/qr" element={<QrStudioPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
