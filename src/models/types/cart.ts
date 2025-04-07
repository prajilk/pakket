import mongoose from "mongoose";

export interface CartDocument {
    _id: string;
    user: mongoose.Types.ObjectId;
    items: {
        product: string;
        quantity: number;
    }[];
}
