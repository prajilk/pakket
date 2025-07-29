"use server";

import connectDB from "@/config/mongodb";
import Order from "@/models/orderModel";
import jwt from "jsonwebtoken";
import {
    handleOrderCancelled,
    handleOrderDelivered,
    handleProductPurchase,
} from "../order/helper";

const SECRET = process.env.DELIVERY_CONFIRM_SECRET!;

export async function confirmDeliveryAction(token: string) {
    try {
        if (!token) {
            return { error: "Invalid token" };
        }

        await connectDB();
        const decoded = jwt.verify(token, SECRET) as { orderId: string };

        const order = await Order.findOne({ orderId: decoded.orderId });
        if (!order) {
            return { error: "Order not found" };
        }

        if (order.status === "delivered") {
            return {
                success: true,
                message: "Order already confirmed as delivered",
            };
        }

        // Login to increase product purchases
        if (order.status === "delivered") {
            await handleProductPurchase(order.items);
        } else {
            await handleProductPurchase(order.items, "decrease");
        }

        // Logic to find top spender
        if (order.status === "delivered") {
            await handleOrderDelivered(order.user);
        } else {
            await handleOrderCancelled(order.user);
        }

        order.status = "delivered";
        order.deliveryDate = new Date();
        await order.save();

        return { success: true, message: "Delivery successfully confirmed" };
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        else return { error: "An unknown error occurred." };
    }
}
