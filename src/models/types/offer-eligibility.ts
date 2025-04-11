import mongoose from "mongoose";

export interface OfferEligibilityDocument {
    _id: string;
    user: mongoose.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    totalSpent: number;
    isSent: boolean;
    createdAt: Date;
}
