export interface BannerDocument {
    _id: string;
    name: string;
    url: string;
    type: string;
    banner: {
        url: string;
        publicId: string;
    };
    disabled: boolean;
}
