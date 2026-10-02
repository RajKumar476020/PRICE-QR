import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            createdAt: Date;
        };
        accessToken: string;
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            createdAt: Date;
        };
        businesses: ({
            hours: {
                id: string;
                businessId: string;
                dayOfWeek: number;
                dayName: string;
                openTime: string;
                closeTime: string;
                isClosed: boolean;
            }[];
            qrCode: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
                targetUrl: string;
                qrStyle: string | null;
                downloadCount: number;
                scansCount: number;
            };
            subscription: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                planName: string;
                expiresAt: Date | null;
                features: string;
                businessId: string;
            };
            _count: {
                categories: number;
                products: number;
                offers: number;
            };
        } & {
            id: string;
            email: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            publicId: string;
            category: string;
            tagline: string | null;
            description: string | null;
            logoUrl: string | null;
            coverUrl: string | null;
            phone: string | null;
            whatsapp: string | null;
            website: string | null;
            address: string | null;
            city: string | null;
            googleMapsUrl: string | null;
            instagram: string | null;
            facebook: string | null;
            currency: string;
            status: string;
            ownerId: string;
        })[];
        accessToken: string;
    }>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: string;
        createdAt: Date;
        businesses: ({
            hours: {
                id: string;
                businessId: string;
                dayOfWeek: number;
                dayName: string;
                openTime: string;
                closeTime: string;
                isClosed: boolean;
            }[];
            qrCode: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                businessId: string;
                targetUrl: string;
                qrStyle: string | null;
                downloadCount: number;
                scansCount: number;
            };
            subscription: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                planName: string;
                expiresAt: Date | null;
                features: string;
                businessId: string;
            };
            _count: {
                categories: number;
                products: number;
                offers: number;
            };
        } & {
            id: string;
            email: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            publicId: string;
            category: string;
            tagline: string | null;
            description: string | null;
            logoUrl: string | null;
            coverUrl: string | null;
            phone: string | null;
            whatsapp: string | null;
            website: string | null;
            address: string | null;
            city: string | null;
            googleMapsUrl: string | null;
            instagram: string | null;
            facebook: string | null;
            currency: string;
            status: string;
            ownerId: string;
        })[];
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
        token: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    logout(): Promise<{
        message: string;
    }>;
}
