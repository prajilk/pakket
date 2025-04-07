"use server";

import { deleteFile } from "@/config/cloudinary.config";
import connectDB from "@/config/mongodb";
import HeroBanner from "@/models/heroBannerModel";
import { revalidatePath } from "next/cache";

export async function deleteHeroBannerAction(id: string) {
    try {
        await connectDB();
        if (!id) {
            return { error: "Missing id" };
        }

        const banner = await HeroBanner.findByIdAndDelete({ _id: id });
        if (banner && banner.banner.publicId) {
            await deleteFile(banner.banner.publicId);
        }

        revalidatePath("/dashboard/offers");

        return { success: true };
    } catch (error) {
        return { error: error };
    }
}
