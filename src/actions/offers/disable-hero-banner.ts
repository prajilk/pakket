"use server";

import connectDB from "@/config/mongodb";
import HeroBanner from "@/models/heroBannerModel";
import { revalidatePath } from "next/cache";

export async function disableHeroBannerAction(id: string, value: boolean) {
    try {
        await connectDB();
        if (!id) {
            return { error: "Missing id" };
        }

        await HeroBanner.findByIdAndUpdate({ _id: id }, { disabled: value });

        revalidatePath("/dashboard/offers");

        return { success: true };
    } catch (error) {
        return { error: error };
    }
}
