export interface HeroBannerDocument {
    _id: string;
    name: string;
    banner: {
        url: string;
        publicId: string;
    };
    route: string;
    disabled: boolean;
}
