"use server";

import connectDB from "@/config/mongodb";
import Address from "@/models/addressModel";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import { revalidatePath } from "next/cache";

export async function deleteCustomerAction(id: string) {
    try {
        await connectDB();
        if (!id) {
            return { error: "Missing id" };
        }

        const userInUse = await Order.findOne({ user: id });
        if (userInUse) {
            return { error: "Cannot remove customer, it have related orders" };
        }

        await User.findByIdAndDelete({ _id: id });
        await Address.deleteMany({ user: id });

        revalidatePath("/dashboard/customers");

        return { success: true };
    } catch (error) {
        return { error: error };
    }
}
