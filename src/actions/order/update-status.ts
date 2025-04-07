"use server";

import connectDB from "@/config/mongodb";
import Order from "@/models/orderModel";
import { revalidatePath } from "next/cache";

export async function updateStatusAction(
    id: string,
    status: "pending" | "ongoing" | "delivered"
) {
    try {
        await connectDB();
        if (!id) {
            return { error: "Missing id" };
        }

        if (!status) return { error: "Missing status" };

        const data: {
            deliveryDate?: Date | null;
            status?: string;
        } = {};

        if (status === "delivered") {
            data.deliveryDate = new Date();
            data.status = status;
        } else {
            data.status = status;
            data.deliveryDate = null;
        }

        await Order.updateOne({ _id: id }, { $set: data });

        revalidatePath("/dashboard/orders");

        return { success: true };
    } catch (error) {
        return { error: error };
    }
}
