import { ZodOrderSchema } from "@/lib/zod-schema/schema";
import Product from "@/models/productModel";
import { z } from "zod";

const items: {
    item: string;
    option: string;
    quantity: number;
    priceAtOrder: number;
}[] = [];

export async function calculateTotalPrice(
    orderItems: z.infer<typeof ZodOrderSchema>["items"]
) {
    let totalPrice = 0;

    // Get all product IDs from the order
    const productIds = orderItems.map((item) => item.item);

    // Fetch product details from MongoDB
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length === 0) return { totalPrice: 0, items: [] };

    // Create a map for quick lookup
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    for (const order of orderItems) {
        const product = productMap.get(order.item);
        if (!product) continue; // Skip if product is not found

        // Find the correct option
        const selectedOption = product.options.find(
            (opt: { _id: string }) => opt._id.toString() === order.option
        );
        if (!selectedOption) {
            return { totalPrice: 0, items: [order.item], optionError: true };
        } // Return if option is not found

        // Use offerPrice if available, otherwise basePrice
        const price =
            selectedOption.offerPrice && selectedOption.offerPrice !== 0
                ? selectedOption.offerPrice
                : selectedOption.basePrice;

        const item = {
            item: order.item,
            option: order.option,
            quantity: order.quantity,
            priceAtOrder: price,
        };
        items.push(item);

        totalPrice += price * parseInt(order.quantity.toString(), 10);
    }

    return { totalPrice, items };
}
