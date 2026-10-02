import { AnalyticsService } from './analytics.service';
import { Request } from 'express';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    track(body: any, req: Request): Promise<{
        success: boolean;
        eventId: string;
    }>;
    getBusinessAnalytics(businessId: string, userId: string, period?: 'today' | '7d' | '30d'): Promise<{
        period: "7d" | "today" | "30d";
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
