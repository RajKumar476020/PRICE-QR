import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto, UpdateOfferDto } from './dto/offers.dto';

@Injectable()
export class OffersService {
  constructor(private prisma: PrismaService) {}

  private async verifyBusinessOwnership(businessId: string, userId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true, ownerId: true },
    });
    if (!business) {
      throw new NotFoundException('Business not found');
    }
    if (business.ownerId !== userId) {
      throw new ForbiddenException('Access denied. You do not own this business.');
    }
    return business;
  }

  async getOffers(businessId: string, userId: string) {
    await this.verifyBusinessOwnership(businessId, userId);

    const offers = await this.prisma.offer.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });

    const now = new Date();
    // Return with dynamic isExpired property
    return offers.map((offer) => ({
      ...offer,
      isExpired: new Date(offer.endDate) < now,
    }));
  }

  async createOffer(businessId: string, userId: string, dto: CreateOfferDto) {
    await this.verifyBusinessOwnership(businessId, userId);

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    if (end < start) {
      throw new BadRequestException('Offer end date cannot be earlier than start date.');
    }

    return this.prisma.offer.create({
      data: {
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        discountType: dto.discountType,
        discountAmount: dto.discountAmount !== undefined ? dto.discountAmount : null,
        promoCode: dto.promoCode?.trim() || null,
        imageUrl: dto.imageUrl || null,
        startDate: start,
        endDate: end,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
        businessId,
      },
    });
  }

  async updateOffer(
    businessId: string,
    offerId: string,
    userId: string,
    dto: UpdateOfferDto,
  ) {
    await this.verifyBusinessOwnership(businessId, userId);

    const offer = await this.prisma.offer.findFirst({
      where: { id: offerId, businessId },
    });
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    const start = dto.startDate ? new Date(dto.startDate) : offer.startDate;
    const end = dto.endDate ? new Date(dto.endDate) : offer.endDate;

    if (end < start) {
      throw new BadRequestException('Offer end date cannot be earlier than start date.');
    }

    return this.prisma.offer.update({
      where: { id: offerId },
      data: {
        title: dto.title !== undefined ? dto.title.trim() : undefined,
        description: dto.description !== undefined ? dto.description?.trim() || null : undefined,
        discountType: dto.discountType !== undefined ? dto.discountType : undefined,
        discountAmount: dto.discountAmount !== undefined ? dto.discountAmount : undefined,
        promoCode: dto.promoCode !== undefined ? dto.promoCode?.trim() || null : undefined,
        imageUrl: dto.imageUrl !== undefined ? dto.imageUrl : undefined,
        startDate: dto.startDate ? start : undefined,
        endDate: dto.endDate ? end : undefined,
        isActive: dto.isActive !== undefined ? dto.isActive : undefined,
      },
    });
  }

  async toggleActive(businessId: string, offerId: string, userId: string) {
    await this.verifyBusinessOwnership(businessId, userId);

    const offer = await this.prisma.offer.findFirst({
      where: { id: offerId, businessId },
    });
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return this.prisma.offer.update({
      where: { id: offerId },
      data: { isActive: !offer.isActive },
    });
  }

  async deleteOffer(businessId: string, offerId: string, userId: string) {
    await this.verifyBusinessOwnership(businessId, userId);

    const offer = await this.prisma.offer.findFirst({
      where: { id: offerId, businessId },
    });
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return this.prisma.offer.delete({
      where: { id: offerId },
    });
  }
}
