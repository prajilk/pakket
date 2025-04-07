"use server";

import { deleteFolder } from "@/config/cloudinary.config";
import connectDB from "@/config/mongodb";
import Order from "@/models/orderModel";
import Product from "@/models/productModel";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function deleteProductAction(id: string) {
    try {
        await connectDB();

        if (!id) {
            return { error: "Missing id" };
        }

        const objectId = mongoose.Types.ObjectId.createFromHexString(id);
        const isProductInUse = await Order.findOne({
            items: { $elemMatch: { item: objectId } },
        });
        if (isProductInUse) {
            return {
                error: "Unable to delete the product. It is currently in use.",
            };
        }

        const deletedItem = await Product.findByIdAndDelete({ _id: id });

        if (deletedItem?.thumbnail?.publicId) {
            await deleteFolder(`products/${id}`);
        } else if (
            deletedItem?.images?.find(
                (image: { publicId: string | null }) => image.publicId
            )
        ) {
            await deleteFolder(`products/${id}`);
        }

        if (!deletedItem) {
            return { error: "Failed to delete product." };
        }

        revalidatePath("/dashboard/products");

        return { success: true };
    } catch (error) {
        return { error: error };
    }
}
