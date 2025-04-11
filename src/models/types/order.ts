import mongoose from "mongoose";

export interface OrderDocument {
    _id: string;
    orderId: string;
    user: mongoose.Types.ObjectId;
    address: mongoose.Types.ObjectId;
    items: {
        item: mongoose.Types.ObjectId;
        option: mongoose.Types.ObjectId;
        quantity: number;
        priceAtOrder: number;
    }[];
    userName: string;
    userPhone: string;
    totalPrice: number;
    deliveryCharge: number;
    deliveryDate: Date | null;
    status: string;
    note?: string;
    isDeleted: boolean;
    createdAt: Date;
}
