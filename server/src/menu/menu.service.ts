import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  ReorderCategoriesDto,
  CreateProductDto,
  UpdateProductDto,
} from './dto/menu.dto';

@Injectable()
export class MenuService {
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
      const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
      if (user?.role !== 'ADMIN') {
        throw new ForbiddenException('Access denied. You do not own this business.');
      }
    }
    return business;
  }

  // --- Category Methods ---

  async getCategories(businessId: string, userId: string) {
    await this.verifyBusinessOwnership(businessId, userId);
    return this.prisma.category.findMany({
      where: { businessId },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    });
  }

  async createCategory(businessId: string, userId: string, dto: CreateCategoryDto) {
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

  async updateCategory(
    businessId: string,
    categoryId: string,
    userId: string,
    dto: UpdateCategoryDto,
  ) {
    await this.verifyBusinessOwnership(businessId, userId);

    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, businessId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
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

  async deleteCategory(businessId: string, categoryId: string, userId: string) {
    await this.verifyBusinessOwnership(businessId, userId);

    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, businessId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Cascade delete products in this category
    await this.prisma.product.deleteMany({
      where: { categoryId },
    });

    return this.prisma.category.delete({
      where: { id: categoryId },
    });
  }

  async reorderCategories(businessId: string, userId: string, dto: ReorderCategoriesDto) {
    await this.verifyBusinessOwnership(businessId, userId);

    const updates = dto.categoryIds.map((id, index) =>
      this.prisma.category.updateMany({
        where: { id, businessId },
        data: { sortOrder: index },
      }),
    );

    await this.prisma.$transaction(updates);

    return this.getCategories(businessId, userId);
  }

  // --- Product Methods ---

  async getProducts(businessId: string, userId: string, categoryId?: string) {
    await this.verifyBusinessOwnership(businessId, userId);

    const where: any = { businessId };
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

  async createProduct(businessId: string, userId: string, dto: CreateProductDto) {
    await this.verifyBusinessOwnership(businessId, userId);

    // Validate category exists for this business
    const category = await this.prisma.category.findFirst({
      where: { id: dto.categoryId, businessId },
    });
    if (!category) {
      throw new BadRequestException('Selected category does not exist for this business.');
    }

    if (dto.discountPrice !== undefined && dto.discountPrice !== null) {
      if (dto.discountPrice > dto.price) {
        throw new BadRequestException('Discount price cannot exceed the original price.');
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

  async updateProduct(
    businessId: string,
    productId: string,
    userId: string,
    dto: UpdateProductDto,
  ) {
    await this.verifyBusinessOwnership(businessId, userId);

    const product = await this.prisma.product.findFirst({
      where: { id: productId, businessId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const effectivePrice = dto.price !== undefined ? dto.price : product.price;
    const effectiveDiscount =
      dto.discountPrice !== undefined ? dto.discountPrice : product.discountPrice;

    if (effectiveDiscount !== null && effectiveDiscount !== undefined && effectiveDiscount > effectivePrice) {
      throw new BadRequestException('Discount price cannot exceed original price.');
    }

    if (dto.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: dto.categoryId, businessId },
      });
      if (!category) {
        throw new BadRequestException('Target category does not exist for this business.');
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

  async duplicateProduct(businessId: string, productId: string, userId: string) {
    await this.verifyBusinessOwnership(businessId, userId);

    const product = await this.prisma.product.findFirst({
      where: { id: productId, businessId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
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

  async toggleAvailability(businessId: string, productId: string, userId: string) {
    await this.verifyBusinessOwnership(businessId, userId);

    const product = await this.prisma.product.findFirst({
      where: { id: productId, businessId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: { isAvailable: !product.isAvailable },
      include: {
        category: { select: { id: true, name: true } },
      },
    });
  }

  async deleteProduct(businessId: string, productId: string, userId: string) {
    await this.verifyBusinessOwnership(businessId, userId);

    const product = await this.prisma.product.findFirst({
      where: { id: productId, businessId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.product.delete({
      where: { id: productId },
    });
  }

  // Get complete menu tree for owner review
  async getFullMenu(businessId: string, userId: string) {
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
}
