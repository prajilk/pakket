"use server";

import { deleteFile } from "@/config/cloudinary.config";
import connectDB from "@/config/mongodb";
import Banner from "@/models/bannerModel";
import HeroBanner from "@/models/heroBannerModel";
import { revalidatePath } from "next/cache";

export async function deleteBannerAction(id: string, heroBanner = false) {
    try {
        await connectDB();
        if (!id) {
            return { error: "Missing id" };
        }

        if (heroBanner) {
            const banner = await HeroBanner.findByIdAndDelete({ _id: id });
            if (banner && banner.banner.publicId) {
                await deleteFile(banner.banner.publicId);
            }
        } else {
            const banner = await Banner.findByIdAndDelete({ _id: id });
            if (banner && banner.banner.publicId) {
                await deleteFile(banner.banner.publicId);
            }
        }

        revalidatePath("/dashboard/offers");

        return { success: true };
    } catch (error) {
        return { error: error };
    }
}
