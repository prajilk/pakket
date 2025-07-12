"use server";

import connectDB from "@/config/mongodb";
import DeliveryBoy from "@/models/deliveryBoyModel";
import { revalidatePath } from "next/cache";

export async function editDeliveryBoyAction(id: string, formData: FormData) {
    try {
        const { name, phone, location } = Object.fromEntries(formData);
        if (
            !id ||
            !name ||
            (!phone && phone.replaceAll(" ", "").length !== 10)
        ) {
            return { error: "Invalid data" };
        }

        await connectDB();
        await DeliveryBoy.findByIdAndUpdate(id, {
            name: name as string,
            phone: phone as string,
            location: location as string,
        });

        revalidatePath("/dashboard/delivery-zones");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        else return { error: "An unknown error occurred." };
    }
}
