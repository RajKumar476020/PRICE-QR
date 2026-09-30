import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Tag,
  Plus,
  Calendar,
  Percent,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { api, resolveImageUrl } from '../../services/api';
import type { Offer } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { toast } from '../../components/ui/Toast';

const offerSchema = z
  .object({
    title: z.string().min(1, 'Offer title is required'),
    description: z.string().optional(),
    discountType: z.enum(['PERCENTAGE', 'FIXED', 'PROMO']),
    discountAmount: z.preprocess(
      (val) => (val === '' || val === undefined || val === null ? null : Number(val)),
      z.number().min(0, 'Discount amount cannot be negative').nullable().optional(),
    ),
    promoCode: z.string().optional(),
    imageUrl: z.string().optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    },
    {
      message: 'End date must be on or after start date',
      path: ['endDate'],
    },
  );

type OfferFormValues = z.infer<typeof offerSchema>;

export const OffersPage: React.FC = () => {
  const { currentBusiness } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [deletingOffer, setDeletingOffer] = useState<Offer | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
  });

  const selectedDiscountType = watch('discountType');

  const fetchOffers = async () => {
    if (!currentBusiness?.id) return;
    setLoading(true);
    try {
      const data = await api.getOffers(currentBusiness.id);
      setOffers(data);

      if (searchParams.get('action') === 'new-offer') {
        openNewOfferModal();
        setSearchParams({});
      }
    } catch (e) {
      console.error('Failed to fetch offers:', e);
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [currentBusiness?.id]);

  if (!currentBusiness) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-200 animate-pulse rounded-xl w-1/3" />
        <div className="h-40 bg-slate-100 animate-pulse rounded-2xl" />
      </div>
    );
  }

  const openNewOfferModal = () => {
    const today = new Date().toISOString().split('T')[0];
    const twoWeeksLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    reset({
      title: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountAmount: 20,
      promoCode: '',
      imageUrl: '',
      startDate: today,
      endDate: twoWeeksLater,
      isActive: true,
    });
    setEditingOffer(null);
    setIsModalOpen(true);
  };

  const openEditModal = (off: Offer) => {
    reset({
      title: off.title,
      description: off.description || '',
      discountType: off.discountType,
      discountAmount: off.discountAmount ?? null,
      promoCode: off.promoCode || '',
      imageUrl: off.imageUrl || '',
      startDate: off.startDate.split('T')[0],
      endDate: off.endDate.split('T')[0],
      isActive: off.isActive,
    });
    setEditingOffer(off);
    setIsModalOpen(true);
  };

  const onSubmit = async (values: OfferFormValues) => {
    try {
      if (editingOffer) {
        await api.updateOffer(currentBusiness.id, editingOffer.id, values);
        toast.success('Offer updated successfully!');
      } else {
        await api.createOffer(currentBusiness.id, values);
        toast.success('Offer created successfully!');
      }
      setIsModalOpen(false);
      setEditingOffer(null);
      fetchOffers();
    } catch (err: any) {
      toast.error('Failed to save offer', err.message);
    }
  };

  const handleToggleActive = async (off: Offer) => {
    try {
      await api.toggleOffer(currentBusiness.id, off.id);
      toast.success(off.isActive ? 'Offer deactivated' : 'Offer activated!');
      setOffers((prev) =>
        prev.map((o) => (o.id === off.id ? { ...o, isActive: !o.isActive } : o)),
      );
    } catch (err: any) {
      toast.error('Failed to toggle offer status', err.message);
    }
  };

  const handleDelete = async () => {
    if (!deletingOffer) return;
    try {
      await api.deleteOffer(currentBusiness.id, deletingOffer.id);
      toast.success('Offer deleted');
      setDeletingOffer(null);
      fetchOffers();
    } catch (err: any) {
      toast.error('Failed to delete offer', err.message);
    }
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Offers & Deals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create promotional discount banners displayed at the top of your digital storefront.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={openNewOfferModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create New Offer
        </Button>
      </div>

      {/* Offers Grid */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading offers...</div>
      ) : offers.length === 0 ? (
        <EmptyState
          icon={<Tag className="w-7 h-7 text-brand-600" />}
          title="No promotional offers running"
          description="Promotional offers appear right at the top of your public storefront to boost customer orders and festive engagement."
          actionText="Create First Offer"
          onAction={openNewOfferModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {offers.map((off) => {
            const isCurrentlyActive = off.isActive && !off.isExpired;

            return (
              <Card
                key={off.id}
                className={`p-5 flex flex-col justify-between transition-all ${
                  off.isExpired
                    ? 'opacity-60 bg-slate-50 border-slate-200'
                    : isCurrentlyActive
                    ? 'border-brand-200 shadow-card bg-white'
                    : 'bg-white opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-brand-50 text-brand-700 border border-brand-200">
                        {off.discountType === 'PERCENTAGE' && `${off.discountAmount}% OFF`}
                        {off.discountType === 'FIXED' && `${currentBusiness.currency}${off.discountAmount} OFF`}
                        {off.discountType === 'PROMO' && 'SPECIAL DEAL'}
                      </span>

                      {off.promoCode && (
                        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                          CODE: {off.promoCode}
                        </span>
                      )}

                      {off.isExpired ? (
                        <Badge variant="neutral">Expired</Badge>
                      ) : off.isActive ? (
                        <Badge variant="success">Active Now</Badge>
                      ) : (
                        <Badge variant="warning">Paused</Badge>
                      )}
                    </div>
                  </div>

                  {off.imageUrl && (
                    <div className="mb-3 rounded-xl overflow-hidden aspect-[3/1] bg-slate-100 border border-slate-200 shadow-subtle">
                      <img
                        src={resolveImageUrl(off.imageUrl)}
                        alt={off.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <h3 className="text-base font-bold text-slate-900 tracking-tight mt-2">
                    {off.title}
                  </h3>

                  {off.description && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {off.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Valid: {new Date(off.startDate).toLocaleDateString()} —{' '}
                      {new Date(off.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleToggleActive(off)}
                    disabled={off.isExpired}
                    className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold disabled:opacity-50"
                  >
                    {off.isActive ? (
                      <ToggleRight className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-slate-400" />
                    )}
                    <span>{off.isActive ? 'Active' : 'Paused'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(off)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit offer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingOffer(off)}
                      className="p-1.5 text-slate-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete offer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Offer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOffer ? 'Edit Promotional Offer' : 'Create New Promotional Offer'}
        description="Active offers are highlighted in a prominent banner on your public customer menu."
        maxWidth="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Offer Title *"
            placeholder="e.g. 20% OFF All Pizzas & Pastas"
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select label="Discount Type *" {...register('discountType')}>
              <option value="PERCENTAGE">Percentage Discount (%)</option>
              <option value="FIXED">Fixed Amount ({currentBusiness.currency})</option>
              <option value="PROMO">Promotional Deal</option>
            </Select>

            {selectedDiscountType !== 'PROMO' && (
              <Input
                label={selectedDiscountType === 'PERCENTAGE' ? 'Discount %' : `Amount (${currentBusiness.currency})`}
                type="number"
                step="any"
                placeholder="20"
                error={errors.discountAmount?.message}
                {...register('discountAmount')}
              />
            )}
          </div>

          <div className="space-y-4">
            <Input
              label="Promo Code (Optional)"
              placeholder="e.g. SUMMER20"
              {...register('promoCode')}
            />

            <Controller
              name="imageUrl"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  label="Offer Banner Image (Optional)"
                  value={field.value}
                  onChange={field.onChange}
                  aspectRatio="banner"
                  helperText="Upload a promotional graphic or banner from your device"
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date *"
              type="date"
              error={errors.startDate?.message}
              {...register('startDate')}
            />
            <Input
              label="End Date *"
              type="date"
              error={errors.endDate?.message}
              {...register('endDate')}
            />
          </div>

          <Textarea
            label="Offer Details / Terms"
            placeholder="Valid for dine-in and takeaways. Cannot be combined with other offers."
            rows={2}
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                className="rounded text-brand-600 focus:ring-brand-500"
                {...register('isActive')}
              />
              <span>Activate this offer immediately</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingOffer ? 'Save Changes' : 'Create Offer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deletingOffer}
        onClose={() => setDeletingOffer(null)}
        title={`Delete Offer "${deletingOffer?.title}"?`}
        description="This offer will be removed from your public customer page."
        maxWidth="sm"
      >
        <div className="flex items-center justify-end gap-2.5 mt-5">
          <Button variant="secondary" onClick={() => setDeletingOffer(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Offer
          </Button>
        </div>
      </Modal>
    </div>
  );
};
