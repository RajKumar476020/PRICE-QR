import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      // Use memory storage so the buffer is available for Vercel Blob upload.
      // For local dev fallback, the buffer is also available.
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (_req, file, cb) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/gif',
          'image/svg+xml',
          'image/avif',
        ];
        if (allowedTypes.includes(file.mimetype.toLowerCase())) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              `Invalid file type "${file.mimetype}". Only images (JPG, PNG, WEBP, GIF, SVG, AVIF) are allowed.`,
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.processUploadedFile(file);
  }
}
