"use server";

import connectDB from "@/config/mongodb";
import OfferEligibility from "@/models/offerEligibilityModel";
import { revalidatePath } from "next/cache";

export async function deleteExpiredOfferAction() {
    try {
        await connectDB();

        const offerDeleted = await OfferEligibility.deleteMany({
            isSent: true,
            endDate: { $lt: new Date() },
        });

        if (offerDeleted.deletedCount > 0) {
            revalidatePath("/dashboard");
        }

        return { success: true };
    } catch (error) {
        return { error: error };
    }
}
