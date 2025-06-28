import { Schema, model, models } from "mongoose";
import { AddressDocument } from "./types/address";

const AddressSchema = new Schema<AddressDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        locality: {
            type: String,
            required: true,
        },
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        },
        mapUrl: {
            type: String,
        },
        postcode: {
            type: String,
            required: true,
        },
        floor: {
            type: String,
            default: null,
        },
        landmark: {
            type: String,
            default: null,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { versionKey: false }
);

const Address =
    models?.Address || model<AddressDocument>("Address", AddressSchema);
export default Address;
