"use server";

import connectDB from "@/config/mongodb";
import Address from "@/models/addressModel";
import Order from "@/models/orderModel";
import { revalidatePath } from "next/cache";

export async function deleteAddressAction(id: string) {
    try {
        await connectDB();
        if (!id) {
            return { error: "Missing id" };
        }

        const addressInUse = await Order.findOne({ address: id });
        if (addressInUse) {
            return { error: "Cannot delete address, it is in use." };
        }

        await Address.findByIdAndDelete({ _id: id });

        revalidatePath("/dashboard/addresses");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) return { error: error.message };
        else return { error: "An unknown error occurred." };
    }
}
