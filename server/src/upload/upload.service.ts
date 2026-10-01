import { Injectable, BadRequestException } from '@nestjs/common';
import { put } from '@vercel/blob';

@Injectable()
export class UploadService {
  async processUploadedFile(file: Express.Multer.File): Promise<{
    url: string;
    filename: string;
    originalName: string;
    size: number;
    mimetype: string;
  }> {
    if (!file) {
      throw new BadRequestException('No file provided for upload.');
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;

    // In development (no Blob token), fall back to returning a local URL
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

    // Upload to Vercel Blob Storage
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
    const blobFilename = `uploads/img-${uniqueSuffix}.${ext}`;

    const blob = await put(blobFilename, file.buffer, {
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
}
