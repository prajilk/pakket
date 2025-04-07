export interface CategoryDocument {
    _id: string;
    name: string;
    icon: {
        url: string;
        publicId: string;
    };
    image: {
        url: string;
        publicId: string;
    };
    disabled: boolean;
}
