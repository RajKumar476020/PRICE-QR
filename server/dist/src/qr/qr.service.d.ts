import { PrismaService } from '../prisma/prisma.service';
export declare class QrService {
    private prisma;
    constructor(prisma: PrismaService);
    private verifyBusinessOwnership;
    getQrData(businessId: string, userId: string): Promise<{
        id: string;
        businessId: string;
        businessPublicId: string;
        businessName: string;
        businessLogoUrl: string;
        targetUrl: string;
        qrStyle: any;
        downloadCount: number;
        scansCount: number;
        updatedAt: Date;
    }>;
    updateQrStyle(businessId: string, userId: string, qrStyle: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        targetUrl: string;
        qrStyle: string | null;
        downloadCount: number;
        scansCount: number;
    }>;
    recordDownload(businessId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        targetUrl: string;
        qrStyle: string | null;
        downloadCount: number;
        scansCount: number;
    }>;
}
