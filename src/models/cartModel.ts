import { Schema, model, models } from "mongoose";
import { CartDocument } from "./types/cart";

const CartSchema = new Schema<CartDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
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
            },
        ],
    },
    { versionKey: false, timestamps: true }
);

CartSchema.index({ user: 1 }, { unique: true });

const Cart = models?.Cart || model<CartDocument>("Cart", CartSchema);
export default Cart;
