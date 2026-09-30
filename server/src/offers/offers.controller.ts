import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto, UpdateOfferDto } from './dto/offers.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('business/:businessId/offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  async getOffers(
    @Param('businessId') businessId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.offersService.getOffers(businessId, userId);
  }

  @Post()
  async createOffer(
    @Param('businessId') businessId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateOfferDto,
  ) {
    return this.offersService.createOffer(businessId, userId, dto);
  }

  @Put(':id')
  async updateOffer(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateOfferDto,
  ) {
    return this.offersService.updateOffer(businessId, id, userId, dto);
  }

  @Patch(':id/toggle')
  async toggleActive(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.offersService.toggleActive(businessId, id, userId);
  }

  @Delete(':id')
  async deleteOffer(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.offersService.deleteOffer(businessId, id, userId);
  }
}
