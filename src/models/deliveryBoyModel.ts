import { Schema, model, models } from "mongoose";
import { DeliveryBoyDocument } from "./types/delivery-zone";

const DeliveryBoySchema = new Schema<DeliveryBoyDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
    },
    { versionKey: false, timestamps: true }
);

const DeliveryBoy =
    models?.DeliveryBoy ||
    model<DeliveryBoyDocument>("DeliveryBoy", DeliveryBoySchema);
export default DeliveryBoy;
