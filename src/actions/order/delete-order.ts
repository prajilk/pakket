"use server";

import connectDB from "@/config/mongodb";
import Order from "@/models/orderModel";
import { revalidatePath } from "next/cache";

export async function deleteOrderAction(id: string) {
    try {
        await connectDB();
        if (!id) {
            return { error: "Missing id" };
        }

        await Order.deleteOne({ _id: id });

        revalidatePath("/dashboard/orders");

        return { success: true };
    } catch (error) {
        return { error: error };
    }
}
