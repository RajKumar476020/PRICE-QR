import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto, UpdateBusinessDto, BusinessHourItemDto } from './dto/business.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateBusinessDto) {
    return this.businessService.create(userId, dto);
  }

  @Get()
  async getMyBusinesses(@CurrentUser('id') userId: string) {
    return this.businessService.findByOwner(userId);
  }

  @Get(':id')
  async getById(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.businessService.findById(id, userId);
  }

  @Put(':id')
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBusinessDto,
  ) {
    return this.businessService.update(id, userId, dto);
  }

  @Put(':id/hours')
  async updateHours(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() hours: BusinessHourItemDto[],
  ) {
    return this.businessService.updateHours(id, userId, hours);
  }

  @Get(':id/summary')
  async getSummary(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.businessService.getSummary(id, userId);
  }
}
