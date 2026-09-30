import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Store,
  Users,
  QrCode,
  Eye,
  Search,
  CheckCircle2,
  Ban,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { toast } from '../../components/ui/Toast';

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'businesses' | 'users'>('businesses');
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, bizData, usersData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminBusinesses(search),
        api.getAdminUsers(),
      ]);
      setStats(statsData);
      setBusinesses(bizData);
      setUsers(usersData);
    } catch (err: any) {
      toast.error('Failed to load admin data', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [search]);

  const handleToggleStatus = async (bizId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await api.toggleBusinessStatus(bizId, newStatus as any);
      toast.success(newStatus === 'ACTIVE' ? 'Business restored!' : 'Business suspended');
      fetchAdminData();
    } catch (err: any) {
      toast.error('Failed to change status', err.message);
    }
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-200">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert className="w-5 h-5 text-brand-600" />
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Superuser Control Panel
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Admin</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Monitor all registered businesses, users, scans, and moderate storefront status.
        </p>
      </div>

      {/* Platform Statistics */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 sm:p-5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Businesses
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">
              {stats.totalBusinesses}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              {stats.activeBusinesses} active storefronts
            </div>
          </Card>

          <Card className="p-4 sm:p-5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Platform Users
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">
              {stats.totalUsers}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Business owners & admins</div>
          </Card>

          <Card className="p-4 sm:p-5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              QR Scans Recorded
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">
              {stats.qrScans?.toLocaleString() || 0}
            </div>
            <div className="text-[11px] text-brand-600 font-semibold mt-1">Across all clients</div>
          </Card>

          <Card className="p-4 sm:p-5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Products
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">
              {stats.totalProducts}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Active price list items</div>
          </Card>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="inline-flex p-1 bg-white border border-slate-200/90 rounded-xl shadow-subtle">
          <button
            onClick={() => setActiveTab('businesses')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'businesses'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Businesses ({businesses.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Users ({users.length})
          </button>
        </div>

        {activeTab === 'businesses' && (
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search business name or ID..."
              leftIcon={<Search className="w-4 h-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Businesses Table */}
      {activeTab === 'businesses' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-100">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Business</th>
                  <th className="py-3.5 px-4">Public Identifier</th>
                  <th className="py-3.5 px-4">Owner</th>
                  <th className="py-3.5 px-4">Catalog</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {businesses.map((biz) => {
                  const isSuspended = biz.status === 'SUSPENDED';

                  return (
                    <tr key={biz.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          {biz.logoUrl ? (
                            <img
                              src={biz.logoUrl}
                              alt=""
                              className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-[10px]">
                              {biz.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900">{biz.name}</div>
                            <div className="text-[10px] text-slate-400">{biz.category}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-700">
                        <a
                          href={`/m/${biz.publicId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-brand-600 inline-flex items-center gap-1"
                        >
                          <span>{biz.publicId}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        <div>{biz.owner?.name}</div>
                        <div className="text-[10px] text-slate-400">{biz.owner?.email}</div>
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        <div>{biz._count?.products || 0} products</div>
                        <div className="text-[10px] text-slate-400">
                          {biz._count?.categories || 0} categories · {biz._count?.offers || 0} offers
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {isSuspended ? (
                          <Badge variant="danger">Suspended</Badge>
                        ) : (
                          <Badge variant="success">Active</Badge>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Button
                          variant={isSuspended ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => handleToggleStatus(biz.id, biz.status)}
                          leftIcon={
                            isSuspended ? (
                              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Ban className="w-3.5 h-3.5 text-red-600" />
                            )
                          }
                        >
                          {isSuspended ? 'Restore' : 'Suspend'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Users Table */}
      {activeTab === 'users' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-100">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Businesses Managed</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="font-bold">{u.name}</div>
                      <div className="text-[10px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={u.role === 'ADMIN' ? 'brand' : 'neutral'}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700">
                      {u._count?.businesses || 0} business profiles
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
