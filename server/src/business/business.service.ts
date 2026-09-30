import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto, UpdateBusinessDto, BusinessHourItemDto } from './dto/business.dto';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  private generatePublicId(): string {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `BUS_${code}`;
  }

  async create(userId: string, dto: CreateBusinessDto) {
    let publicId = dto.customPublicId?.trim().toUpperCase();
    if (!publicId) {
      publicId = this.generatePublicId();
      // Ensure unique
      let exists = await this.prisma.business.findUnique({ where: { publicId } });
      while (exists) {
        publicId = this.generatePublicId();
        exists = await this.prisma.business.findUnique({ where: { publicId } });
      }
    } else {
      const exists = await this.prisma.business.findUnique({ where: { publicId } });
      if (exists) {
        throw new BadRequestException('This Business ID is already taken. Please pick another.');
      }
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const targetUrl = `${clientUrl}/m/${publicId}`;

    const defaultHours = [
      { dayOfWeek: 1, dayName: 'Monday', openTime: '09:00', closeTime: '22:00', isClosed: false },
      { dayOfWeek: 2, dayName: 'Tuesday', openTime: '09:00', closeTime: '22:00', isClosed: false },
      { dayOfWeek: 3, dayName: 'Wednesday', openTime: '09:00', closeTime: '22:00', isClosed: false },
      { dayOfWeek: 4, dayName: 'Thursday', openTime: '09:00', closeTime: '22:00', isClosed: false },
      { dayOfWeek: 5, dayName: 'Friday', openTime: '09:00', closeTime: '22:00', isClosed: false },
      { dayOfWeek: 6, dayName: 'Saturday', openTime: '09:00', closeTime: '23:00', isClosed: false },
      { dayOfWeek: 0, dayName: 'Sunday', openTime: '10:00', closeTime: '22:00', isClosed: false },
    ];

    const hoursToCreate = dto.hours && dto.hours.length > 0 ? dto.hours : defaultHours;

    const business = await this.prisma.business.create({
      data: {
        name: dto.name,
        category: dto.category,
        publicId,
        tagline: dto.tagline || null,
        description: dto.description || null,
        phone: dto.phone || null,
        whatsapp: dto.whatsapp || null,
        email: dto.email || null,
        website: dto.website || null,
        address: dto.address || null,
        city: dto.city || null,
        googleMapsUrl: dto.googleMapsUrl || null,
        instagram: dto.instagram || null,
        facebook: dto.facebook || null,
        logoUrl: dto.logoUrl || null,
        coverUrl: dto.coverUrl || null,
        currency: dto.currency || '₹',
        ownerId: userId,
        hours: {
          create: hoursToCreate.map((h) => ({
            dayOfWeek: h.dayOfWeek,
            dayName: h.dayName,
            openTime: h.openTime,
            closeTime: h.closeTime,
            isClosed: h.isClosed,
          })),
        },
        qrCode: {
          create: {
            targetUrl,
            qrStyle: JSON.stringify({
              fgColor: '#111111',
              bgColor: '#FFFFFF',
              level: 'H',
              includeMargin: true,
            }),
          },
        },
        subscription: {
          create: {
            planName: 'PRO',
            status: 'ACTIVE',
            features: JSON.stringify(['unlimited_products', 'custom_qr', 'analytics', 'offers']),
          },
        },
      },
      include: {
        hours: true,
        qrCode: true,
        subscription: true,
      },
    });

    return business;
  }

  async findByOwner(userId: string) {
    return this.prisma.business.findMany({
      where: { ownerId: userId },
      include: {
        hours: { orderBy: { dayOfWeek: 'asc' } },
        qrCode: true,
        subscription: true,
        _count: {
          select: {
            categories: true,
            products: true,
            offers: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
      include: {
        hours: { orderBy: { dayOfWeek: 'asc' } },
        qrCode: true,
        subscription: true,
        categories: {
          orderBy: { sortOrder: 'asc' },
          include: {
            _count: { select: { products: true } },
          },
        },
        _count: {
          select: {
            products: true,
            offers: true,
            analyticsEvents: true,
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    if (business.ownerId !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
      if (user?.role !== 'ADMIN') {
        throw new ForbiddenException('Access denied. You do not own this business.');
      }
    }

    return business;
  }

  async update(id: string, userId: string, dto: UpdateBusinessDto) {
    await this.findById(id, userId); // verify ownership

    const updated = await this.prisma.business.update({
      where: { id },
      data: {
        name: dto.name,
        category: dto.category,
        tagline: dto.tagline,
        description: dto.description,
        phone: dto.phone,
        whatsapp: dto.whatsapp,
        email: dto.email,
        website: dto.website,
        address: dto.address,
        city: dto.city,
        googleMapsUrl: dto.googleMapsUrl,
        instagram: dto.instagram,
        facebook: dto.facebook,
        logoUrl: dto.logoUrl,
        coverUrl: dto.coverUrl,
        currency: dto.currency,
      },
      include: {
        hours: { orderBy: { dayOfWeek: 'asc' } },
        qrCode: true,
      },
    });

    if (dto.hours && dto.hours.length > 0) {
      await this.updateHours(id, userId, dto.hours);
    }

    return updated;
  }

  async updateHours(id: string, userId: string, hours: BusinessHourItemDto[]) {
    await this.findById(id, userId); // verify ownership

    // Upsert each day
    for (const h of hours) {
      await this.prisma.businessHours.upsert({
        where: {
          businessId_dayOfWeek: {
            businessId: id,
            dayOfWeek: h.dayOfWeek,
          },
        },
        update: {
          dayName: h.dayName,
          openTime: h.openTime,
          closeTime: h.closeTime,
          isClosed: h.isClosed,
        },
        create: {
          businessId: id,
          dayOfWeek: h.dayOfWeek,
          dayName: h.dayName,
          openTime: h.openTime,
          closeTime: h.closeTime,
          isClosed: h.isClosed,
        },
      });
    }

    return this.prisma.businessHours.findMany({
      where: { businessId: id },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async getSummary(id: string, userId: string) {
    const business = await this.findById(id, userId);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalProducts, activeOffers, todayScans, totalScans, todayViews, totalViews] =
      await Promise.all([
        this.prisma.product.count({ where: { businessId: id, isAvailable: true } }),
        this.prisma.offer.count({
          where: {
            businessId: id,
            isActive: true,
            endDate: { gte: now },
          },
        }),
        this.prisma.analyticsEvent.count({
          where: {
            businessId: id,
            eventType: 'QR_SCAN',
            createdAt: { gte: todayStart },
          },
        }),
        this.prisma.analyticsEvent.count({
          where: {
            businessId: id,
            eventType: 'QR_SCAN',
          },
        }),
        this.prisma.analyticsEvent.count({
          where: {
            businessId: id,
            eventType: 'PAGE_VIEW',
            createdAt: { gte: todayStart },
          },
        }),
        this.prisma.analyticsEvent.count({
          where: {
            businessId: id,
            eventType: 'PAGE_VIEW',
          },
        }),
      ]);

    const recentActivity = await this.prisma.analyticsEvent.findMany({
      where: { businessId: id },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    return {
      business: {
        id: business.id,
        publicId: business.publicId,
        name: business.name,
        category: business.category,
        currency: business.currency,
        logoUrl: business.logoUrl,
        coverUrl: business.coverUrl,
        status: business.status,
      },
      stats: {
        totalProducts,
        activeOffers,
        todayScans,
        totalScans: totalScans + (business.qrCode?.scansCount || 0),
        todayViews,
        totalViews,
      },
      recentActivity,
    };
  }
}
