export declare class UploadService {
    private readonly uploadDir;
    constructor();
    private ensureUploadDir;
    processUploadedFile(file: Express.Multer.File): {
        url: string;
        filename: string;
        originalName: string;
        size: number;
        mimetype: string;
    };
}
