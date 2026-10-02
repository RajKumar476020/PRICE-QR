import { PrismaService } from '../prisma/prisma.service';
export declare class PublicService {
    private prisma;
    constructor(prisma: PrismaService);
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
            businessId: string;
            dayOfWeek: number;
            dayName: string;
            openTime: string;
            closeTime: string;
            isClosed: boolean;
        }[];
        activeOffers: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            businessId: string;
            isActive: boolean;
            imageUrl: string | null;
            title: string;
            discountType: string;
            discountAmount: number | null;
            promoCode: string | null;
            startDate: Date;
            endDate: Date;
        }[];
    }>;
    getPublicMenu(publicId: string, search?: string, categoryId?: string): Promise<{
        currency: string;
        categories: ({
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
        })[];
    }>;
    private formatTime;
}
