import mongoose from "mongoose";

export type OptionProps = {
    _id: string;
    unit: string;
    basePrice: number;
    offerPrice: number;
    inStock: boolean;
};

export interface ProductDocument {
    _id: string;
    category: mongoose.Types.ObjectId;
    title: string;
    thumbnail: {
        url: string;
        publicId: string;
    };
    images: {
        url: string;
        publicId: string;
    }[];
    options: OptionProps[];
    description: string;
    tags: string[];
    disabled: boolean;
}
