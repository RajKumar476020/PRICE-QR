import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getPlatformStats() {
    const [totalBusinesses, activeBusinesses, suspendedBusinesses, totalUsers, totalProducts, totalEvents] =
      await Promise.all([
        this.prisma.business.count(),
        this.prisma.business.count({ where: { status: 'ACTIVE' } }),
        this.prisma.business.count({ where: { status: 'SUSPENDED' } }),
        this.prisma.user.count(),
        this.prisma.product.count(),
        this.prisma.analyticsEvent.count(),
      ]);

    const qrScans = await this.prisma.analyticsEvent.count({
      where: { eventType: 'QR_SCAN' },
    });

    const pageViews = await this.prisma.analyticsEvent.count({
      where: { eventType: 'PAGE_VIEW' },
    });

    return {
      totalBusinesses,
      activeBusinesses,
      suspendedBusinesses,
      totalUsers,
      totalProducts,
      totalEvents,
      qrScans,
      pageViews,
    };
  }

  async getBusinesses(search?: string, status?: string) {
    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { publicId: { contains: search } },
        { category: { contains: search } },
      ];
    }

    return this.prisma.business.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        subscription: true,
        _count: {
          select: {
            products: true,
            categories: true,
            offers: true,
            analyticsEvents: true,
          },
        },
      },
    });
  }

  async toggleBusinessStatus(id: string, status: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
    });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return this.prisma.business.update({
      where: { id },
      data: { status },
    });
  }

  async getUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { businesses: true },
        },
      },
    });
  }
}
