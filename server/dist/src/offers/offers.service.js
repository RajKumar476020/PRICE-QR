"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OffersService = class OffersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async verifyBusinessOwnership(businessId, userId) {
        const business = await this.prisma.business.findUnique({
            where: { id: businessId },
            select: { id: true, ownerId: true },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        if (business.ownerId !== userId) {
            throw new common_1.ForbiddenException('Access denied. You do not own this business.');
        }
        return business;
    }
    async getOffers(businessId, userId) {
        await this.verifyBusinessOwnership(businessId, userId);
        const offers = await this.prisma.offer.findMany({
            where: { businessId },
            orderBy: { createdAt: 'desc' },
        });
        const now = new Date();
        return offers.map((offer) => ({
            ...offer,
            isExpired: new Date(offer.endDate) < now,
        }));
    }
    async createOffer(businessId, userId, dto) {
        await this.verifyBusinessOwnership(businessId, userId);
        const start = new Date(dto.startDate);
        const end = new Date(dto.endDate);
        if (end < start) {
            throw new common_1.BadRequestException('Offer end date cannot be earlier than start date.');
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
    async updateOffer(businessId, offerId, userId, dto) {
        await this.verifyBusinessOwnership(businessId, userId);
        const offer = await this.prisma.offer.findFirst({
            where: { id: offerId, businessId },
        });
        if (!offer) {
            throw new common_1.NotFoundException('Offer not found');
        }
        const start = dto.startDate ? new Date(dto.startDate) : offer.startDate;
        const end = dto.endDate ? new Date(dto.endDate) : offer.endDate;
        if (end < start) {
            throw new common_1.BadRequestException('Offer end date cannot be earlier than start date.');
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
    async toggleActive(businessId, offerId, userId) {
        await this.verifyBusinessOwnership(businessId, userId);
        const offer = await this.prisma.offer.findFirst({
            where: { id: offerId, businessId },
        });
        if (!offer) {
            throw new common_1.NotFoundException('Offer not found');
        }
        return this.prisma.offer.update({
            where: { id: offerId },
            data: { isActive: !offer.isActive },
        });
    }
    async deleteOffer(businessId, offerId, userId) {
        await this.verifyBusinessOwnership(businessId, userId);
        const offer = await this.prisma.offer.findFirst({
            where: { id: offerId, businessId },
        });
        if (!offer) {
            throw new common_1.NotFoundException('Offer not found');
        }
        return this.prisma.offer.delete({
            where: { id: offerId },
        });
    }
};
exports.OffersService = OffersService;
exports.OffersService = OffersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OffersService);
//# sourceMappingURL=offers.service.js.map