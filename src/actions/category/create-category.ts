"use server";

import connectDB from "@/config/mongodb";
import Category from "@/models/categoryModel";
import { revalidatePath } from "next/cache";

export async function createCategoryAction(formData: FormData) {
    try {
        await connectDB();
        const { name, disabled, icon, image, icon_id, image_id } =
            Object.fromEntries(formData.entries());

        if (!name) {
            return { error: "Name is required" };
        }
        if (!icon || !image) {
            return { error: "Icon and image are required" };
        }

        await Category.create({
            name,
            icon: {
                url: icon,
                publicId: icon_id === "undefined" ? null : icon_id,
            },
            image: {
                url: image,
                publicId: image_id === "undefined" ? null : image_id,
            },
            disabled: disabled ? true : false,
        });

        revalidatePath("/dashboard/categories");
        revalidatePath("/dashboard/products/add");
        revalidatePath("/dashboard/products/edit");

        return { success: true };
    } catch (error) {
        return { error: error };
    }
}
