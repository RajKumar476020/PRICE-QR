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
exports.QrService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QrService = class QrService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async verifyBusinessOwnership(businessId, userId) {
        const business = await this.prisma.business.findUnique({
            where: { id: businessId },
            select: { id: true, ownerId: true, publicId: true, name: true, logoUrl: true },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        if (business.ownerId !== userId) {
            throw new common_1.ForbiddenException('Access denied. You do not own this business.');
        }
        return business;
    }
    async getQrData(businessId, userId) {
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
    async updateQrStyle(businessId, userId, qrStyle) {
        await this.verifyBusinessOwnership(businessId, userId);
        const styleStr = typeof qrStyle === 'string' ? qrStyle : JSON.stringify(qrStyle);
        return this.prisma.qRCode.update({
            where: { businessId },
            data: { qrStyle: styleStr },
        });
    }
    async recordDownload(businessId, userId) {
        await this.verifyBusinessOwnership(businessId, userId);
        return this.prisma.qRCode.update({
            where: { businessId },
            data: {
                downloadCount: { increment: 1 },
            },
        });
    }
};
exports.QrService = QrService;
exports.QrService = QrService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QrService);
//# sourceMappingURL=qr.service.js.map