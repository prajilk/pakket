"use server";

import connectDB from "@/config/mongodb";
import Order from "@/models/orderModel";
import { revalidatePath } from "next/cache";
import {
    handleOrderCancelled,
    handleOrderDelivered,
    handleProductPurchase,
} from "./helper";

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

        const order = await Order.findById(id);

        // Login to increase product purchases
        if (data.status === "delivered" && order.status !== "delivered") {
            await handleProductPurchase(order.items);
        } else if (order.status === "delivered") {
            await handleProductPurchase(order.items, "decrease");
        }

        // Logic to find top spender
        if (data.status === "delivered" && order.status !== "delivered") {
            await handleOrderDelivered(order.user);
        } else if (order.status === "cancelled") {
            await handleOrderCancelled(order.user);
        }

        // const updatedOrder = await Order.findByIdAndUpdate(
        //     id,
        //     { $set: data },
        //     { new: true }
        // );

        order.status = data.status;
        order.deliveryDate = data.deliveryDate;
        await order.save();

        revalidatePath("/dashboard/orders");

        return { success: true };
    } catch (error) {
        return { error: error };
    }
}
