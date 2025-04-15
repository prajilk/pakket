"use server";

import { deleteFile } from "@/config/cloudinary.config";
import connectDB from "@/config/mongodb";
import Category from "@/models/categoryModel";
import Product from "@/models/productModel";
import { CategoryDocument } from "@/models/types/category";
import { revalidatePath } from "next/cache";

export async function deleteCategoryAction(id: string) {
    try {
        await connectDB();
        if (!id) {
            return { error: "Missing id" };
        }

        const categoryInUse = await Product.findOne({ category: id });
        if (categoryInUse) {
            return { error: "Cannot delete category, it is in use" };
        }

        const category: CategoryDocument | null =
            await Category.findByIdAndDelete({ _id: id });

        const filesToDelete: Promise<boolean>[] = [];

        if (category?.icon.publicId) {
            filesToDelete.push(deleteFile(category.icon.publicId));
        }
        if (category?.image.publicId) {
            filesToDelete.push(deleteFile(category.image.publicId));
        }

        await Promise.all(filesToDelete);

        revalidatePath("/dashboard/categories");
        revalidatePath("/dashboard/products/add");
        revalidatePath("/dashboard/products/edit");

        return { success: true };
    } catch (error) {
        return { error: error };
    }
}
