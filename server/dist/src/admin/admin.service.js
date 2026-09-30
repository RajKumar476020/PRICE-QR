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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPlatformStats() {
        const [totalBusinesses, activeBusinesses, suspendedBusinesses, totalUsers, totalProducts, totalEvents] = await Promise.all([
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
    async getBusinesses(search, status) {
        const where = {};
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
    async toggleBusinessStatus(id, status) {
        const business = await this.prisma.business.findUnique({
            where: { id },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map