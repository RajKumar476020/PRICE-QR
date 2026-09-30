import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ensure uploads directory exists and is served statically
  const uploadDir = path.resolve(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Serve static assets for uploaded files
  app.use('/uploads', express.static(uploadDir));
  app.use('/api/uploads', express.static(uploadDir));

  app.setGlobalPrefix('api');

  // Health check endpoint for Railway
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/api/health', (req: any, res: any) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 PriceQR Backend API is running on: http://0.0.0.0:${port}/api`);
  console.log(`📁 Static uploads served from: ${uploadDir}`);
}

bootstrap();
