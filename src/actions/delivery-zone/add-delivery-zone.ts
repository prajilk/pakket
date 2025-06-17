"use server";

import connectDB from "@/config/mongodb";
import DeliveryZone from "@/models/deliveryZoneModel";
import { revalidatePath } from "next/cache";

export async function addDeliveryZoneAction(formData: FormData) {
    try {
        const { postcode } = Object.fromEntries(formData);
        if (!postcode || (postcode as string).length !== 6) {
            return { error: "Invalid postcode" };
        }

        await connectDB();
        await DeliveryZone.create({
            postcode: postcode as string,
        });

        revalidatePath("/dashboard/delivery-zones");

        return { success: true };
    } catch (error) {
        return { error: error };
    }
}
