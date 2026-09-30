export declare class BusinessHourItemDto {
    dayOfWeek: number;
    dayName: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
}
export declare class CreateBusinessDto {
    name: string;
    category: string;
    tagline?: string;
    description?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    website?: string;
    address?: string;
    city?: string;
    googleMapsUrl?: string;
    instagram?: string;
    facebook?: string;
    logoUrl?: string;
    coverUrl?: string;
    currency?: string;
    customPublicId?: string;
    hours?: BusinessHourItemDto[];
}
export declare class UpdateBusinessDto extends CreateBusinessDto {
}
