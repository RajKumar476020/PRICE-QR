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
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        businessId: string;
        sortOrder: number;
        isActive: boolean;
    })[]>;
    createCategory(businessId: string, userId: string, dto: CreateCategoryDto): Promise<{
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        businessId: string;
        sortOrder: number;
        isActive: boolean;
    }>;
    reorderCategories(businessId: string, userId: string, dto: ReorderCategoriesDto): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        businessId: string;
        sortOrder: number;
        isActive: boolean;
    })[]>;
    updateCategory(businessId: string, id: string, userId: string, dto: UpdateCategoryDto): Promise<{
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        businessId: string;
        sortOrder: number;
        isActive: boolean;
    }>;
    deleteCategory(businessId: string, id: string, userId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        businessId: string;
        sortOrder: number;
        isActive: boolean;
    }>;
    getProducts(businessId: string, userId: string, categoryId?: string): Promise<({
        category: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        businessId: string;
        sortOrder: number;
        price: number;
        discountPrice: number | null;
        imageUrl: string | null;
        isAvailable: boolean;
        isFeatured: boolean;
        dietaryType: string | null;
        categoryId: string;
    })[]>;
    createProduct(businessId: string, userId: string, dto: CreateProductDto): Promise<{
        category: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        businessId: string;
        sortOrder: number;
        price: number;
        discountPrice: number | null;
        imageUrl: string | null;
        isAvailable: boolean;
        isFeatured: boolean;
        dietaryType: string | null;
        categoryId: string;
    }>;
    updateProduct(businessId: string, id: string, userId: string, dto: UpdateProductDto): Promise<{
        category: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        businessId: string;
        sortOrder: number;
        price: number;
        discountPrice: number | null;
        imageUrl: string | null;
        isAvailable: boolean;
        isFeatured: boolean;
        dietaryType: string | null;
        categoryId: string;
    }>;
    duplicateProduct(businessId: string, id: string, userId: string): Promise<{
        category: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        businessId: string;
        sortOrder: number;
        price: number;
        discountPrice: number | null;
        imageUrl: string | null;
        isAvailable: boolean;
        isFeatured: boolean;
        dietaryType: string | null;
        categoryId: string;
    }>;
    toggleAvailability(businessId: string, id: string, userId: string): Promise<{
        category: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        businessId: string;
        sortOrder: number;
        price: number;
        discountPrice: number | null;
        imageUrl: string | null;
        isAvailable: boolean;
        isFeatured: boolean;
        dietaryType: string | null;
        categoryId: string;
    }>;
    deleteProduct(businessId: string, id: string, userId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        businessId: string;
        sortOrder: number;
        price: number;
        discountPrice: number | null;
        imageUrl: string | null;
        isAvailable: boolean;
        isFeatured: boolean;
        dietaryType: string | null;
        categoryId: string;
    }>;
    getFullMenu(businessId: string, userId: string): Promise<({
        products: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            businessId: string;
            sortOrder: number;
            price: number;
            discountPrice: number | null;
            imageUrl: string | null;
            isAvailable: boolean;
            isFeatured: boolean;
            dietaryType: string | null;
            categoryId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        businessId: string;
        sortOrder: number;
        isActive: boolean;
    })[]>;
}
