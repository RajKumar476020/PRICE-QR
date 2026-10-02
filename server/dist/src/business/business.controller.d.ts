import { BusinessService } from './business.service';
import { CreateBusinessDto, UpdateBusinessDto, BusinessHourItemDto } from './dto/business.dto';
export declare class BusinessController {
    private readonly businessService;
    constructor(businessService: BusinessService);
    create(userId: string, dto: CreateBusinessDto): Promise<{
        hours: {
            id: string;
            businessId: string;
            dayOfWeek: number;
            dayName: string;
            openTime: string;
            closeTime: string;
            isClosed: boolean;
        }[];
        qrCode: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            targetUrl: string;
            qrStyle: string | null;
            downloadCount: number;
            scansCount: number;
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
    }>;
    getMyBusinesses(userId: string): Promise<({
        hours: {
            id: string;
            businessId: string;
            dayOfWeek: number;
            dayName: string;
            openTime: string;
            closeTime: string;
            isClosed: boolean;
        }[];
        qrCode: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            targetUrl: string;
            qrStyle: string | null;
            downloadCount: number;
            scansCount: number;
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
    getById(userId: string, id: string): Promise<{
        hours: {
            id: string;
            businessId: string;
            dayOfWeek: number;
            dayName: string;
            openTime: string;
            closeTime: string;
            isClosed: boolean;
        }[];
        categories: ({
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
        })[];
        qrCode: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            targetUrl: string;
            qrStyle: string | null;
            downloadCount: number;
            scansCount: number;
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
    }>;
    update(userId: string, id: string, dto: UpdateBusinessDto): Promise<{
        hours: {
            id: string;
            businessId: string;
            dayOfWeek: number;
            dayName: string;
            openTime: string;
            closeTime: string;
            isClosed: boolean;
        }[];
        qrCode: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            targetUrl: string;
            qrStyle: string | null;
            downloadCount: number;
            scansCount: number;
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
    }>;
    updateHours(userId: string, id: string, hours: BusinessHourItemDto[]): Promise<{
        id: string;
        businessId: string;
        dayOfWeek: number;
        dayName: string;
        openTime: string;
        closeTime: string;
        isClosed: boolean;
    }[]>;
    getSummary(userId: string, id: string): Promise<{
        business: {
            id: string;
            publicId: string;
            name: string;
            category: string;
            currency: string;
            logoUrl: string;
            coverUrl: string;
            status: string;
        };
        stats: {
            totalProducts: number;
            activeOffers: number;
            todayScans: number;
            totalScans: number;
            todayViews: number;
            totalViews: number;
        };
        recentActivity: {
            id: string;
            createdAt: Date;
            businessId: string;
            eventType: string;
            metadata: string | null;
            ipHash: string | null;
            userAgent: string | null;
        }[];
    }>;
}
