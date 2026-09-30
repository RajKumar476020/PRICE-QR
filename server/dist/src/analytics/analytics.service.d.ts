import { PrismaService } from '../prisma/prisma.service';
export interface TrackEventDto {
    businessId: string;
    eventType: 'QR_SCAN' | 'PAGE_VIEW' | 'PRODUCT_VIEW' | 'CATEGORY_CLICK' | 'OFFER_VIEW' | 'CONTACT_CLICK';
    metadata?: any;
    ip?: string;
    userAgent?: string;
}
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    trackEvent(dto: TrackEventDto): Promise<{
        success: boolean;
        eventId: string;
    }>;
    getAnalytics(businessId: string, userId: string, period?: 'today' | '7d' | '30d'): Promise<{
        period: "today" | "7d" | "30d";
        summary: {
            totalScans: number;
            totalAllTimeScans: number;
            totalViews: number;
            totalAllTimeViews: number;
            productViews: number;
            contactClicks: number;
            offerViews: number;
            uniqueVisitorsEstimate: number;
            conversionRate: number;
        };
        timeline: {
            time: string;
            scans: number;
            views: number;
        }[];
        topProducts: {
            viewCount: number;
            id: string;
            name: string;
            category: {
                name: string;
            };
            price: number;
            imageUrl: string;
        }[];
    }>;
}
