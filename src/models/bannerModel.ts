import { Schema, model, models } from "mongoose";
import { BannerDocument } from "./types/banner";

const BannerSchema = new Schema<BannerDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        banner: {
            url: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
                default: null,
            },
        },
        type: {
            type: String,
            required: true,
        },
        disabled: {
            type: Boolean,
            required: false,
        },
    },
    { versionKey: false, timestamps: true }
);

const Banner = models?.Banner || model<BannerDocument>("Banner", BannerSchema);
export default Banner;
