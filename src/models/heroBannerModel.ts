import { Schema, model, models } from "mongoose";
import { HeroBannerDocument } from "./types/hero-banner";

const HeroBannerSchema = new Schema<HeroBannerDocument>(
    {
        name: {
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
        route: {
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

const HeroBanner =
    models?.HeroBanner ||
    model<HeroBannerDocument>("HeroBanner", HeroBannerSchema);
export default HeroBanner;
