import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getPlatformStats(): Promise<{
        totalBusinesses: number;
        activeBusinesses: number;
        suspendedBusinesses: number;
        totalUsers: number;
        totalProducts: number;
        totalEvents: number;
        qrScans: number;
        pageViews: number;
    }>;
    getBusinesses(search?: string, status?: string): Promise<({
        owner: {
            id: string;
            email: string;
            name: string;
        };
        subscription: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            planName: string;
            expiresAt: Date | null;
            features: string;
            businessId: string;
        };
        _count: {
            categories: number;
            products: number;
            offers: number;
            analyticsEvents: number;
        };
    } & {
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        publicId: string;
        category: string;
        tagline: string | null;
        description: string | null;
        logoUrl: string | null;
        coverUrl: string | null;
        phone: string | null;
        whatsapp: string | null;
        website: string | null;
        address: string | null;
        city: string | null;
        googleMapsUrl: string | null;
        instagram: string | null;
        facebook: string | null;
        currency: string;
        status: string;
        ownerId: string;
    })[]>;
    toggleBusinessStatus(id: string, status: string): Promise<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        publicId: string;
        category: string;
        tagline: string | null;
        description: string | null;
        logoUrl: string | null;
        coverUrl: string | null;
        phone: string | null;
        whatsapp: string | null;
        website: string | null;
        address: string | null;
        city: string | null;
        googleMapsUrl: string | null;
        instagram: string | null;
        facebook: string | null;
        currency: string;
        status: string;
        ownerId: string;
    }>;
    getUsers(): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
        createdAt: Date;
        _count: {
            businesses: number;
        };
    }[]>;
}
