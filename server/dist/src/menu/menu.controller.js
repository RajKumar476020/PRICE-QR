"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuController = void 0;
const common_1 = require("@nestjs/common");
const menu_service_1 = require("./menu.service");
const menu_dto_1 = require("./dto/menu.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let MenuController = class MenuController {
    constructor(menuService) {
        this.menuService = menuService;
    }
    async getCategories(businessId, userId) {
        return this.menuService.getCategories(businessId, userId);
    }
    async createCategory(businessId, userId, dto) {
        return this.menuService.createCategory(businessId, userId, dto);
    }
    async reorderCategories(businessId, userId, dto) {
        return this.menuService.reorderCategories(businessId, userId, dto);
    }
    async updateCategory(businessId, id, userId, dto) {
        return this.menuService.updateCategory(businessId, id, userId, dto);
    }
    async deleteCategory(businessId, id, userId) {
        return this.menuService.deleteCategory(businessId, id, userId);
    }
    async getProducts(businessId, userId, categoryId) {
        return this.menuService.getProducts(businessId, userId, categoryId);
    }
    async createProduct(businessId, userId, dto) {
        return this.menuService.createProduct(businessId, userId, dto);
    }
    async updateProduct(businessId, id, userId, dto) {
        return this.menuService.updateProduct(businessId, id, userId, dto);
    }
    async duplicateProduct(businessId, id, userId) {
        return this.menuService.duplicateProduct(businessId, id, userId);
    }
    async toggleAvailability(businessId, id, userId) {
        return this.menuService.toggleAvailability(businessId, id, userId);
    }
    async deleteProduct(businessId, id, userId) {
        return this.menuService.deleteProduct(businessId, id, userId);
    }
    async getFullMenu(businessId, userId) {
        return this.menuService.getFullMenu(businessId, userId);
    }
};
exports.MenuController = MenuController;
__decorate([
    (0, common_1.Get)('categories'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, menu_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Put)('categories/reorder'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, menu_dto_1.ReorderCategoriesDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "reorderCategories", null);
__decorate([
    (0, common_1.Put)('categories/:id'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, menu_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('products'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Post)('products'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, menu_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Put)('products/:id'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, menu_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Post)('products/:id/duplicate'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "duplicateProduct", null);
__decorate([
    (0, common_1.Patch)('products/:id/toggle-availability'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "toggleAvailability", null);
__decorate([
    (0, common_1.Delete)('products/:id'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Get)('menu'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MenuController.prototype, "getFullMenu", null);
exports.MenuController = MenuController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('business/:businessId'),
    __metadata("design:paramtypes", [menu_service_1.MenuService])
], MenuController);
//# sourceMappingURL=menu.controller.js.map