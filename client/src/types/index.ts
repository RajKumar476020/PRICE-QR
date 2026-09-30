export interface User {
  id: string;
  email: string;
  name: string;
  role: 'OWNER' | 'ADMIN';
  createdAt: string;
}

export interface BusinessHour {
  id?: string;
  businessId?: string;
  dayOfWeek: number;
  dayName: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface QRCodeData {
  id?: string;
  businessId?: string;
  targetUrl: string;
  qrStyle?: {
    fgColor?: string;
    bgColor?: string;
    level?: string;
    includeMargin?: boolean;
  };
  downloadCount?: number;
  scansCount?: number;
}

export interface Category {
  id: string;
  businessId: string;
  name: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
  products?: Product[];
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  businessId: string;
  categoryId: string;
  name: string;
  description?: string | null;
  price: number;
  discountPrice?: number | null;
  imageUrl?: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  dietaryType?: 'VEG' | 'NON_VEG' | 'VEGAN' | 'NONE';
  sortOrder: number;
  category?: {
    id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Offer {
  id: string;
  businessId: string;
  title: string;
  description?: string | null;
  discountType: 'PERCENTAGE' | 'FIXED' | 'PROMO';
  discountAmount?: number | null;
  promoCode?: string | null;
  imageUrl?: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isExpired?: boolean;
}

export interface Business {
  id: string;
  publicId: string;
  name: string;
  category: string;
  tagline?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  googleMapsUrl?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  currency: string;
  status: 'ACTIVE' | 'SUSPENDED';
  ownerId?: string;
  hours?: BusinessHour[];
  categories?: Category[];
  products?: Product[];
  offers?: Offer[];
  qrCode?: QRCodeData;
  _count?: {
    categories?: number;
    products?: number;
    offers?: number;
  };
}

export interface PublicBusinessData extends Business {
  isOpen: boolean;
  statusText: string;
  activeOffers: Offer[];
}

export interface AnalyticsSummary {
  period: 'today' | '7d' | '30d';
  summary: {
    totalScans: number;
    totalViews: number;
    productViews: number;
    contactClicks: number;
    uniqueVisitorsEstimate: number;
  };
  timeline: Array<{
    time: string;
    scans: number;
    views: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    viewCount: number;
  }>;
}

export interface PlatformStats {
  totalBusinesses: number;
  activeBusinesses: number;
  suspendedBusinesses: number;
  totalUsers: number;
  totalProducts: number;
  totalEvents: number;
  qrScans: number;
  pageViews: number;
}
