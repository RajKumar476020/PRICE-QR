import React, { useState } from 'react';
import {
  Copy,
  Check,
  QrCode,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { toast } from '../../components/ui/Toast';

export const SettingsPage: React.FC = () => {
  const { user, currentBusiness } = useAuthStore();
  const [copied, setCopied] = useState(false);

  if (!currentBusiness) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(currentBusiness.publicId);
    setCopied(true);
    toast.success('Public Business ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your account credentials, business details, and public QR code identifier.
        </p>
      </div>

      {/* Account Profile Card */}
      <Card className="p-6 sm:p-7 space-y-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Owner Account</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-0.5 font-medium">Full Name</span>
            <span className="text-slate-900 font-bold text-sm">{user?.name}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block mb-0.5 font-medium">Email Address</span>
            <span className="text-slate-900 font-bold text-sm">{user?.email}</span>
          </div>
        </div>
      </Card>

      {/* Public QR Architecture & Identifier */}
      <Card className="p-6 sm:p-7 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Public Business Identifier
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your unique, permanent identifier that powers your QR code standees and live web menu.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-brand-400 flex items-center justify-center font-bold shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-mono text-sm sm:text-base font-bold text-slate-900 truncate">
                {currentBusiness.publicId}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                Resolves to: {window.location.origin}/m/{currentBusiness.publicId}
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopyId}
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            {copied ? 'Copied' : 'Copy ID'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
