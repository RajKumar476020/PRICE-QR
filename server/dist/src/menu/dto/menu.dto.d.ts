export declare class CreateCategoryDto {
    name: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
}
export declare class UpdateCategoryDto {
    name?: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
}
export declare class ReorderCategoriesDto {
    categoryIds: string[];
}
export declare class CreateProductDto {
    name: string;
    description?: string;
    categoryId: string;
    price: number;
    discountPrice?: number;
    imageUrl?: string;
    isAvailable?: boolean;
    isFeatured?: boolean;
    dietaryType?: string;
    sortOrder?: number;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    categoryId?: string;
    price?: number;
    discountPrice?: number;
    imageUrl?: string;
    isAvailable?: boolean;
    isFeatured?: boolean;
    dietaryType?: string;
    sortOrder?: number;
}
