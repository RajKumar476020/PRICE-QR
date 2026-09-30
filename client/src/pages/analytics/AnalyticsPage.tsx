import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  QrCode,
  Eye,
  Users,
  MousePointerClick,
  TrendingUp,
  Sparkles,
  PhoneCall,
  MessageCircle,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { api, resolveImageUrl } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DashboardCardSkeleton } from '../../components/ui/Skeleton';
import { toast } from '../../components/ui/Toast';

export const AnalyticsPage: React.FC = () => {
  const { currentBusiness } = useAuthStore();
  const [period, setPeriod] = useState<'today' | '7d' | '30d'>('7d');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentBusiness?.id) return;
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await api.getAnalytics(currentBusiness.id, period);
        setData(res);
      } catch (e) {
        console.error('Failed to load analytics:', e);
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [currentBusiness?.id, period]);

  if (!currentBusiness) return null;

  const summary = data?.summary || {
    totalScans: 0,
    totalAllTimeScans: 0,
    totalViews: 0,
    totalAllTimeViews: 0,
    productViews: 0,
    contactClicks: 0,
    offerViews: 0,
    uniqueVisitorsEstimate: 0,
    conversionRate: 0,
  };

  const timeline = data?.timeline || [];
  const topProducts = data?.topProducts || [];

  // Max value for bar height scaling in chart
  const maxMetric = Math.max(
    ...timeline.map((t: any) => Math.max(t.scans || 0, t.views || 0)),
    1,
  );

  const totalPeriodScans = timeline.reduce((acc: number, t: any) => acc + (t.scans || 0), 0);
  const totalPeriodViews = timeline.reduce((acc: number, t: any) => acc + (t.views || 0), 0);

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-200">
      {/* Header & Period Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time customer engagement, physical QR scans, and top viewed menu items.
          </p>
        </div>

        {/* Period Tabs: Today, 7 Days, 30 Days */}
        <div className="inline-flex p-1 bg-white border border-slate-200/90 rounded-xl shadow-subtle shrink-0 self-start sm:self-auto">
          {(['today', '7d', '30d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                period === p
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p === 'today' && 'Today'}
              {p === '7d' && 'Past 7 Days'}
              {p === '30d' && 'Past 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </>
        ) : (
          <>
            <Card className="p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>QR Code Scans</span>
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                {summary.totalScans.toLocaleString()}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400">All-time scans</span>
                <span className="font-bold text-slate-700">
                  {(summary.totalAllTimeScans || summary.totalScans).toLocaleString()}
                </span>
              </div>
            </Card>

            <Card className="p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Catalog Views</span>
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                {summary.totalViews.toLocaleString()}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400">All-time views</span>
                <span className="font-bold text-slate-700">
                  {(summary.totalAllTimeViews || summary.totalViews).toLocaleString()}
                </span>
              </div>
            </Card>

            <Card className="p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Estimated Visitors</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                ~{summary.uniqueVisitorsEstimate.toLocaleString()}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400">Catalog browse rate</span>
                <span className="font-bold text-emerald-600">
                  {summary.totalViews > 0 ? Math.round((summary.productViews / summary.totalViews) * 100) : 0}%
                </span>
              </div>
            </Card>

            <Card className="p-5 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Customer Inquiries</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <MousePointerClick className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                {summary.contactClicks.toLocaleString()}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400">Conversion rate</span>
                <span className="font-bold text-amber-600">
                  {summary.conversionRate}%
                </span>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Clean Interactive Timeline Chart */}
      <Card className="p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Scans vs. Menu Views Over Time
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Period breakdown: {totalPeriodScans} scans, {totalPeriodViews} storefront views.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-brand-500 inline-block" />
              <span className="text-slate-700">QR Scans</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-900 inline-block" />
              <span className="text-slate-700">Menu Views</span>
            </div>
          </div>
        </div>

        {/* Bar Timeline */}
        <div className="pt-4 pb-2 overflow-x-auto">
          {timeline.length > 0 ? (
            <div
              className={`flex items-end justify-between gap-1.5 sm:gap-2 h-48 border-b border-slate-200 pb-2 ${
                period === '30d' ? 'min-w-[680px]' : period === 'today' ? 'min-w-[500px]' : 'min-w-[320px]'
              }`}
            >
              {timeline.map((point: any, idx: number) => {
                const scanHeight =
                  point.scans > 0 ? Math.max(8, Math.round((point.scans / maxMetric) * 140)) : 0;
                const viewHeight =
                  point.views > 0 ? Math.max(8, Math.round((point.views / maxMetric) * 140)) : 0;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    {/* Hover tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-slate-700 bg-white border border-slate-300 rounded px-2 py-1 shadow-md whitespace-nowrap mb-1 pointer-events-none z-10">
                      <div className="font-bold text-slate-900">{point.time}</div>
                      <div className="text-brand-600">{point.scans} Scans</div>
                      <div className="text-slate-800">{point.views} Views</div>
                    </div>

                    <div className="flex items-end gap-1 w-full justify-center min-h-[4px]">
                      {/* Scans bar */}
                      <div
                        style={{ height: `${scanHeight}px` }}
                        className={`w-2.5 sm:w-3.5 bg-brand-500 rounded-t transition-all ${
                          scanHeight > 0 ? 'group-hover:bg-brand-600 group-hover:scale-y-105' : 'bg-transparent'
                        }`}
                      />
                      {/* Views bar */}
                      <div
                        style={{ height: `${viewHeight}px` }}
                        className={`w-2.5 sm:w-3.5 bg-slate-900 rounded-t transition-all ${
                          viewHeight > 0 ? 'group-hover:bg-black group-hover:scale-y-105' : 'bg-transparent'
                        }`}
                      />
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono mt-1 truncate max-w-full text-center">
                      {point.time}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-36 flex items-center justify-center text-xs text-slate-400">
              No activity recorded in this period.
            </div>
          )}
        </div>
      </Card>

      {/* Most Viewed Products Table */}
      {topProducts.length > 0 && (
        <Card className="p-6 sm:p-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Most Viewed Menu Items
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Popular items customers opened and explored during this period.
              </p>
            </div>
            <Badge variant="brand">Top {topProducts.length}</Badge>
          </div>

          <div className="divide-y divide-slate-100">
            {topProducts.map((p: any, idx: number) => {
              const maxProductViews = Math.max(...topProducts.map((item: any) => item.viewCount || 0), 1);
              const viewPercentage = Math.round(((p.viewCount || 0) / maxProductViews) * 100);

              return (
                <div key={p.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0 ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-800'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-700'
                          : idx === 2
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      #{idx + 1}
                    </span>

                    {p.imageUrl ? (
                      <img
                        src={resolveImageUrl(p.imageUrl)}
                        alt={p.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{p.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-600 font-semibold">
                          {currentBusiness.currency}
                          {p.price}
                        </span>
                        {p.category?.name && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                            {p.category.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-slate-900">
                      {p.viewCount} {p.viewCount === 1 ? 'view' : 'views'}
                    </span>
                    <div className="w-20 bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden ml-auto">
                      <div
                        className="bg-brand-500 h-full rounded-full transition-all"
                        style={{ width: `${Math.max(8, viewPercentage)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
