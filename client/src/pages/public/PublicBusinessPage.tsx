import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Phone,
  MessageCircle,
  MapPin,
  Share2,
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  ExternalLink,
  Globe,
  Instagram,
  Facebook,
  Tag,
  Check,
  Sparkles,
  Info,
  Store,
  Package,
  X,
} from 'lucide-react';
import { api, resolveImageUrl } from '../../services/api';
import type { Category, Product, PublicBusinessData } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { PriceDisplay } from '../../components/ui/PriceDisplay';
import { Skeleton, ProductCardSkeleton } from '../../components/ui/Skeleton';
import { Modal } from '../../components/ui/Modal';
import { toast } from '../../components/ui/Toast';

export const PublicBusinessPage: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();

  const [business, setBusiness] = useState<PublicBusinessData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch business profile & menu
  useEffect(() => {
    if (!businessId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [bizData, menuData] = await Promise.all([
          api.getPublicBusiness(businessId),
          api.getPublicMenu(businessId),
        ]);
        setBusiness(bizData);
        setCategories(menuData.categories || []);

        // Track page view event
        try {
          await api.trackEvent(bizData.id, 'PAGE_VIEW');
          // If came from QR code (query param or standalone)
          if (window.location.search.includes('source=qr') || document.referrer === '') {
            await api.trackEvent(bizData.id, 'QR_SCAN');
          }
        } catch {}
      } catch (err: any) {
        console.error('Error fetching public business:', err);
        setError(err.message || 'Unable to load menu. Please check the URL or try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [businessId]);

  // Handle Share / Copy Link
  const handleShare = async () => {
    const shareData = {
      title: `${business?.name} — Digital Menu`,
      text: `View our digital menu & live prices: ${window.location.href}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        if (business) {
          api.trackEvent(business.id, 'CONTACT_CLICK', { action: 'SHARE' });
        }
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success('Storefront link copied!');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleTrackContact = (type: string) => {
    if (business) {
      api.trackEvent(business.id, 'CONTACT_CLICK', { type });
    }
  };

  const handleViewProduct = (prod: Product) => {
    setSelectedProduct(prod);
    if (business) {
      api.trackEvent(business.id, 'PRODUCT_VIEW', { productId: prod.id, name: prod.name });
    }
  };

  // Filtered categories and products
  const filteredCategories = useMemo(() => {
    if (!categories) return [];

    return categories
      .map((cat) => {
        const matchedProducts = (cat.products || []).filter((prod) => {
          if (!prod.isAvailable) return false;
          if (!searchQuery.trim()) return true;
          const query = searchQuery.toLowerCase();
          return (
            prod.name.toLowerCase().includes(query) ||
            (prod.description && prod.description.toLowerCase().includes(query))
          );
        });

        return {
          ...cat,
          products: matchedProducts,
        };
      })
      .filter((cat) => {
        if (activeCategoryId !== 'all' && cat.id !== activeCategoryId) {
          return false;
        }
        return cat.products && cat.products.length > 0;
      });
  }, [categories, activeCategoryId, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex justify-center">
        <div className="max-w-2xl w-full p-4 sm:p-6 space-y-6">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <div className="flex gap-4">
            <Skeleton className="w-16 h-16 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div className="space-y-4">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200/90 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <Info className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Something went wrong</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            {error || "We couldn't load this business menu right now."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/"
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-slate-900 selection:bg-brand-100 selection:text-brand-900 antialiased pb-20">
      {/* Desktop Centered Container (Section 30: do NOT stretch across entire desktop screen!) */}
      <div className="max-w-3xl mx-auto bg-white min-h-screen border-x border-slate-200/60 shadow-subtle flex flex-col">
        {/* Cover Image Banner (Section 24) */}
        <div className="relative h-44 sm:h-56 w-full bg-slate-800 overflow-hidden">
          {business.coverUrl ? (
            <img
              src={resolveImageUrl(business.coverUrl)}
              alt={business.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-slate-900 to-slate-800 flex items-center justify-center text-slate-500">
              <Store className="w-12 h-12 opacity-30 text-white" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Quick Share floating icon at top right */}
          <button
            onClick={handleShare}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-800 hover:bg-white shadow-md transition-all active:scale-95"
            aria-label="Share Storefront"
          >
            {copiedLink ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Storefront Header Info (Section 24 & 25) */}
        <div className="px-5 sm:px-8 pb-5 pt-0 relative -mt-12">
          <div className="flex items-end justify-between gap-4">
            {/* Logo */}
            {business.logoUrl ? (
              <img
                src={resolveImageUrl(business.logoUrl)}
                alt={business.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-card shrink-0 bg-white"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-brand-50 border-4 border-white shadow-card flex items-center justify-center font-black text-2xl text-brand-700 shrink-0">
                {business.name.slice(0, 2).toUpperCase()}
              </div>
            )}

            {/* Live Open / Closed Status Badge (Section 24) */}
            <div className="mb-2">
              <button
                onClick={() => setShowHoursModal(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors shadow-subtle ${
                  business.isOpen
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    business.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`}
                />
                <span>{business.statusText}</span>
                <Clock className="w-3 h-3 ml-0.5 opacity-60" />
              </button>
            </div>
          </div>

          {/* Business Details */}
          <div className="mt-3.5 text-left">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {business.name}
            </h1>

            {business.tagline && (
              <p className="text-xs sm:text-sm text-brand-700 font-medium mt-1">
                {business.tagline}
              </p>
            )}

            {business.description && (
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {business.description}
              </p>
            )}

            {/* Address */}
            {business.address && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  {business.address}
                  {business.city ? `, ${business.city}` : ''}
                </span>
              </div>
            )}
          </div>

          {/* Quick Action Buttons (Section 25: Call, WhatsApp, Directions, Share) */}
          <div className="mt-5 grid grid-cols-4 gap-2 border-y border-slate-100 py-3.5">
            {/* Call */}
            {business.phone ? (
              <a
                href={`tel:${business.phone}`}
                onClick={() => handleTrackContact('CALL')}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="text-[11px] font-bold">Call</span>
              </a>
            ) : (
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50/50 text-slate-300">
                <Phone className="w-4 h-4 mb-1" />
                <span className="text-[11px] font-medium">Call</span>
              </div>
            )}

            {/* WhatsApp */}
            {business.whatsapp ? (
              <a
                href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hi ${business.name}, I am viewing your digital menu!`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleTrackContact('WHATSAPP')}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="text-[11px] font-bold">WhatsApp</span>
              </a>
            ) : (
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50/50 text-slate-300">
                <MessageCircle className="w-4 h-4 mb-1" />
                <span className="text-[11px] font-medium">WhatsApp</span>
              </div>
            )}

            {/* Directions */}
            {business.googleMapsUrl || business.address ? (
              <a
                href={
                  business.googleMapsUrl ||
                  `https://maps.google.com/?q=${encodeURIComponent(
                    `${business.name} ${business.address || ''} ${business.city || ''}`,
                  )}`
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleTrackContact('DIRECTIONS')}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors"
              >
                <MapPin className="w-4 h-4 text-brand-600 mb-1" />
                <span className="text-[11px] font-bold">Directions</span>
              </a>
            ) : (
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50/50 text-slate-300">
                <MapPin className="w-4 h-4 mb-1" />
                <span className="text-[11px] font-medium">Directions</span>
              </div>
            )}

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors"
            >
              <Share2 className="w-4 h-4 text-slate-600 mb-1" />
              <span className="text-[11px] font-bold">Share</span>
            </button>
          </div>

          {/* Social Links if present */}
          {(business.website || business.instagram || business.facebook) && (
            <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 justify-center">
              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-slate-900"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Website</span>
                </a>
              )}
              {business.instagram && (
                <a
                  href={`https://instagram.com/${business.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-slate-900"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>@{business.instagram.replace('@', '')}</span>
                </a>
              )}
              {business.facebook && (
                <a
                  href={`https://facebook.com/${business.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-slate-900"
                >
                  <Facebook className="w-3.5 h-3.5" />
                  <span>Facebook</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* ACTIVE OFFERS SECTION (Section 26) */}
        {business.activeOffers && business.activeOffers.length > 0 && (
          <div className="px-5 sm:px-8 py-2">
            {business.activeOffers.map((offer) => (
              <div
                key={offer.id}
                className="p-4 rounded-2xl bg-gradient-to-r from-brand-50 to-amber-50 border border-brand-200 shadow-subtle text-left flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Tag className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-brand-500 text-white px-2 py-0.5 rounded-full">
                      SPECIAL OFFER
                    </span>
                    {offer.promoCode && (
                      <span className="text-[11px] font-mono font-bold bg-white text-brand-800 border border-brand-200 px-2 py-0.5 rounded-md">
                        USE CODE: {offer.promoCode}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight mt-1">
                    {offer.title}
                  </h3>
                  {offer.description && (
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {offer.description}
                    </p>
                  )}
                  <div className="text-[10px] text-slate-400 mt-1 font-medium">
                    Valid until {new Date(offer.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STICKY SEARCH & CATEGORY CHIPS BAR (Sections 28 & 29) */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-y border-slate-200/80 px-5 sm:px-8 py-3 space-y-2.5 shadow-sm">
          {/* Instant Search Bar (Section 28) */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products, services, items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Horizontal Category Chips (Section 29) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-left">
            <button
              onClick={() => setActiveCategoryId('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategoryId === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Items
            </button>

            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategoryId(c.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategoryId === c.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* LIVE CATALOG & PRICE LIST */}
        <div className="px-5 sm:px-8 py-6 space-y-8 flex-1 text-left">
          {filteredCategories.length === 0 ? (
            <div className="py-14 text-center">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No items match your search</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                We couldn't find anything matching "{searchQuery}". Try adjusting your keywords or reset filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategoryId('all');
                }}
                className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-black transition-colors"
              >
                View Full Price List
              </button>
            </div>
          ) : (
            filteredCategories.map((cat) => (
              <div key={cat.id} className="space-y-3.5 scroll-mt-36" id={`cat-${cat.id}`}>
                <div className="border-b border-slate-100 pb-2">
                  <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    {cat.name}
                  </h2>
                  {cat.description && (
                    <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                  {(cat.products || []).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleViewProduct(product)}
                      className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-card transition-all cursor-pointer flex gap-4 items-center group"
                    >
                      {/* Left: Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          {product.dietaryType === 'VEG' && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                              Veg
                            </span>
                          )}
                          {product.dietaryType === 'VEGAN' && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded">
                              Vegan
                            </span>
                          )}
                          {product.dietaryType === 'NON_VEG' && (
                            <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded">
                              Non-Veg
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              Special
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight group-hover:text-brand-600 transition-colors">
                          {product.name}
                        </h3>

                        {product.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        )}

                        <div className="mt-2.5">
                          <PriceDisplay
                            price={product.price}
                            discountPrice={product.discountPrice}
                            currency={business.currency}
                            size="md"
                          />
                        </div>
                      </div>

                      {/* Right: Item Photo */}
                      {product.imageUrl && (
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-50">
                          <img
                            src={resolveImageUrl(product.imageUrl)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info & Powered by PriceQR */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 space-y-2">
          <p className="font-semibold text-slate-700">{business.name}</p>
          {business.address && <p>{business.address}</p>}
          <div className="pt-2 text-[11px] text-slate-400">
            Powered by{' '}
            <Link to="/" className="font-bold text-slate-700 hover:underline">
              PriceQR
            </Link>{' '}
            — Live QR Price Lists & Digital Business Profiles
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name}
        description={selectedProduct?.category?.name || 'Item details'}
        maxWidth="md"
      >
        {selectedProduct && (
          <div className="space-y-4 text-left">
            {selectedProduct.imageUrl && (
              <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={resolveImageUrl(selectedProduct.imageUrl)}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <PriceDisplay
                price={selectedProduct.price}
                discountPrice={selectedProduct.discountPrice}
                currency={business.currency}
                size="lg"
              />
              <div className="flex items-center gap-1.5">
                {selectedProduct.dietaryType === 'VEG' && <Badge variant="success">Vegetarian</Badge>}
                {selectedProduct.dietaryType === 'VEGAN' && <Badge variant="success">100% Vegan</Badge>}
                {selectedProduct.dietaryType === 'NON_VEG' && <Badge variant="danger">Non-Veg</Badge>}
              </div>
            </div>

            {selectedProduct.description && (
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                {selectedProduct.description}
              </div>
            )}

            {/* Quick Inquire via WhatsApp button if phone/WhatsApp available */}
            {business.whatsapp && (
              <div className="pt-4 border-t border-slate-100">
                <a
                  href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hi ${business.name}, I want to order/inquire about "${selectedProduct.name}" (${business.currency}${selectedProduct.discountPrice || selectedProduct.price})!`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire / Order on WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Opening Hours Schedule Modal */}
      <Modal
        isOpen={showHoursModal}
        onClose={() => setShowHoursModal(false)}
        title="Opening Hours"
        description={business.name}
        maxWidth="sm"
      >
        <div className="space-y-2.5 divide-y divide-slate-100 pt-1 text-xs text-left">
          {business.hours?.map((h) => (
            <div key={h.dayOfWeek} className="pt-2 flex items-center justify-between">
              <span className="font-semibold text-slate-800">{h.dayName}</span>
              <span className={h.isClosed ? 'text-red-600 font-bold' : 'text-slate-600 font-medium'}>
                {h.isClosed ? 'Closed' : `${h.openTime} – ${h.closeTime}`}
              </span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
