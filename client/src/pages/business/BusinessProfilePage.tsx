import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Store,
  Clock,
  Phone,
  MapPin,
  Globe,
  Instagram,
  Facebook,
  ExternalLink,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { api, resolveImageUrl } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { toast } from '../../components/ui/Toast';

export const BusinessProfilePage: React.FC = () => {
  const { currentBusiness, refreshMe } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [hours, setHours] = useState<any[]>([]);

  const { register, handleSubmit, reset, control } = useForm();

  useEffect(() => {
    if (currentBusiness) {
      reset({
        name: currentBusiness.name || '',
        category: currentBusiness.category || 'Retail',
        tagline: currentBusiness.tagline || '',
        description: currentBusiness.description || '',
        phone: currentBusiness.phone || '',
        whatsapp: currentBusiness.whatsapp || '',
        email: currentBusiness.email || '',
        website: currentBusiness.website || '',
        address: currentBusiness.address || '',
        city: currentBusiness.city || '',
        googleMapsUrl: currentBusiness.googleMapsUrl || '',
        instagram: currentBusiness.instagram || '',
        facebook: currentBusiness.facebook || '',
        logoUrl: currentBusiness.logoUrl || '',
        coverUrl: currentBusiness.coverUrl || '',
        currency: currentBusiness.currency || '₹',
      });

      if (currentBusiness.hours && currentBusiness.hours.length > 0) {
        setHours(currentBusiness.hours);
      } else {
        // Standard hours
        setHours([
          { dayOfWeek: 1, dayName: 'Monday', openTime: '08:30', closeTime: '22:30', isClosed: false },
          { dayOfWeek: 2, dayName: 'Tuesday', openTime: '08:30', closeTime: '22:30', isClosed: false },
          { dayOfWeek: 3, dayName: 'Wednesday', openTime: '08:30', closeTime: '22:30', isClosed: false },
          { dayOfWeek: 4, dayName: 'Thursday', openTime: '08:30', closeTime: '22:30', isClosed: false },
          { dayOfWeek: 5, dayName: 'Friday', openTime: '08:30', closeTime: '23:30', isClosed: false },
          { dayOfWeek: 6, dayName: 'Saturday', openTime: '08:00', closeTime: '23:30', isClosed: false },
          { dayOfWeek: 0, dayName: 'Sunday', openTime: '08:30', closeTime: '22:30', isClosed: false },
        ]);
      }
    }
  }, [currentBusiness, reset]);

  if (!currentBusiness) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-200 animate-pulse rounded-xl w-1/3" />
        <div className="h-64 bg-slate-100 animate-pulse rounded-3xl" />
      </div>
    );
  }

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      await api.updateBusiness(currentBusiness.id, {
        ...values,
        hours,
      });
      await refreshMe();
      toast.success('Business profile updated successfully!');
    } catch (err: any) {
      toast.error('Update failed', err.message || 'Could not save business profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleHourChange = (index: number, field: string, value: any) => {
    const updated = [...hours];
    updated[index] = { ...updated[index], [field]: value };
    setHours(updated);
  };

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-200">
      {/* Header with Live Preview Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Business Profile</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure your storefront identity, contacts, branding, and opening hours.
          </p>
        </div>

        <a
          href={`/m/${currentBusiness.publicId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200/90 shadow-subtle transition-colors shrink-0"
        >
          <ExternalLink className="w-4 h-4 text-brand-600" />
          <span>Live Customer View</span>
        </a>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Visual Identity Section */}
        <Card className="p-6 sm:p-7 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Store className="w-5 h-5 text-brand-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Storefront Branding</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Controller
              name="logoUrl"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  label="Business Logo"
                  value={field.value}
                  onChange={field.onChange}
                  aspectRatio="square"
                  helperText="Upload your company logo (Square 1:1 format recommended)"
                />
              )}
            />

            <Controller
              name="coverUrl"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  label="Cover / Hero Banner"
                  value={field.value}
                  onChange={field.onChange}
                  aspectRatio="banner"
                  helperText="Hero banner image displayed at top of your digital catalog"
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Input
              label="Business Name *"
              placeholder="e.g. Metro Electronics & Repair"
              {...register('name')}
            />

            <Select label="Category *" {...register('category')}>
              <option value="Retail">Retail Store & Boutique</option>
              <option value="Salon">Salon, Spa & Beauty</option>
              <option value="Fitness">Gym, Fitness & Yoga</option>
              <option value="Healthcare">Healthcare & Clinic</option>
              <option value="Auto Repair">Auto Repair & Garage</option>
              <option value="Electronics">Electronics & IT Services</option>
              <option value="Home Services">Home Services & Maintenance</option>
              <option value="Professional">Professional Services & Consulting</option>
              <option value="Grocery store">Grocery & Gourmet Supermarket</option>
              <option value="Bakery">Bakery & Confectionery</option>
              <option value="Cafe">Cafe & Coffee Shop</option>
              <option value="Restaurant">Restaurant & Bistro</option>
              <option value="Service">Other Business & Services</option>
            </Select>

            <Select label="Price Currency" {...register('currency')}>
              <option value="₹">₹ (INR)</option>
              <option value="$">$ (USD)</option>
              <option value="€">€ (EUR)</option>
              <option value="£">£ (GBP)</option>
              <option value="AED">AED (Dirham)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="AUD">AUD (A$)</option>
            </Select>
          </div>

          <Input
            label="Tagline"
            placeholder="e.g. Quality products, trusted services, and honest pricing"
            {...register('tagline')}
          />

          <Textarea
            label="Business Description"
            placeholder="Describe your business, key services, products, or customer experience..."
            rows={3}
            {...register('description')}
          />
        </Card>

        {/* Contact & Location Section */}
        <Card className="p-6 sm:p-7 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Phone className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Customer Contact & Location Options
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Phone Number (For direct Call button)"
              placeholder="+1 234 567 8900"
              leftIcon={<Phone className="w-4 h-4" />}
              {...register('phone')}
            />

            <Input
              label="WhatsApp Number (For instant WhatsApp button)"
              placeholder="+1 234 567 8900"
              {...register('whatsapp')}
            />

            <Input
              label="Street Address"
              placeholder="42 Heritage Boulevard"
              leftIcon={<MapPin className="w-4 h-4" />}
              {...register('address')}
            />

            <Input
              label="City / Neighbourhood"
              placeholder="Downtown Gourmet Quarter"
              {...register('city')}
            />

            <Input
              label="Google Maps Link (For Directions button)"
              placeholder="https://maps.google.com/?q=..."
              {...register('googleMapsUrl')}
            />

            <Input
              label="Website"
              placeholder="https://yourbrand.com"
              leftIcon={<Globe className="w-4 h-4" />}
              {...register('website')}
            />

            <Input
              label="Instagram Username"
              placeholder="e.g. artisanwoodfire"
              leftIcon={<Instagram className="w-4 h-4" />}
              {...register('instagram')}
            />

            <Input
              label="Facebook Username"
              placeholder="e.g. artisanwoodfirecafe"
              leftIcon={<Facebook className="w-4 h-4" />}
              {...register('facebook')}
            />
          </div>
        </Card>

        {/* Opening Hours Schedule */}
        <Card className="p-6 sm:p-7 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Clock className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Store Hours & Real-time Status
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                The public page will automatically calculate "Open Now" or "Closed" for visitors.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {hours.map((h, idx) => (
              <div
                key={h.dayOfWeek}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60"
              >
                <div className="w-28 font-semibold text-xs text-slate-800">{h.dayName}</div>

                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Opens:</span>
                    <input
                      type="time"
                      disabled={h.isClosed}
                      value={h.openTime}
                      onChange={(e) => handleHourChange(idx, 'openTime', e.target.value)}
                      className="bg-white text-slate-900 text-xs px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500 disabled:opacity-40"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Closes:</span>
                    <input
                      type="time"
                      disabled={h.isClosed}
                      value={h.closeTime}
                      onChange={(e) => handleHourChange(idx, 'closeTime', e.target.value)}
                      className="bg-white text-slate-900 text-xs px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500 disabled:opacity-40"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-600">
                  <input
                    type="checkbox"
                    checked={h.isClosed}
                    onChange={(e) => handleHourChange(idx, 'isClosed', e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Closed</span>
                </label>
              </div>
            ))}
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
