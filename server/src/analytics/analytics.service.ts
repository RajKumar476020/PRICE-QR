import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface TrackEventDto {
  businessId: string;
  eventType: 'QR_SCAN' | 'PAGE_VIEW' | 'PRODUCT_VIEW' | 'CATEGORY_CLICK' | 'OFFER_VIEW' | 'CONTACT_CLICK';
  metadata?: any;
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async trackEvent(dto: TrackEventDto) {
    if (!dto.businessId) return null;

    // Resolve business by either CUID id or publicId (e.g. BUS_8F72K9)
    const business = await this.prisma.business.findFirst({
      where: {
        OR: [{ id: dto.businessId }, { publicId: dto.businessId }],
      },
      select: { id: true },
    });

    if (!business) {
      return null;
    }

    const event = await this.prisma.analyticsEvent.create({
      data: {
        businessId: business.id,
        eventType: dto.eventType,
        metadata: dto.metadata ? JSON.stringify(dto.metadata) : null,
        userAgent: dto.userAgent?.slice(0, 255) || null,
      },
    });

    // If QR scan, increment QRCode scansCount
    if (dto.eventType === 'QR_SCAN') {
      await this.prisma.qRCode.updateMany({
        where: { businessId: business.id },
        data: { scansCount: { increment: 1 } },
      });
    }

    return { success: true, eventId: event.id };
  }

  async getAnalytics(businessId: string, userId: string, period: 'today' | '7d' | '30d' = '7d') {
    // Resolve business by ID or publicId
    const business = await this.prisma.business.findFirst({
      where: {
        OR: [{ id: businessId }, { publicId: businessId }],
      },
      include: {
        qrCode: true,
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    if (business.ownerId !== userId) {
      throw new ForbiddenException('Access denied. You do not own this business.');
    }

    const now = new Date();
    let startDate: Date;

    if (period === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    } else if (period === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      startDate.setHours(0, 0, 0, 0);
    } else {
      // 7d default
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      startDate.setHours(0, 0, 0, 0);
    }

    // Fetch events in period
    const events = await this.prisma.analyticsEvent.findMany({
      where: {
        businessId: business.id,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'asc' },
    });

    // All-time counts for overall context
    const [allTimeScansCount, allTimeViewsCount] = await Promise.all([
      this.prisma.analyticsEvent.count({
        where: { businessId: business.id, eventType: 'QR_SCAN' },
      }),
      this.prisma.analyticsEvent.count({
        where: { businessId: business.id, eventType: 'PAGE_VIEW' },
      }),
    ]);

    const periodScans = events.filter((e) => e.eventType === 'QR_SCAN').length;
    const periodViews = events.filter((e) => e.eventType === 'PAGE_VIEW').length;
    const productViews = events.filter((e) => e.eventType === 'PRODUCT_VIEW').length;
    const contactClicks = events.filter((e) => e.eventType === 'CONTACT_CLICK').length;
    const offerViews = events.filter((e) => e.eventType === 'OFFER_VIEW').length;

    // Timeline generation
    const timeline: Array<{ time: string; scans: number; views: number }> = [];

    if (period === 'today') {
      // 24 hours of today
      const currentHour = now.getHours();
      for (let h = 0; h <= Math.max(currentHour, 12); h++) {
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 === 0 ? 12 : h % 12;
        const timeLabel = `${displayH} ${ampm}`;

        const scansInHour = events.filter(
          (e) => e.eventType === 'QR_SCAN' && new Date(e.createdAt).getHours() === h,
        ).length;
        const viewsInHour = events.filter(
          (e) => e.eventType === 'PAGE_VIEW' && new Date(e.createdAt).getHours() === h,
        ).length;

        timeline.push({
          time: timeLabel,
          scans: scansInHour,
          views: viewsInHour,
        });
      }
    } else {
      const numDays = period === '30d' ? 30 : 7;
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      for (let i = numDays - 1; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const y = d.getFullYear();
        const m = d.getMonth();
        const dayNum = d.getDate();

        const dayStart = new Date(y, m, dayNum, 0, 0, 0, 0);
        const dayEnd = new Date(y, m, dayNum, 23, 59, 59, 999);

        const timeLabel =
          period === '7d'
            ? `${dayNames[d.getDay()]} ${dayNum}`
            : `${d.toLocaleDateString('en-US', { month: 'short' })} ${dayNum}`;

        const scansInDay = events.filter((e) => {
          const t = new Date(e.createdAt).getTime();
          return e.eventType === 'QR_SCAN' && t >= dayStart.getTime() && t <= dayEnd.getTime();
        }).length;

        const viewsInDay = events.filter((e) => {
          const t = new Date(e.createdAt).getTime();
          return e.eventType === 'PAGE_VIEW' && t >= dayStart.getTime() && t <= dayEnd.getTime();
        }).length;

        timeline.push({
          time: timeLabel,
          scans: scansInDay,
          views: viewsInDay,
        });
      }
    }

    // Product breakdown
    const productCounts: { [id: string]: number } = {};
    for (const e of events) {
      if (e.eventType === 'PRODUCT_VIEW' && e.metadata) {
        try {
          const parsed = JSON.parse(e.metadata);
          if (parsed.productId) {
            productCounts[parsed.productId] = (productCounts[parsed.productId] || 0) + 1;
          }
        } catch {}
      }
    }

    // Get all products for the business to show rankings
    const allProducts = await this.prisma.product.findMany({
      where: { businessId: business.id },
      select: { id: true, name: true, price: true, imageUrl: true, category: { select: { name: true } } },
      orderBy: { sortOrder: 'asc' },
    });

    const enrichedProducts = allProducts
      .map((p) => ({
        ...p,
        viewCount: productCounts[p.id] || 0,
      }))
      .sort((a, b) => b.viewCount - a.viewCount);

    const totalScansCumulative = Math.max(
      allTimeScansCount + (business.qrCode?.scansCount || 0),
      periodScans,
    );

    return {
      period,
      summary: {
        totalScans: periodScans,
        totalAllTimeScans: totalScansCumulative,
        totalViews: periodViews,
        totalAllTimeViews: allTimeViewsCount,
        productViews,
        contactClicks,
        offerViews,
        uniqueVisitorsEstimate: Math.max(periodViews > 0 ? 1 : 0, Math.round(periodViews * 0.76)),
        conversionRate:
          periodViews > 0 ? Math.min(100, Math.round(((productViews + contactClicks) / periodViews) * 100)) : 0,
      },
      timeline,
      topProducts: enrichedProducts.slice(0, 8),
    };
  }
}
