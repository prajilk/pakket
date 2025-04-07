import { Schema, model, models } from "mongoose";
import { ProductDocument } from "./types/product";

const ProductSchema = new Schema<ProductDocument>(
    {
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        thumbnail: {
            url: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
            },
        },
        images: {
            type: [
                {
                    url: {
                        type: String,
                        required: true,
                    },
                    publicId: {
                        type: String,
                    },
                },
            ],
        },
        description: {
            type: String,
            required: true,
        },
        options: [
            {
                unit: {
                    type: String,
                    required: true,
                },
                basePrice: {
                    type: Number,
                    required: true,
                },
                offerPrice: Number,
                inStock: {
                    type: Boolean,
                    default: true,
                },
            },
        ],
        tags: [{ type: String }],
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    { versionKey: false, timestamps: true }
);

const Product =
    models?.Product || model<ProductDocument>("Product", ProductSchema);
export default Product;
