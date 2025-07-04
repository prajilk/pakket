export interface HeroBannerDocument {
    _id: string;
    name: string;
    categoryId: string;
    categoryName: string;
    banner: {
        url: string;
        publicId: string;
    };
    disabled: boolean;
}
