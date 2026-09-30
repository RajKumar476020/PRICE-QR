import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('business/:publicId')
  async getPublicBusiness(@Param('publicId') publicId: string) {
    return this.publicService.getPublicBusiness(publicId);
  }

  @Get('business/:publicId/menu')
  async getPublicMenu(
    @Param('publicId') publicId: string,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.publicService.getPublicMenu(publicId, search, categoryId);
  }
}
