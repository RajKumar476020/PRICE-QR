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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async trackEvent(dto) {
        if (!dto.businessId)
            return null;
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
        if (dto.eventType === 'QR_SCAN') {
            await this.prisma.qRCode.updateMany({
                where: { businessId: business.id },
                data: { scansCount: { increment: 1 } },
            });
        }
        return { success: true, eventId: event.id };
    }
    async getAnalytics(businessId, userId, period = '7d') {
        const business = await this.prisma.business.findFirst({
            where: {
                OR: [{ id: businessId }, { publicId: businessId }],
            },
            include: {
                qrCode: true,
            },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        if (business.ownerId !== userId) {
            throw new common_1.ForbiddenException('Access denied. You do not own this business.');
        }
        const now = new Date();
        let startDate;
        if (period === 'today') {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        }
        else if (period === '30d') {
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            startDate.setHours(0, 0, 0, 0);
        }
        else {
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            startDate.setHours(0, 0, 0, 0);
        }
        const events = await this.prisma.analyticsEvent.findMany({
            where: {
                businessId: business.id,
                createdAt: { gte: startDate },
            },
            orderBy: { createdAt: 'asc' },
        });
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
        const timeline = [];
        if (period === 'today') {
            const currentHour = now.getHours();
            for (let h = 0; h <= Math.max(currentHour, 12); h++) {
                const ampm = h >= 12 ? 'PM' : 'AM';
                const displayH = h % 12 === 0 ? 12 : h % 12;
                const timeLabel = `${displayH} ${ampm}`;
                const scansInHour = events.filter((e) => e.eventType === 'QR_SCAN' && new Date(e.createdAt).getHours() === h).length;
                const viewsInHour = events.filter((e) => e.eventType === 'PAGE_VIEW' && new Date(e.createdAt).getHours() === h).length;
                timeline.push({
                    time: timeLabel,
                    scans: scansInHour,
                    views: viewsInHour,
                });
            }
        }
        else {
            const numDays = period === '30d' ? 30 : 7;
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            for (let i = numDays - 1; i >= 0; i--) {
                const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                const y = d.getFullYear();
                const m = d.getMonth();
                const dayNum = d.getDate();
                const dayStart = new Date(y, m, dayNum, 0, 0, 0, 0);
                const dayEnd = new Date(y, m, dayNum, 23, 59, 59, 999);
                const timeLabel = period === '7d'
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
        const productCounts = {};
        for (const e of events) {
            if (e.eventType === 'PRODUCT_VIEW' && e.metadata) {
                try {
                    const parsed = JSON.parse(e.metadata);
                    if (parsed.productId) {
                        productCounts[parsed.productId] = (productCounts[parsed.productId] || 0) + 1;
                    }
                }
                catch { }
            }
        }
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
        const totalScansCumulative = Math.max(allTimeScansCount + (business.qrCode?.scansCount || 0), periodScans);
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
                conversionRate: periodViews > 0 ? Math.min(100, Math.round(((productViews + contactClicks) / periodViews) * 100)) : 0,
            },
            timeline,
            topProducts: enrichedProducts.slice(0, 8),
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map