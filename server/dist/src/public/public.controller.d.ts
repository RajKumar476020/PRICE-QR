import { PublicService } from './public.service';
export declare class PublicController {
    private readonly publicService;
    constructor(publicService: PublicService);
    getPublicBusiness(publicId: string): Promise<{
        id: string;
        publicId: string;
        name: string;
        category: string;
        tagline: string;
        description: string;
        phone: string;
        whatsapp: string;
        email: string;
        website: string;
        address: string;
        city: string;
        googleMapsUrl: string;
        instagram: string;
        facebook: string;
        logoUrl: string;
        coverUrl: string;
        currency: string;
        status: string;
        isOpen: boolean;
        statusText: string;
        hours: {
            id: string;
            dayOfWeek: number;
            businessId: string;
            dayName: string;
            openTime: string;
            closeTime: string;
            isClosed: boolean;
        }[];
        activeOffers: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            title: string;
            discountType: string;
            discountAmount: number | null;
            promoCode: string | null;
            imageUrl: string | null;
            startDate: Date;
            endDate: Date;
            isActive: boolean;
        }[];
    }>;
    getPublicMenu(publicId: string, search?: string, categoryId?: string): Promise<{
        currency: string;
        categories: ({
            products: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
                imageUrl: string | null;
                sortOrder: number;
                categoryId: string;
                isFeatured: boolean;
                price: number;
                discountPrice: number | null;
                isAvailable: boolean;
                dietaryType: string | null;
            }[];
        } & {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            isActive: boolean;
            sortOrder: number;
        })[];
    }>;
}
