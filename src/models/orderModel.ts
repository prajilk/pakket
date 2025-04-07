import { Schema, model, models } from "mongoose";
import { OrderDocument } from "./types/order";

const OrderSchema = new Schema<OrderDocument>(
    {
        address: {
            type: Schema.Types.ObjectId,
            ref: "Address",
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderId: {
            type: String,
            require: true,
        },
        items: [
            {
                item: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                option: {
                    type: Schema.Types.ObjectId,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                priceAtOrder: {
                    type: Number,
                    required: true,
                },
            },
        ],
        status: {
            type: String,
            required: true,
            default: "pending",
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        deliveryCharge: {
            type: Number,
            required: true,
        },
        deliveryDate: {
            type: Date,
            default: null,
        },
        userName: String,
        userPhone: String,
        isDeleted: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { versionKey: false, timestamps: true }
);

// Create a unique index for orderId
OrderSchema.index({ orderId: 1 }, { unique: true });

const Order = models?.Order || model<OrderDocument>("Order", OrderSchema);
export default Order;
