import React, { useState } from 'react';
import {
  QrCode,
  Download,
  Copy,
  Share2,
  Printer,
  ExternalLink,
  Check,
  Sparkles,
  Layout,
  Maximize2,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { api, resolveImageUrl } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { QRGenerator } from '../../components/ui/QRGenerator';
import { toast } from '../../components/ui/Toast';

export const QrStudioPage: React.FC = () => {
  const { currentBusiness, loading } = useAuthStore();
  const [printTemplate, setPrintTemplate] = useState<'table' | 'a5' | 'a4'>('table');
  const [qrSize, setQrSize] = useState<number>(260);

  if (loading || !currentBusiness) {
    return (
      <div className="space-y-6 text-left animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 h-96 bg-white rounded-3xl border border-slate-200 p-8"></div>
          <div className="lg:col-span-6 h-96 bg-white rounded-3xl border border-slate-200 p-8"></div>
        </div>
      </div>
    );
  }

  const publicUrl = `${window.location.origin}/m/${currentBusiness.publicId}`;

  const handleRecordDownload = async () => {
    try {
      await api.recordQrDownload(currentBusiness.id);
    } catch {}
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">QR Code Studio</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Generate, customize, download, and print table cards and standees for your business.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handlePrint}
          leftIcon={<Printer className="w-4 h-4" />}
        >
          Print Physical Display
        </Button>
      </div>

      {/* Main Studio View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 no-print">
        {/* Left Column: QR Code Display & Quick Downloads */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="p-6 sm:p-8 flex flex-col items-center">
            <QRGenerator
              url={publicUrl}
              businessName={currentBusiness.name}
              businessLogoUrl={currentBusiness.logoUrl}
              size={qrSize}
              showActions={true}
              onDownload={handleRecordDownload}
            />
          </Card>
        </div>

        {/* Right Column: Physical Print Layout Selector & Specifications */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="p-6 sm:p-7 space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Printable Stand Templates
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your intended display format. The print button will output formatted materials.
              </p>
            </div>

            {/* Template Chooser */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'table', label: 'Counter & Desk Card', sub: 'Billing desk, tables & reception' },
                { id: 'a5', label: 'A5 Acrylic Standee', sub: 'Standard checkout display' },
                { id: 'a4', label: 'A4 Wall Poster', sub: 'Front window, door & entrance' },
              ].map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setPrintTemplate(tpl.id as any)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    printTemplate === tpl.id
                      ? 'border-brand-500 bg-brand-50/50 shadow-sm ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{tpl.label}</div>
                  <div className="text-[10px] text-slate-500 mt-1 leading-tight">{tpl.sub}</div>
                </button>
              ))}
            </div>

            {/* Print Preview Canvas Frame */}
            <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200/80 flex flex-col items-center text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Print Layout Preview ({printTemplate.toUpperCase()})
              </span>

              {/* Scaled preview representation */}
              <div className="w-56 p-5 bg-white rounded-xl shadow-card border border-slate-200 flex flex-col items-center">
                {currentBusiness.logoUrl && (
                  <img
                    src={resolveImageUrl(currentBusiness.logoUrl)}
                    alt={currentBusiness.name}
                    className="w-8 h-8 rounded-full object-cover mb-2 border border-slate-200"
                  />
                )}
                <div className="text-[10px] font-extrabold text-slate-900 truncate max-w-full">
                  {currentBusiness.name}
                </div>
                <div className="text-[8px] font-bold text-brand-600 mt-0.5 uppercase tracking-wider">
                  Scan for Products & Prices
                </div>

                <div className="my-2.5 p-1 bg-white border border-slate-100 rounded">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                      publicUrl,
                    )}`}
                    alt="Preview"
                    className="w-20 h-20"
                  />
                </div>

                <div className="text-[8px] text-slate-400 font-mono truncate max-w-full">
                  {publicUrl.replace(/^https?:\/\//, '')}
                </div>
              </div>

              <div className="mt-4">
                <Button variant="primary" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
                  Print This Template
                </Button>
              </div>
            </div>

            {/* Architecture guarantee note */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-1">Architecture Guarantee</span>
              Your QR code encodes only the permanent URL (<span className="font-mono text-slate-800 font-semibold">{currentBusiness.publicId}</span>). You can change products, services, prices, offers, and hours anytime — your printed QR codes will never expire or require reprinting.
            </div>
          </Card>
        </div>
      </div>

      {/* PRINT-ONLY CONTAINER (Activated on window.print()) */}
      <div className="hidden print-only max-w-lg mx-auto py-8 text-center print-card p-10 bg-white">
        {currentBusiness.logoUrl && (
          <img
            src={resolveImageUrl(currentBusiness.logoUrl)}
            alt={currentBusiness.name}
            className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 border border-slate-200"
          />
        )}
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {currentBusiness.name}
        </h1>
        <p className="text-sm font-bold text-brand-600 uppercase tracking-widest mt-1 mb-6">
          Scan to View Products & Prices
        </p>

        <div className="flex justify-center my-6">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
              publicUrl,
            )}`}
            alt="Printable QR Code"
            className="w-64 h-64 border-4 border-slate-900 p-2 rounded-2xl"
          />
        </div>

        <div className="text-sm font-mono font-bold text-slate-700 mt-4">
          {publicUrl}
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Open your phone camera & point at the QR code. No app download needed!
        </p>
      </div>
    </div>
  );
};
