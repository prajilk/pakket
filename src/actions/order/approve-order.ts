"use server";

import connectDB from "@/config/mongodb";
import Order from "@/models/orderModel";
import { revalidatePath } from "next/cache";

export async function approveOrderAction(id: string | "all") {
    try {
        await connectDB();
        if (!id) {
            return { error: "Missing id" };
        }

        if (id === "all") {
            await Order.updateMany(
                { status: "pending" },
                { $set: { status: "ongoing" } }
            );

            // TODO: Send ORDER_APPROVED notification to delivery person
        } else {
            await Order.updateOne({ _id: id }, { $set: { status: "ongoing" } });

            // TODO: Send ORDER_APPROVED notification to delivery person
        }

        revalidatePath("/dashboard");

        return { success: true };
    } catch (error) {
        return { error: error };
    }
}
