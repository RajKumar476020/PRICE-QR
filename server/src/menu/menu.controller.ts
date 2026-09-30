import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  ReorderCategoriesDto,
  CreateProductDto,
  UpdateProductDto,
} from './dto/menu.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('business/:businessId')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // --- Categories ---

  @Get('categories')
  async getCategories(
    @Param('businessId') businessId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.menuService.getCategories(businessId, userId);
  }

  @Post('categories')
  async createCategory(
    @Param('businessId') businessId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.menuService.createCategory(businessId, userId, dto);
  }

  @Put('categories/reorder')
  async reorderCategories(
    @Param('businessId') businessId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ReorderCategoriesDto,
  ) {
    return this.menuService.reorderCategories(businessId, userId, dto);
  }

  @Put('categories/:id')
  async updateCategory(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.menuService.updateCategory(businessId, id, userId, dto);
  }

  @Delete('categories/:id')
  async deleteCategory(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.menuService.deleteCategory(businessId, id, userId);
  }

  // --- Products ---

  @Get('products')
  async getProducts(
    @Param('businessId') businessId: string,
    @CurrentUser('id') userId: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.menuService.getProducts(businessId, userId, categoryId);
  }

  @Post('products')
  async createProduct(
    @Param('businessId') businessId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateProductDto,
  ) {
    return this.menuService.createProduct(businessId, userId, dto);
  }

  @Put('products/:id')
  async updateProduct(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.menuService.updateProduct(businessId, id, userId, dto);
  }

  @Post('products/:id/duplicate')
  async duplicateProduct(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.menuService.duplicateProduct(businessId, id, userId);
  }

  @Patch('products/:id/toggle-availability')
  async toggleAvailability(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.menuService.toggleAvailability(businessId, id, userId);
  }

  @Delete('products/:id')
  async deleteProduct(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.menuService.deleteProduct(businessId, id, userId);
  }

  @Get('menu')
  async getFullMenu(
    @Param('businessId') businessId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.menuService.getFullMenu(businessId, userId);
  }
}
