"use server";

import connectDB from "@/config/mongodb";
import DeliveryZone from "@/models/deliveryZoneModel";
import { revalidatePath } from "next/cache";

export async function deleteDeliveryZoneAction(id: string) {
    try {
        await connectDB();
        if (!id) {
            return { error: "Missing id" };
        }

        await DeliveryZone.findByIdAndDelete({ _id: id });

        revalidatePath("/dashboard/delivery-zones");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        else return { error: "An unknown error occurred." };
    }
}
