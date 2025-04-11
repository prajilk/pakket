import { Schema, model, models } from "mongoose";
import { OfferEligibilityDocument } from "./types/offer-eligibility";

const OfferEligibilitySchema = new Schema<OfferEligibilityDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        totalSpent: {
            type: Number,
            required: true,
        },
        isSent: {
            type: Boolean,
            default: false,
        },
    },
    { versionKey: false, timestamps: true }
);

const OfferEligibility =
    models?.OfferEligibility ||
    model<OfferEligibilityDocument>("OfferEligibility", OfferEligibilitySchema);
export default OfferEligibility;
