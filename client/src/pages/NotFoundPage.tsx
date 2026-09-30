import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-slate-900 text-brand-400 flex items-center justify-center mb-6 shadow-md">
        <QrCode className="w-8 h-8" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">404</h1>
      <h2 className="text-lg sm:text-xl font-bold text-slate-800 mt-2">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
        The page or digital business profile you are looking for doesn't exist, has been moved, or the link is incorrect.
      </p>

      <div className="mt-6 flex gap-3">
        <Link to="/">
          <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
