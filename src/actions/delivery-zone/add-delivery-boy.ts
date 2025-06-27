"use server";

import connectDB from "@/config/mongodb";
import DeliveryBoy from "@/models/deliveryBoyModel";
import { revalidatePath } from "next/cache";

export async function addDeliveryBoyAction(formData: FormData) {
    try {
        const { name, phone } = Object.fromEntries(formData);
        if (!name || (!phone && phone.replaceAll(" ", "").length !== 10)) {
            return { error: "Invalid data" };
        }

        await connectDB();
        const isExists = await DeliveryBoy.findOne({});
        if (isExists) {
            return { error: "Delivery boy already exists" };
        }
        await DeliveryBoy.create({
            name: name as string,
            phone: phone as string,
        });

        revalidatePath("/dashboard/delivery-zones");

        return { success: true };
    } catch (error) {
        return { error: error };
    }
}
