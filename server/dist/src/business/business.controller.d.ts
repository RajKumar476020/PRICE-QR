import { BusinessService } from './business.service';
import { CreateBusinessDto, UpdateBusinessDto, BusinessHourItemDto } from './dto/business.dto';
export declare class BusinessController {
    private readonly businessService;
    constructor(businessService: BusinessService);
    create(userId: string, dto: CreateBusinessDto): Promise<{
        hours: {
            id: string;
            dayOfWeek: number;
            dayName: string;
            openTime: string;
            closeTime: string;
            isClosed: boolean;
            businessId: string;
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
            status: string;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            planName: string;
            expiresAt: Date | null;
            features: string;
        };
    } & {
        id: string;
        publicId: string;
        name: string;
        category: string;
        tagline: string | null;
        description: string | null;
        logoUrl: string | null;
        coverUrl: string | null;
        phone: string | null;
        whatsapp: string | null;
        email: string | null;
        website: string | null;
        address: string | null;
        city: string | null;
        googleMapsUrl: string | null;
        instagram: string | null;
        facebook: string | null;
        currency: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    getMyBusinesses(userId: string): Promise<({
        hours: {
            id: string;
            dayOfWeek: number;
            dayName: string;
            openTime: string;
            closeTime: string;
            isClosed: boolean;
            businessId: string;
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
            status: string;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            planName: string;
            expiresAt: Date | null;
            features: string;
        };
        _count: {
            categories: number;
            products: number;
            offers: number;
        };
    } & {
        id: string;
        publicId: string;
        name: string;
        category: string;
        tagline: string | null;
        description: string | null;
        logoUrl: string | null;
        coverUrl: string | null;
        phone: string | null;
        whatsapp: string | null;
        email: string | null;
        website: string | null;
        address: string | null;
        city: string | null;
        googleMapsUrl: string | null;
        instagram: string | null;
        facebook: string | null;
        currency: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    })[]>;
    getById(userId: string, id: string): Promise<{
        hours: {
            id: string;
            dayOfWeek: number;
            dayName: string;
            openTime: string;
            closeTime: string;
            isClosed: boolean;
            businessId: string;
        }[];
        categories: ({
            _count: {
                products: number;
            };
        } & {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
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
            status: string;
            createdAt: Date;
            updatedAt: Date;
            businessId: string;
            planName: string;
            expiresAt: Date | null;
            features: string;
        };
        _count: {
            products: number;
            offers: number;
            analyticsEvents: number;
        };
    } & {
        id: string;
        publicId: string;
        name: string;
        category: string;
        tagline: string | null;
        description: string | null;
        logoUrl: string | null;
        coverUrl: string | null;
        phone: string | null;
        whatsapp: string | null;
        email: string | null;
        website: string | null;
        address: string | null;
        city: string | null;
        googleMapsUrl: string | null;
        instagram: string | null;
        facebook: string | null;
        currency: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    update(userId: string, id: string, dto: UpdateBusinessDto): Promise<{
        hours: {
            id: string;
            dayOfWeek: number;
            dayName: string;
            openTime: string;
            closeTime: string;
            isClosed: boolean;
            businessId: string;
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
        publicId: string;
        name: string;
        category: string;
        tagline: string | null;
        description: string | null;
        logoUrl: string | null;
        coverUrl: string | null;
        phone: string | null;
        whatsapp: string | null;
        email: string | null;
        website: string | null;
        address: string | null;
        city: string | null;
        googleMapsUrl: string | null;
        instagram: string | null;
        facebook: string | null;
        currency: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    updateHours(userId: string, id: string, hours: BusinessHourItemDto[]): Promise<{
        id: string;
        dayOfWeek: number;
        dayName: string;
        openTime: string;
        closeTime: string;
        isClosed: boolean;
        businessId: string;
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
