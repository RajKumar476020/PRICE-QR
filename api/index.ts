import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from '../server/src/app.module';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let app: express.Express;
let isInitialized = false;

async function createApp(): Promise<express.Express> {
  if (isInitialized && app) {
    return app;
  }

  app = express();
  const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(app));

  nestApp.setGlobalPrefix('api');

  // Health check
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  nestApp.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  nestApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  await nestApp.init();
  isInitialized = true;
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const server = await createApp();
  server(req as any, res as any);
}
