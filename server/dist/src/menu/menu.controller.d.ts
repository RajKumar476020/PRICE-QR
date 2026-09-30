import { MenuService } from './menu.service';
import { CreateCategoryDto, UpdateCategoryDto, ReorderCategoriesDto, CreateProductDto, UpdateProductDto } from './dto/menu.dto';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    getCategories(businessId: string, userId: string): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        businessId: string;
        name: string;
        description: string | null;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    createCategory(businessId: string, userId: string, dto: CreateCategoryDto): Promise<{
        _count: {
            products: number;
        };
    } & {
        id: string;
        businessId: string;
        name: string;
        description: string | null;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    reorderCategories(businessId: string, userId: string, dto: ReorderCategoriesDto): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        businessId: string;
        name: string;
        description: string | null;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    updateCategory(businessId: string, id: string, userId: string, dto: UpdateCategoryDto): Promise<{
        _count: {
            products: number;
        };
    } & {
        id: string;
        businessId: string;
        name: string;
        description: string | null;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteCategory(businessId: string, id: string, userId: string): Promise<{
        id: string;
        businessId: string;
        name: string;
        description: string | null;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProducts(businessId: string, userId: string, categoryId?: string): Promise<({
        category: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        businessId: string;
        name: string;
        description: string | null;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        price: number;
        discountPrice: number | null;
        imageUrl: string | null;
        isAvailable: boolean;
        isFeatured: boolean;
        dietaryType: string | null;
    })[]>;
    createProduct(businessId: string, userId: string, dto: CreateProductDto): Promise<{
        category: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        businessId: string;
        name: string;
        description: string | null;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        price: number;
        discountPrice: number | null;
        imageUrl: string | null;
        isAvailable: boolean;
        isFeatured: boolean;
        dietaryType: string | null;
    }>;
    updateProduct(businessId: string, id: string, userId: string, dto: UpdateProductDto): Promise<{
        category: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        businessId: string;
        name: string;
        description: string | null;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        price: number;
        discountPrice: number | null;
        imageUrl: string | null;
        isAvailable: boolean;
        isFeatured: boolean;
        dietaryType: string | null;
    }>;
    duplicateProduct(businessId: string, id: string, userId: string): Promise<{
        category: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        businessId: string;
        name: string;
        description: string | null;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        price: number;
        discountPrice: number | null;
        imageUrl: string | null;
        isAvailable: boolean;
        isFeatured: boolean;
        dietaryType: string | null;
    }>;
    toggleAvailability(businessId: string, id: string, userId: string): Promise<{
        category: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        businessId: string;
        name: string;
        description: string | null;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        price: number;
        discountPrice: number | null;
        imageUrl: string | null;
        isAvailable: boolean;
        isFeatured: boolean;
        dietaryType: string | null;
    }>;
    deleteProduct(businessId: string, id: string, userId: string): Promise<{
        id: string;
        businessId: string;
        name: string;
        description: string | null;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        price: number;
        discountPrice: number | null;
        imageUrl: string | null;
        isAvailable: boolean;
        isFeatured: boolean;
        dietaryType: string | null;
    }>;
    getFullMenu(businessId: string, userId: string): Promise<({
        products: {
            id: string;
            businessId: string;
            name: string;
            description: string | null;
            sortOrder: number;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string;
            price: number;
            discountPrice: number | null;
            imageUrl: string | null;
            isAvailable: boolean;
            isFeatured: boolean;
            dietaryType: string | null;
        }[];
    } & {
        id: string;
        businessId: string;
        name: string;
        description: string | null;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
