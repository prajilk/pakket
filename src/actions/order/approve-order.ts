"use server";

import connectDB from "@/config/mongodb";
import { generateDeliveryToken } from "@/lib/jwt/create-token";
import { formatAddress, sentOrderForDelivery } from "@/lib/utils";
import Address from "@/models/addressModel";
import DeliveryBoy from "@/models/deliveryBoyModel";
import Order from "@/models/orderModel";
import Product from "@/models/productModel";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";

export async function approveOrderAction(id: string, boyId: string) {
    try {
        await connectDB();
        if (!id) {
            return { error: "Missing id" };
        }

        const deliveryBoy = await DeliveryBoy.findById(boyId);
        if (!deliveryBoy) return { error: "Delivery boy not found" };

        const order = await Order.findById(id)
            .populate({
                path: "address",
                model: Address,
            })
            .populate({
                path: "items.item",
                model: Product,
                select: "quantity title",
            });
        if (!order) return { error: "Order not found" };

        let direction: string;
        if (order.address.lat && order.address.lng) {
            direction = `https://www.google.com/maps/dir/?api=1&destination=${order.address.lat},${order.address.lng}`;
        } else {
            direction = order.address.mapUrl;
        }

        if (!direction)
            direction =
                "Direction not provided: Please contact the customer directly!";

        const productList = order.items
            ?.map(
                (item: { quantity: number; item: { title: string } }) =>
                    `• ${item.quantity}x ${item.item.title}`
            )
            .join(", ");

        const deliveryToken = generateDeliveryToken(order.orderId);

        // TODO: Send ORDER_APPROVED notification to delivery person
        const isSent = await sentOrderForDelivery(deliveryBoy.phone, {
            "1": order.orderId,
            "2": order.userName,
            "3": order.userPhone,
            "4": formatAddress(order.address),
            "5": format(new Date(order.createdAt), "PPPP p"),
            "6": format(new Date(), "PPPP p"),
            "7": order.totalPrice.toString(),
            "8": productList,
            "9": direction,
            "10": order.note || "N/A",
            "11": deliveryToken,
        });

        if (isSent) {
            order.status = "ongoing";
            await order.save();
        } else {
            return { error: "Failed to send order for delivery" };
        }

        revalidatePath("/dashboard");

        return { success: true };
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return { error: error.message };
        else return { error: "An unknown error occurred." };
    }
}
