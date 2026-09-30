import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicService {
  constructor(private prisma: PrismaService) {}

  async getPublicBusiness(publicId: string) {
    const trimmed = (publicId || '').trim();
    const upper = trimmed.toUpperCase();
    const lower = trimmed.toLowerCase();

    const business = await this.prisma.business.findFirst({
      where: {
        OR: [
          { publicId: upper },
          { publicId: trimmed },
          { publicId: lower },
          { id: trimmed },
        ],
      },
      include: {
        hours: { orderBy: { dayOfWeek: 'asc' } },
        offers: {
          where: {
            isActive: true,
            endDate: { gte: new Date() },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('Business profile not found.');
    }

    if (business.status === 'SUSPENDED') {
      throw new ForbiddenException('This business profile is currently suspended. Please contact support.');
    }

    // Calculate real-time Open/Closed status
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const todayHours = business.hours.find((h) => h.dayOfWeek === currentDayOfWeek);
    let isOpen = false;
    let statusText = 'Closed';

    if (todayHours && !todayHours.isClosed) {
      const [openH, openM] = todayHours.openTime.split(':').map(Number);
      const [closeH, closeM] = todayHours.closeTime.split(':').map(Number);

      const openMinutes = openH * 60 + (openM || 0);
      const closeMinutes = closeH * 60 + (closeM || 0);

      if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
        isOpen = true;
        statusText = `Open now · Closes at ${this.formatTime(todayHours.closeTime)}`;
      } else if (currentMinutes < openMinutes) {
        statusText = `Closed · Opens at ${this.formatTime(todayHours.openTime)}`;
      } else {
        // Find next opening day
        statusText = 'Closed for the day';
      }
    } else {
      statusText = 'Closed today';
    }

    return {
      id: business.id,
      publicId: business.publicId,
      name: business.name,
      category: business.category,
      tagline: business.tagline,
      description: business.description,
      phone: business.phone,
      whatsapp: business.whatsapp,
      email: business.email,
      website: business.website,
      address: business.address,
      city: business.city,
      googleMapsUrl: business.googleMapsUrl,
      instagram: business.instagram,
      facebook: business.facebook,
      logoUrl: business.logoUrl,
      coverUrl: business.coverUrl,
      currency: business.currency,
      status: business.status,
      isOpen,
      statusText,
      hours: business.hours,
      activeOffers: business.offers,
    };
  }

  async getPublicMenu(publicId: string, search?: string, categoryId?: string) {
    const trimmed = (publicId || '').trim();
    const upper = trimmed.toUpperCase();
    const lower = trimmed.toLowerCase();

    const business = await this.prisma.business.findFirst({
      where: {
        OR: [
          { publicId: upper },
          { publicId: trimmed },
          { publicId: lower },
          { id: trimmed },
        ],
      },
      select: { id: true, status: true, currency: true },
    });

    if (!business) {
      throw new NotFoundException('Business not found.');
    }

    if (business.status === 'SUSPENDED') {
      throw new ForbiddenException('This business profile is currently suspended.');
    }

    const categories = await this.prisma.category.findMany({
      where: {
        businessId: business.id,
        isActive: true,
      },
      orderBy: { sortOrder: 'asc' },
      include: {
        products: {
          where: {
            isAvailable: true,
            ...(search
              ? {
                  OR: [
                    { name: { contains: search } },
                    { description: { contains: search } },
                  ],
                }
              : {}),
            ...(categoryId ? { categoryId } : {}),
          },
          orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
        },
      },
    });

    // Filter out categories that have no products when search is active
    const filteredCategories = categories.filter((c) => !search || c.products.length > 0);

    return {
      currency: business.currency,
      categories: filteredCategories,
    };
  }

  private formatTime(time24: string): string {
    const [hStr, mStr] = time24.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; // 0 becomes 12
    return `${h}:${m} ${ampm}`;
  }
}
