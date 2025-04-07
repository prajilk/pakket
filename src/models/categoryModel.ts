import { Schema, model, models } from "mongoose";
import { CategoryDocument } from "./types/category";

const CategorySchema = new Schema<CategoryDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        icon: {
            url: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
            },
        },
        image: {
            url: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
            },
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    { versionKey: false, timestamps: true }
);

const Category =
    models?.Category || model<CategoryDocument>("Category", CategorySchema);
export default Category;
