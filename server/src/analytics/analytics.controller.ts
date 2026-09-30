import { Controller, Get, Post, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { Request } from 'express';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Public event tracking endpoint
  @Post('track')
  async track(@Body() body: any, @Req() req: Request) {
    const userAgent = req.headers['user-agent'];
    const ip = req.ip || (req.headers['x-forwarded-for'] as string);

    return this.analyticsService.trackEvent({
      businessId: body.businessId,
      eventType: body.eventType,
      metadata: body.metadata,
      ip,
      userAgent,
    });
  }

  // Owner analytics dashboard
  @UseGuards(JwtAuthGuard)
  @Get('business/:businessId')
  async getBusinessAnalytics(
    @Param('businessId') businessId: string,
    @CurrentUser('id') userId: string,
    @Query('period') period?: 'today' | '7d' | '30d',
  ) {
    return this.analyticsService.getAnalytics(businessId, userId, period);
  }
}
