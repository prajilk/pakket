"use server";

import connectDB from "@/config/mongodb";
import Address from "@/models/addressModel";
import Order from "@/models/orderModel";

export async function deleteAllDeletedAddressesAction() {
    try {
        await connectDB();

        const usedAddressIds = await Order.distinct("address");

        await Address.deleteMany({
            isDeleted: true,
            _id: { $nin: usedAddressIds },
        });

        return { success: true };
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        else return { error: "An unknown error occurred." };
    }
}
