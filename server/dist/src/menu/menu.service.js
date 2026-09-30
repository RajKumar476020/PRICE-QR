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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MenuService = class MenuService {
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
            const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
            if (user?.role !== 'ADMIN') {
                throw new common_1.ForbiddenException('Access denied. You do not own this business.');
            }
        }
        return business;
    }
    async getCategories(businessId, userId) {
        await this.verifyBusinessOwnership(businessId, userId);
        return this.prisma.category.findMany({
            where: { businessId },
            orderBy: { sortOrder: 'asc' },
            include: {
                _count: { select: { products: true } },
            },
        });
    }
    async createCategory(businessId, userId, dto) {
        await this.verifyBusinessOwnership(businessId, userId);
        const highestSort = await this.prisma.category.findFirst({
            where: { businessId },
            orderBy: { sortOrder: 'desc' },
            select: { sortOrder: true },
        });
        const sortOrder = dto.sortOrder !== undefined ? dto.sortOrder : (highestSort?.sortOrder ?? -1) + 1;
        return this.prisma.category.create({
            data: {
                name: dto.name.trim(),
                description: dto.description?.trim() || null,
                sortOrder,
                isActive: dto.isActive !== undefined ? dto.isActive : true,
                businessId,
            },
            include: {
                _count: { select: { products: true } },
            },
        });
    }
    async updateCategory(businessId, categoryId, userId, dto) {
        await this.verifyBusinessOwnership(businessId, userId);
        const category = await this.prisma.category.findFirst({
            where: { id: categoryId, businessId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return this.prisma.category.update({
            where: { id: categoryId },
            data: {
                name: dto.name !== undefined ? dto.name.trim() : undefined,
                description: dto.description !== undefined ? dto.description?.trim() || null : undefined,
                sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : undefined,
                isActive: dto.isActive !== undefined ? dto.isActive : undefined,
            },
            include: {
                _count: { select: { products: true } },
            },
        });
    }
    async deleteCategory(businessId, categoryId, userId) {
        await this.verifyBusinessOwnership(businessId, userId);
        const category = await this.prisma.category.findFirst({
            where: { id: categoryId, businessId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        await this.prisma.product.deleteMany({
            where: { categoryId },
        });
        return this.prisma.category.delete({
            where: { id: categoryId },
        });
    }
    async reorderCategories(businessId, userId, dto) {
        await this.verifyBusinessOwnership(businessId, userId);
        const updates = dto.categoryIds.map((id, index) => this.prisma.category.updateMany({
            where: { id, businessId },
            data: { sortOrder: index },
        }));
        await this.prisma.$transaction(updates);
        return this.getCategories(businessId, userId);
    }
    async getProducts(businessId, userId, categoryId) {
        await this.verifyBusinessOwnership(businessId, userId);
        const where = { businessId };
        if (categoryId) {
            where.categoryId = categoryId;
        }
        return this.prisma.product.findMany({
            where,
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
            include: {
                category: { select: { id: true, name: true } },
            },
        });
    }
    async createProduct(businessId, userId, dto) {
        await this.verifyBusinessOwnership(businessId, userId);
        const category = await this.prisma.category.findFirst({
            where: { id: dto.categoryId, businessId },
        });
        if (!category) {
            throw new common_1.BadRequestException('Selected category does not exist for this business.');
        }
        if (dto.discountPrice !== undefined && dto.discountPrice !== null) {
            if (dto.discountPrice > dto.price) {
                throw new common_1.BadRequestException('Discount price cannot exceed the original price.');
            }
        }
        const highestSort = await this.prisma.product.findFirst({
            where: { businessId, categoryId: dto.categoryId },
            orderBy: { sortOrder: 'desc' },
            select: { sortOrder: true },
        });
        const sortOrder = dto.sortOrder !== undefined ? dto.sortOrder : (highestSort?.sortOrder ?? -1) + 1;
        return this.prisma.product.create({
            data: {
                name: dto.name.trim(),
                description: dto.description?.trim() || null,
                price: dto.price,
                discountPrice: dto.discountPrice !== undefined ? dto.discountPrice : null,
                imageUrl: dto.imageUrl || null,
                isAvailable: dto.isAvailable !== undefined ? dto.isAvailable : true,
                isFeatured: dto.isFeatured !== undefined ? dto.isFeatured : false,
                dietaryType: dto.dietaryType || 'NONE',
                sortOrder,
                businessId,
                categoryId: dto.categoryId,
            },
            include: {
                category: { select: { id: true, name: true } },
            },
        });
    }
    async updateProduct(businessId, productId, userId, dto) {
        await this.verifyBusinessOwnership(businessId, userId);
        const product = await this.prisma.product.findFirst({
            where: { id: productId, businessId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const effectivePrice = dto.price !== undefined ? dto.price : product.price;
        const effectiveDiscount = dto.discountPrice !== undefined ? dto.discountPrice : product.discountPrice;
        if (effectiveDiscount !== null && effectiveDiscount !== undefined && effectiveDiscount > effectivePrice) {
            throw new common_1.BadRequestException('Discount price cannot exceed original price.');
        }
        if (dto.categoryId) {
            const category = await this.prisma.category.findFirst({
                where: { id: dto.categoryId, businessId },
            });
            if (!category) {
                throw new common_1.BadRequestException('Target category does not exist for this business.');
            }
        }
        return this.prisma.product.update({
            where: { id: productId },
            data: {
                name: dto.name !== undefined ? dto.name.trim() : undefined,
                description: dto.description !== undefined ? dto.description?.trim() || null : undefined,
                price: dto.price !== undefined ? dto.price : undefined,
                discountPrice: dto.discountPrice !== undefined ? dto.discountPrice : undefined,
                imageUrl: dto.imageUrl !== undefined ? dto.imageUrl : undefined,
                isAvailable: dto.isAvailable !== undefined ? dto.isAvailable : undefined,
                isFeatured: dto.isFeatured !== undefined ? dto.isFeatured : undefined,
                dietaryType: dto.dietaryType !== undefined ? dto.dietaryType : undefined,
                categoryId: dto.categoryId !== undefined ? dto.categoryId : undefined,
                sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : undefined,
            },
            include: {
                category: { select: { id: true, name: true } },
            },
        });
    }
    async duplicateProduct(businessId, productId, userId) {
        await this.verifyBusinessOwnership(businessId, userId);
        const product = await this.prisma.product.findFirst({
            where: { id: productId, businessId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return this.prisma.product.create({
            data: {
                name: `${product.name} (Copy)`,
                description: product.description,
                price: product.price,
                discountPrice: product.discountPrice,
                imageUrl: product.imageUrl,
                isAvailable: product.isAvailable,
                isFeatured: false,
                dietaryType: product.dietaryType,
                sortOrder: product.sortOrder + 1,
                businessId,
                categoryId: product.categoryId,
            },
            include: {
                category: { select: { id: true, name: true } },
            },
        });
    }
    async toggleAvailability(businessId, productId, userId) {
        await this.verifyBusinessOwnership(businessId, userId);
        const product = await this.prisma.product.findFirst({
            where: { id: productId, businessId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return this.prisma.product.update({
            where: { id: productId },
            data: { isAvailable: !product.isAvailable },
            include: {
                category: { select: { id: true, name: true } },
            },
        });
    }
    async deleteProduct(businessId, productId, userId) {
        await this.verifyBusinessOwnership(businessId, userId);
        const product = await this.prisma.product.findFirst({
            where: { id: productId, businessId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return this.prisma.product.delete({
            where: { id: productId },
        });
    }
    async getFullMenu(businessId, userId) {
        await this.verifyBusinessOwnership(businessId, userId);
        return this.prisma.category.findMany({
            where: { businessId },
            orderBy: { sortOrder: 'asc' },
            include: {
                products: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenuService);
//# sourceMappingURL=menu.service.js.map