"use server";

import connectDB from "@/config/mongodb";
import Order from "@/models/orderModel";
import { revalidatePath } from "next/cache";
import { handleOrderCancelled, handleOrderDelivered } from "./helper";

export async function updateStatusAction(
    id: string,
    status: "pending" | "ongoing" | "delivered" | "cancelled"
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

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );

        if (data.status === "delivered") {
            await handleOrderDelivered(updatedOrder.user);
        } else {
            await handleOrderCancelled(updatedOrder.user);
        }

        revalidatePath("/dashboard/orders");

        return { success: true };
    } catch (error) {
        return { error: error };
    }
}
