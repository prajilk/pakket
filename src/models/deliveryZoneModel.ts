import { Schema, model, models } from "mongoose";
import { DeliveryZoneDocument } from "./types/delivery-zone";

const DeliveryZoneSchema = new Schema<DeliveryZoneDocument>(
    {
        postcode: {
            type: String,
            required: true,
        },
        deliveryCharge: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { versionKey: false, timestamps: true }
);

const DeliveryZone =
    models?.DeliveryZone ||
    model<DeliveryZoneDocument>("DeliveryZone", DeliveryZoneSchema);
export default DeliveryZone;
