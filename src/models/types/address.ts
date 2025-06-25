import mongoose from "mongoose";

export interface AddressDocument {
    _id: string;
    user: mongoose.Types.ObjectId;
    address: string;
    locality: string;
    lat?: number;
    lng?: number;
    mapUrl?: string;
    floor?: string;
    landmark?: string;
    isDeleted: boolean;
}
