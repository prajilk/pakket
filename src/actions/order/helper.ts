import OfferEligibility from "@/models/offerEligibilityModel";
import Order from "@/models/orderModel";
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
