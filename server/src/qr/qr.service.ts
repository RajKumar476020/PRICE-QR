import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QrService {
  constructor(private prisma: PrismaService) {}

  private async verifyBusinessOwnership(businessId: string, userId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true, ownerId: true, publicId: true, name: true, logoUrl: true },
    });
    if (!business) {
      throw new NotFoundException('Business not found');
    }
    if (business.ownerId !== userId) {
      throw new ForbiddenException('Access denied. You do not own this business.');
    }
    return business;
  }

  async getQrData(businessId: string, userId: string) {
    const business = await this.verifyBusinessOwnership(businessId, userId);

    let qr = await this.prisma.qRCode.findUnique({
      where: { businessId },
    });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const targetUrl = `${clientUrl}/m/${business.publicId}?source=qr`;

    if (!qr) {
      qr = await this.prisma.qRCode.create({
        data: {
          businessId,
          targetUrl,
          qrStyle: JSON.stringify({
            fgColor: '#111111',
            bgColor: '#FFFFFF',
            level: 'H',
            includeMargin: true,
          }),
        },
      });
    }

    return {
      id: qr.id,
      businessId: business.id,
      businessPublicId: business.publicId,
      businessName: business.name,
      businessLogoUrl: business.logoUrl,
      targetUrl,
      qrStyle: qr.qrStyle ? JSON.parse(qr.qrStyle) : null,
      downloadCount: qr.downloadCount,
      scansCount: qr.scansCount,
      updatedAt: qr.updatedAt,
    };
  }

  async updateQrStyle(businessId: string, userId: string, qrStyle: any) {
    await this.verifyBusinessOwnership(businessId, userId);

    const styleStr = typeof qrStyle === 'string' ? qrStyle : JSON.stringify(qrStyle);

    return this.prisma.qRCode.update({
      where: { businessId },
      data: { qrStyle: styleStr },
    });
  }

  async recordDownload(businessId: string, userId: string) {
    await this.verifyBusinessOwnership(businessId, userId);

    return this.prisma.qRCode.update({
      where: { businessId },
      data: {
        downloadCount: { increment: 1 },
      },
    });
  }
}
