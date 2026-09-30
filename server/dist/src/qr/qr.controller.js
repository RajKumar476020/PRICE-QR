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
exports.QrController = void 0;
const common_1 = require("@nestjs/common");
const qr_service_1 = require("./qr.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let QrController = class QrController {
    constructor(qrService) {
        this.qrService = qrService;
    }
    async getQrData(businessId, userId) {
        return this.qrService.getQrData(businessId, userId);
    }
    async updateQrStyle(businessId, userId, qrStyle) {
        return this.qrService.updateQrStyle(businessId, userId, qrStyle);
    }
    async recordDownload(businessId, userId) {
        return this.qrService.recordDownload(businessId, userId);
    }
};
exports.QrController = QrController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QrController.prototype, "getQrData", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)('qrStyle')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], QrController.prototype, "updateQrStyle", null);
__decorate([
    (0, common_1.Post)('download'),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QrController.prototype, "recordDownload", null);
exports.QrController = QrController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('business/:businessId/qr'),
    __metadata("design:paramtypes", [qr_service_1.QrService])
], QrController);
//# sourceMappingURL=qr.controller.js.map