import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BusinessModule } from './business/business.module';
import { MenuModule } from './menu/menu.module';
import { OffersModule } from './offers/offers.module';
import { QrModule } from './qr/qr.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PublicModule } from './public/public.module';
import { AdminModule } from './admin/admin.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BusinessModule,
    MenuModule,
    OffersModule,
    QrModule,
    AnalyticsModule,
    PublicModule,
    AdminModule,
    UploadModule,
  ],
})
export class AppModule {}
