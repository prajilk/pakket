"use server";

import connectDB from "@/config/mongodb";
import { ZodItemSchema } from "@/lib/zod-schema/schema";
import Product from "@/models/productModel";

export async function createProductAction(formData: FormData) {
    try {
        await connectDB();
        const data = Object.fromEntries(formData.entries());
        const result = ZodItemSchema.safeParse(data);
        if (!result.success) {
            return { error: result.error };
        }

        await Product.findOneAndReplace(
            { _id: data.id },
            {
                ...result.data,
            }
        );
        return { success: true };
    } catch (error) {
        return { error: error };
    }
}
