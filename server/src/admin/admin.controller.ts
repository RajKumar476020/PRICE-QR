import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getPlatformStats();
  }

  @Get('businesses')
  async getBusinesses(
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getBusinesses(search, status);
  }

  @Patch('businesses/:id/status')
  async toggleStatus(
    @Param('id') id: string,
    @Body('status') status: 'ACTIVE' | 'SUSPENDED',
  ) {
    return this.adminService.toggleBusinessStatus(id, status);
  }

  @Get('users')
  async getUsers() {
    return this.adminService.getUsers();
  }
}
