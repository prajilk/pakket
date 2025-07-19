import { AddressDocument } from "@/models/types/address";
import { OrderDocument } from "@/models/types/order";
import { ProductDocument } from "@/models/types/product";
import { UserDocument } from "@/models/types/user";

export type PopulatedItem = {
    _id: string;
    item: {
        _id: string;
        title: string;
        thumbnail: string;
        options: {
            _id: string;
            unit: string;
            basePrice: number;
            offerPrice: number;
        }[];
    };
    quantity: number;
    priceAtOrder: number;
    option: string;
};

export type OrderTableDocument = {
    _id: string;
    orderId: string;
    user: string;
    address: string;
    userName: string;
    userPhone: string;
    totalPrice: number;
    deliveryDate: Date;
    isDeleted: boolean;
    status: string;
    createdAt: Date;
};

export type PendingOrderTableDocument = {
    _id: string;
    orderId: string;
    items: {
        title: string;
        priceAtOrder: number;
        quantity: number;
        option: string;
    }[];
    note: string;
    userName: string;
    userPhone: string;
    address: string;
    location: string;
    totalPrice: string;
    status: string;
    createdAt: string;
    deliveryToken: string;
};

// Use Omit<> to avoid repetition and improve maintainability
export interface PopulatedOrderDocument
    extends Omit<OrderDocument, "user" | "address" | "items"> {
    user: UserDocument;
    address: AddressDocument;
    items: {
        _id: string;
        item: ProductDocument;
        option: string;
        priceAtOrder: number;
        quantity: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
