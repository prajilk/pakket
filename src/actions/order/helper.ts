import OfferEligibility from "@/models/offerEligibilityModel";
import Order from "@/models/orderModel";
import Product from "@/models/productModel";
import { startOfWeek, endOfWeek } from "date-fns";
import mongoose from "mongoose";

export async function handleOrderDelivered(user: mongoose.Types.ObjectId) {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 }); // Sunday
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 0 }); // Saturday

    const totalDelivered = await Order.aggregate([
        {
            $match: {
                user,
                status: "delivered",
                createdAt: { $gte: weekStart, $lte: weekEnd },
            },
        },
        {
            $group: {
                _id: null,
                totalSpent: { $sum: "$totalPrice" },
            },
        },
    ]);

    const totalSpent = totalDelivered[0]?.totalSpent ?? 0;

    if (totalSpent >= 20000) {
        const alreadyEligible = await OfferEligibility.findOne({
            user,
            startDate: weekStart,
            endDate: weekEnd,
        });

        if (!alreadyEligible) {
            await OfferEligibility.insertOne({
                user,
                startDate: weekStart,
                endDate: weekEnd,
                totalSpent,
                isSent: false,
            });
        }
    }
}

export async function handleOrderCancelled(user: mongoose.Types.ObjectId) {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 0 });

    const totalDelivered = await Order.aggregate([
        {
            $match: {
                user,
                status: "delivered",
                createdAt: { $gte: weekStart, $lte: weekEnd },
            },
        },
        {
            $group: {
                _id: null,
                totalSpent: { $sum: "$totalPrice" },
            },
        },
    ]);

    const totalSpent = totalDelivered[0]?.totalSpent ?? 0;

    if (totalSpent < 20000) {
        await OfferEligibility.deleteOne({
            user,
            startDate: weekStart,
            endDate: weekEnd,
            isSent: false, // Only delete if not sent yet
        });
    }
}

export async function handleProductPurchase(
    items: {
        item: mongoose.Types.ObjectId;
        option: mongoose.Types.ObjectId;
        quantity: number;
        priceAtOrder: number;
        _id: mongoose.Types.ObjectId;
    }[],
    opr: "increase" | "decrease" = "increase"
) {
    const multiplier = opr === "increase" ? 1 : -1;

    // Group quantities per product
    const quantityMap = new Map<string, number>();
    for (const { item, quantity } of items) {
        const key = item.toString();
        quantityMap.set(key, (quantityMap.get(key) || 0) + quantity);
    }

    const operations = Array.from(quantityMap.entries()).map(
        ([itemId, quantity]) => ({
            updateOne: {
                filter: { _id: new mongoose.Types.ObjectId(itemId) },
                update: [
                    {
                        $set: {
                            purchases: {
                                $max: [
                                    {
                                        $add: [
                                            "$purchases",
                                            multiplier * quantity,
                                        ],
                                    },
                                    0,
                                ],
                            },
                        },
                    },
                ],
            },
        })
    );

    await Product.bulkWrite(operations);
}
