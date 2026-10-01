"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const blob_1 = require("@vercel/blob");
let UploadService = class UploadService {
    async processUploadedFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided for upload.');
        }
        const token = process.env.BLOB_READ_WRITE_TOKEN;
        if (!token) {
            const relativeUrl = `/uploads/${file.filename ?? file.originalname}`;
            return {
                url: relativeUrl,
                filename: file.originalname,
                originalName: file.originalname,
                size: file.size,
                mimetype: file.mimetype,
            };
        }
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
        const blobFilename = `uploads/img-${uniqueSuffix}.${ext}`;
        const blob = await (0, blob_1.put)(blobFilename, file.buffer, {
            access: 'public',
            token,
            contentType: file.mimetype,
        });
        return {
            url: blob.url,
            filename: blobFilename,
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
        };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)()
], UploadService);
//# sourceMappingURL=upload.service.js.map