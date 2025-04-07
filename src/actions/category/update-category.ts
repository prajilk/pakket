"use server";

import { deleteFile } from "@/config/cloudinary.config";
import connectDB from "@/config/mongodb";
import Category from "@/models/categoryModel";
import { revalidatePath } from "next/cache";

function isImageChanged(oldImage: string, newImage: string) {
    if (oldImage === newImage) {
        return false;
    }
    return true;
}

export async function updateCategoryAction(id: string, formData: FormData) {
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

        const category = await Category.findById(id);
        const iconChanged = isImageChanged(category.icon.url, icon as string);
        const imageChanged = isImageChanged(
            category.image.url,
            image as string
        );
        if (iconChanged && category.icon.publicId) {
            await deleteFile(category.icon.publicId);
        }
        if (imageChanged && category.image.publicId) {
            await deleteFile(category.image.publicId);
        }

        await Category.findOneAndReplace(
            { _id: id },
            {
                name,
                icon: {
                    url: icon,
                    publicId: iconChanged
                        ? icon_id === "undefined"
                            ? null
                            : icon_id
                        : category.icon.publicId,
                },
                image: {
                    url: image,
                    publicId: imageChanged
                        ? image_id === "undefined"
                            ? null
                            : image_id
                        : category.image.publicId,
                },
                disabled: disabled ? true : false,
            }
        );

        revalidatePath("/dashboard/categories");

        return { success: true };
    } catch (error) {
        return { error: error };
    }
}
