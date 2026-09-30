import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  QrCode,
  UtensilsCrossed,
  Tag,
  Eye,
  Plus,
  ExternalLink,
  Store,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { api, resolveImageUrl } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DashboardCardSkeleton } from '../../components/ui/Skeleton';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, currentBusiness } = useAuthStore();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentBusiness?.id) return;
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const data = await api.getBusinessSummary(currentBusiness.id);
        setSummary(data);
      } catch (e) {
        console.error('Failed to load dashboard summary:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [currentBusiness?.id]);

  if (!currentBusiness) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <Store className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900">No Business Registered Yet</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">Complete the onboarding wizard to get started.</p>
        <Link to="/onboarding">
          <Button variant="primary">Launch Onboarding</Button>
        </Link>
      </div>
    );
  }

  const stats = summary?.stats || {
    totalProducts: 0,
    activeOffers: 0,
    todayScans: 0,
    totalScans: 0,
    todayViews: 0,
    totalViews: 0,
  };

  const recentActivity = summary?.recentActivity || [];

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-200">
      {/* Top Banner & Quick Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {currentBusiness.logoUrl ? (
            <img
              src={resolveImageUrl(currentBusiness.logoUrl)}
              alt={currentBusiness.name}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-bold text-xl shrink-0">
              {currentBusiness.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {currentBusiness.name}
              </h1>
              <Badge variant="brand">{currentBusiness.category}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>Identifier: <span className="font-mono font-semibold text-slate-700">{currentBusiness.publicId}</span></span>
              <span>·</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Live Storefront
              </span>
            </p>
          </div>
        </div>

        {/* Primary Action Buttons (Section 15) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/menu?action=new-product')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Product / Service
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/offers?action=new-offer')}
            leftIcon={<Tag className="w-4 h-4 text-brand-600" />}
          >
            Create Offer
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/qr')}
            leftIcon={<QrCode className="w-4 h-4 text-slate-700" />}
          >
            Open QR Studio
          </Button>

          <a
            href={`/m/${currentBusiness.publicId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors shadow-subtle"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Live Price List</span>
          </a>
        </div>
      </div>

      {/* 4 Core Metric Cards (Section 15) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {loading ? (
          <>
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </>
        ) : (
          <>
            {/* Card 1: QR Scans */}
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  QR Scans
                </span>
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                {stats.totalScans.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                <span className="text-emerald-600 font-bold">+{stats.todayScans} today</span>
                <span>from table / counter scans</span>
              </div>
            </Card>

            {/* Card 2: Menu Views */}
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Menu Views
                </span>
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                {stats.totalViews.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                <span className="text-emerald-600 font-bold">+{stats.todayViews} today</span>
                <span>customer visits</span>
              </div>
            </Card>

            {/* Card 3: Active Offers */}
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Active Offers
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                {stats.activeOffers}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {stats.activeOffers > 0 ? (
                  <Link to="/offers" className="text-brand-600 font-semibold hover:underline">
                    Promotions running now →
                  </Link>
                ) : (
                  <span>No active promotions</span>
                )}
              </div>
            </Card>

            {/* Card 4: Products Count */}
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Menu Items
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                {stats.totalProducts}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                <Link to="/menu" className="text-slate-700 font-semibold hover:underline">
                  Manage items & prices →
                </Link>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Grid: Live Menu Preview Card & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: QR Quick Access & Public Link Box */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Public Storefront Doorway
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customers scan this QR to see your live menu, current offers, and contact options.
                </p>
              </div>
              <Link to="/qr">
                <Button variant="secondary" size="sm">
                  Full QR Studio
                </Button>
              </Link>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-5">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-subtle shrink-0">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                    `${window.location.origin}/m/${currentBusiness.publicId}`,
                  )}`}
                  alt="Business QR"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider block mb-1">
                  Permanent Public URL
                </span>
                <div className="text-sm font-bold text-slate-900 font-mono truncate">
                  {window.location.origin}/m/{currentBusiness.publicId}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Even if you modify your menu items or change prices later, this QR code and link never change.
                </p>
                <div className="mt-3 flex items-center gap-2 justify-center sm:justify-start">
                  <a
                    href={`/m/${currentBusiness.publicId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200"
                  >
                    <span>Test Scan Experience</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Col: Recent Activity (Section 15) */}
        <div>
          <Card className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Scans & Activity</h3>
              <Link to="/analytics" className="text-xs font-semibold text-brand-600 hover:underline">
                View all
              </Link>
            </div>

            <div className="flex-1 space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((act: any) => {
                  const isScan = act.eventType === 'QR_SCAN';
                  const isView = act.eventType === 'PAGE_VIEW';
                  const isOffer = act.eventType === 'OFFER_VIEW';

                  return (
                    <div
                      key={act.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                            isScan
                              ? 'bg-brand-100 text-brand-800'
                              : isView
                              ? 'bg-slate-200 text-slate-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isScan ? (
                            <QrCode className="w-3.5 h-3.5" />
                          ) : isView ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <Tag className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">
                            {isScan && 'QR Code Scanned'}
                            {isView && 'Menu Page Visited'}
                            {isOffer && 'Promotional Offer Clicked'}
                            {!isScan && !isView && !isOffer && act.eventType}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(act.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Recorded</span>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-slate-400 text-xs font-medium">
                  No scan activity yet today. Scan the QR code to test!
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
