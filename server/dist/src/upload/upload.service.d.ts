export declare class UploadService {
    processUploadedFile(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
        originalName: string;
        size: number;
        mimetype: string;
    }>;
}
