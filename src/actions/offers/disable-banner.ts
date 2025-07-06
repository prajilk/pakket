"use server";

import connectDB from "@/config/mongodb";
import Banner from "@/models/bannerModel";
import HeroBanner from "@/models/heroBannerModel";
import { revalidatePath } from "next/cache";

export async function disableBannerAction(
    id: string,
    value: boolean,
    heroBanner = false
) {
    try {
        await connectDB();
        if (!id) {
            return { error: "Missing id" };
        }
        if (heroBanner) {
            await HeroBanner.findByIdAndUpdate(
                { _id: id },
                { disabled: value }
            );
        } else {
            await Banner.findByIdAndUpdate({ _id: id }, { disabled: value });
        }

        revalidatePath("/dashboard/offers");

        return { success: true };
    } catch (error) {
        return { error: error };
    }
}
