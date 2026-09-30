import { Controller, Get, Put, Post, Body, Param, UseGuards } from '@nestjs/common';
import { QrService } from './qr.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('business/:businessId/qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}

  @Get()
  async getQrData(
    @Param('businessId') businessId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.qrService.getQrData(businessId, userId);
  }

  @Put()
  async updateQrStyle(
    @Param('businessId') businessId: string,
    @CurrentUser('id') userId: string,
    @Body('qrStyle') qrStyle: any,
  ) {
    return this.qrService.updateQrStyle(businessId, userId, qrStyle);
  }

  @Post('download')
  async recordDownload(
    @Param('businessId') businessId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.qrService.recordDownload(businessId, userId);
  }
}
