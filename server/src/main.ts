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

  app.enableCors({
    origin: true, // Allow frontend during development and production
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
  await app.listen(port);
  console.log(`🚀 PriceQR Backend API is running on: http://localhost:${port}/api`);
  console.log(`📁 Static uploads served from: ${uploadDir}`);
}

bootstrap();
