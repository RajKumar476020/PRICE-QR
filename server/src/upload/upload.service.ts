import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly uploadDir = path.resolve(process.cwd(), 'uploads');

  constructor() {
    this.ensureUploadDir();
  }

  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  processUploadedFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided for upload.');
    }

    // Return the relative URL that can be requested via static asset serving
    const relativeUrl = `/uploads/${file.filename}`;

    return {
      url: relativeUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
