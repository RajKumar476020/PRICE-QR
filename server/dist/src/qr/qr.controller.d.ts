import { QrService } from './qr.service';
export declare class QrController {
    private readonly qrService;
    constructor(qrService: QrService);
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
        businessId: string;
        targetUrl: string;
        qrStyle: string | null;
        downloadCount: number;
        scansCount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    recordDownload(businessId: string, userId: string): Promise<{
        id: string;
        businessId: string;
        targetUrl: string;
        qrStyle: string | null;
        downloadCount: number;
        scansCount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
