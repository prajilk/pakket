"use server";

import connectDB from "@/config/mongodb";
import DeliveryBoy from "@/models/deliveryBoyModel";
import { revalidatePath } from "next/cache";

export async function addDeliveryBoyAction(formData: FormData) {
    try {
        const { name, phone, location } = Object.fromEntries(formData);
        if (!name || (!phone && phone.replaceAll(" ", "").length !== 10)) {
            return { error: "Invalid data" };
        }

        await connectDB();
        const isExists = await DeliveryBoy.findOne({ phone: phone as string });
        if (isExists) {
            return { error: "Delivery boy already exists" };
        }
        await DeliveryBoy.create({
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
