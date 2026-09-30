"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const express = require("express");
const path = require("path");
const fs = require("fs");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const uploadDir = path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    app.use('/uploads', express.static(uploadDir));
    app.use('/api/uploads', express.static(uploadDir));
    app.setGlobalPrefix('api');
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get('/api/health', (req, res) => {
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    app.enableCors({
        origin: true,
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
    }));
    const port = process.env.PORT || 4000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 PriceQR Backend API is running on: http://0.0.0.0:${port}/api`);
    console.log(`📁 Static uploads served from: ${uploadDir}`);
}
bootstrap();
//# sourceMappingURL=main.js.map