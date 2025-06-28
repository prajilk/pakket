"use server";

import connectDB from "@/config/mongodb";
import DeliveryBoy from "@/models/deliveryBoyModel";
import { revalidatePath } from "next/cache";

export async function deleteDeliveryBoyAction(id: string) {
    try {
        await connectDB();
        if (!id) {
            return { error: "Missing id" };
        }

        await DeliveryBoy.findByIdAndDelete({ _id: id });

        revalidatePath("/dashboard/delivery-zones");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        else return { error: "An unknown error occurred." };
    }
}
