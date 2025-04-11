"use server";

import connectDB from "@/config/mongodb";
import OfferEligibility from "@/models/offerEligibilityModel";
import { revalidatePath } from "next/cache";

export async function sendOfferAction(offerId: string | "all") {
    try {
        await connectDB();
        if (!offerId) {
            return { error: "Missing id" };
        }

        if (offerId === "all") {
            const offers = await OfferEligibility.find({ isSent: false });
            if (!offers || offers.length === 0) {
                return { error: "No offers found" };
            }

            for (const offer of offers) {
                // LOGIC TO SEND OFFER TO USER THROUGH WHATSAPP

                await OfferEligibility.findByIdAndUpdate(
                    { _id: offer._id },
                    { isSent: true }
                );
            }
        } else {
            const offer = await OfferEligibility.findOne({
                _id: offerId,
                isSent: false,
            });
            if (!offer) {
                return { error: "Offer not found" };
            }

            // LOGIC TO SEND OFFER TO USER THROUGH WHATSAPP

            await OfferEligibility.findByIdAndUpdate(
                { _id: offerId },
                { isSent: true }
            );
        }

        revalidatePath("/dashboard");

        return { success: true };
    } catch (error) {
        return { error: error };
    }
}
