export declare class CreateOfferDto {
    title: string;
    description?: string;
    discountType: string;
    discountAmount?: number;
    promoCode?: string;
    imageUrl?: string;
    startDate: string;
    endDate: string;
    isActive?: boolean;
}
export declare class UpdateOfferDto {
    title?: string;
    description?: string;
    discountType?: string;
    discountAmount?: number;
    promoCode?: string;
    imageUrl?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
}
