"use server";

import connectDB from "@/config/mongodb";
import { formatAddress, sentOrderForDelivery } from "@/lib/utils";
import Address from "@/models/addressModel";
import DeliveryBoy from "@/models/deliveryBoyModel";
import Order from "@/models/orderModel";
import Product from "@/models/productModel";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";

export async function approveOrderAction(id: string) {
    try {
        await connectDB();
        if (!id) {
            return { error: "Missing id" };
        }

        const deliveryBoy = await DeliveryBoy.findOne({});
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
            return {
                error: "Invalid address, (mapUrl or lat/lng is not valid)",
            };

        const productList = order.items
            ?.map(
                (item: { quantity: number; item: { title: string } }) =>
                    `• ${item.quantity}x ${item.item.title}`
            )
            .join("\n");

        // TODO: Send ORDER_APPROVED notification to delivery person
        await sentOrderForDelivery(deliveryBoy.phone, {
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
            "11": "?orderId=" + order.orderId,
        });

        order.status = "ongoing";
        await order.save();

        revalidatePath("/dashboard");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        else return { error: "An unknown error occurred." };
    }
}
