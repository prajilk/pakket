import {
    error400,
    error401,
    error404,
    error500,
    success200,
} from "@/lib/response";
import { AuthenticatedAppRequest } from "@/lib/types/auth-request";
import { PopulatedItem } from "@/lib/types/order";
import { withDbConnectAndAppAuth } from "@/lib/withDbConnectAndAppAuth";
import { ZodItemsSchema } from "@/lib/zod-schema/schema";
import Cart from "@/models/cartModel";
import Product from "@/models/productModel";

type Item = { item: string; option: string; quantity: number };

async function getHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");

        const cart = await Cart.findOne({ user: req.user.id }).populate({
            path: "items.item",
            model: Product,
            select: "title options disabled thumbnail",
        });

        if (!cart) return error404("Cart not found");

        const items: {
            itemId: string;
            productId: string;
            thumbnail: string;
            title: string;
            disabled: boolean;
            option: {
                _id: string;
                unit: string;
                basePrice: number;
                offerPrice: number;
            };
            quantity: number;
        }[] = [];
        let totalPrice = 0;
        // Create a map for quick lookup
        const productMap = new Map(
            cart.items.map((p: { item: { _id: string } }) => [
                p.item._id.toString(),
                p,
            ])
        );

        for (const order of cart.items) {
            const product = productMap.get(
                order.item._id.toString()
            ) as PopulatedItem;
            if (!product) continue; // Skip if product is not found

            // Find the correct option
            const selectedOption = product.item.options.find(
                (opt: { _id: string }) =>
                    opt._id.toString() === order.option.toString()
            );
            if (!selectedOption) continue; // Skip if option is not found

            // Use offerPrice if available, otherwise basePrice
            const price =
                selectedOption.offerPrice && selectedOption.offerPrice !== 0
                    ? selectedOption.offerPrice
                    : selectedOption.basePrice;

            const item = {
                itemId: order._id,
                productId: order.item._id,
                thumbnail: order.item.thumbnail,
                title: order.item.title,
                disabled: order.item.disabled,
                option: selectedOption,
                quantity: order.quantity,
            };

            if (!order.item.disabled) {
                items.push(item);
                totalPrice += price * parseInt(order.quantity.toString(), 10);
            }
        }

        return success200({ cart: items, totalPrice });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

async function postHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");

        const data = await req.json();
        const result = ZodItemsSchema.safeParse(data);
        if (!result.success) {
            return error400("Invalid request body", {
                error: result.error.issues.map((i) => i.message),
            });
        }

        const cart = await Cart.findOne({ user: req.user.id });

        if (cart) {
            const index = cart.items.findIndex(
                (item: Item) =>
                    item.item.toString() === result.data.item &&
                    item.option.toString() === result.data.option
            );

            if (index !== -1) {
                cart.items[index].quantity += result.data.quantity;
                await cart.save();
                return success200({ cart });
            }
        }

        // If no cart or item not found, push the new item (upsert: create cart if not exist)
        const updatedCart = await Cart.findOneAndUpdate(
            { user: req.user.id },
            { $push: { items: result.data } },
            { upsert: true, new: true }
        );

        return success200({ cart: updatedCart });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

async function patchHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");

        const { itemId, operation } = await req.json();
        if (!itemId) return error400("Invalid item ID");

        if (operation !== "inc" && operation !== "dec")
            return error400("Invalid operation");

        const quantityChange = operation === "inc" ? 1 : -1;

        await Cart.bulkWrite([
            {
                updateOne: {
                    filter: { user: req.user.id, "items._id": itemId },
                    update: { $inc: { "items.$.quantity": quantityChange } },
                },
            },
            {
                updateOne: {
                    filter: { user: req.user.id },
                    update: {
                        $pull: {
                            items: { _id: itemId, quantity: { $lte: 0 } },
                        },
                    },
                },
            },
        ]);

        return success200({});
    } catch (error) {
        console.log(error);
        return error500({
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred.",
        });
    }
}

async function deleteHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");

        const itemId = req.nextUrl.searchParams.get("itemId");
        if (!itemId) return error400("Invalid item ID");

        await Cart.findOneAndUpdate(
            { user: req.user.id, "items._id": itemId }, // Find cart where the item exists
            {
                $pull: { items: { _id: itemId } }, // Remove the item from the cart
            }
        );

        return success200({});
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const GET = withDbConnectAndAppAuth(getHandler);
export const POST = withDbConnectAndAppAuth(postHandler);
export const PATCH = withDbConnectAndAppAuth(patchHandler);
export const DELETE = withDbConnectAndAppAuth(deleteHandler);
