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
exports.PublicService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PublicService = class PublicService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPublicBusiness(publicId) {
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
            throw new common_1.NotFoundException('Business profile not found.');
        }
        if (business.status === 'SUSPENDED') {
            throw new common_1.ForbiddenException('This business profile is currently suspended. Please contact support.');
        }
        const now = new Date();
        const currentDayOfWeek = now.getDay();
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
            }
            else if (currentMinutes < openMinutes) {
                statusText = `Closed · Opens at ${this.formatTime(todayHours.openTime)}`;
            }
            else {
                statusText = 'Closed for the day';
            }
        }
        else {
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
    async getPublicMenu(publicId, search, categoryId) {
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
            throw new common_1.NotFoundException('Business not found.');
        }
        if (business.status === 'SUSPENDED') {
            throw new common_1.ForbiddenException('This business profile is currently suspended.');
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
        const filteredCategories = categories.filter((c) => !search || c.products.length > 0);
        return {
            currency: business.currency,
            categories: filteredCategories,
        };
    }
    formatTime(time24) {
        const [hStr, mStr] = time24.split(':');
        let h = parseInt(hStr, 10);
        const m = mStr || '00';
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12;
        return `${h}:${m} ${ampm}`;
    }
};
exports.PublicService = PublicService;
exports.PublicService = PublicService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicService);
//# sourceMappingURL=public.service.js.map