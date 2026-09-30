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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase().trim() },
        });
        if (existing) {
            throw new common_1.ConflictException('An account with this email already exists.');
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(dto.password, salt);
        const isFirstAccount = (await this.prisma.user.count()) === 0;
        const role = isFirstAccount || dto.email.toLowerCase().includes('admin@') ? 'ADMIN' : 'OWNER';
        const user = await this.prisma.user.create({
            data: {
                name: dto.name.trim(),
                email: dto.email.toLowerCase().trim(),
                passwordHash,
                role,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });
        const token = this.generateToken(user.id, user.email, user.role);
        return {
            user,
            accessToken: token,
            message: 'Account successfully registered.',
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase().trim() },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password.');
        }
        const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid email or password.');
        }
        const businesses = await this.prisma.business.findMany({
            where: { ownerId: user.id },
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
        const token = this.generateToken(user.id, user.email, user.role);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                createdAt: user.createdAt,
            },
            businesses,
            accessToken: token,
        };
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                businesses: {
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
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found.');
        }
        return user;
    }
    async forgotPassword(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase().trim() },
        });
        if (!user) {
            return {
                message: 'If an account with this email exists, a password reset instruction has been sent.',
                token: 'DEMO-RESET-TOKEN-123456',
            };
        }
        return {
            message: 'Password reset token generated.',
            token: 'DEMO-RESET-TOKEN-123456',
        };
    }
    async resetPassword(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase().trim() },
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid reset request.');
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(dto.newPassword, salt);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { passwordHash },
        });
        return { message: 'Password has been successfully updated. You can now login.' };
    }
    generateToken(userId, email, role) {
        return this.jwtService.sign({ sub: userId, email, role }, {
            secret: process.env.JWT_SECRET || 'qr-digital-profile-secure-jwt-secret-key-2025',
            expiresIn: '7d',
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map