import {
    error400,
    error401,
    error404,
    error500,
    success200,
    success201,
} from "@/lib/response";
import { AuthenticatedAppRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAppAuth } from "@/lib/withDbConnectAndAppAuth";
import { ZodOrderSchema } from "@/lib/zod-schema/schema";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import { calculateTotalPrice } from "./helper";
import { generateOrderId } from "@/lib/utils";
import Cart from "@/models/cartModel";
import Address from "@/models/addressModel";

async function postHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");

        const data = await req.json();
        const result = ZodOrderSchema.safeParse(data);
        if (!result.success) {
            return error400("Invalid request body", {
                error: result.error.issues.map((i) => i.message),
            });
        }

        if (result.data.items.length === 0) return error400("No items in cart");

        const user = await User.findOne({ _id: req.user.id });
        if (!user) return error404("User not found");
        const address = await Address.findOne({
            user: req.user.id,
            _id: result.data.address,
            isDeleted: false,
        });

        if (!address) return error404("Address not found");

        // Calculate total price
        const { totalPrice, items, optionError } = await calculateTotalPrice(
            result.data.items
        );

        if (optionError)
            return error400("Invalid product option ID for item: " + items[0]);
        if (items.length === 0) return error400("Invalid product ID");

        const order = await Order.create({
            orderId: generateOrderId(),
            items,
            address: result.data.address,
            note: result.data.note,
            user: req.user.id,
            totalPrice: Number(
                (totalPrice + (result.data?.deliveryCharge || 0)).toFixed(2)
            ),
            userName: user.name,
            userPhone: user.phone,
            deliveryCharge: result.data?.deliveryCharge || 0,
        });

        await Cart.findOneAndUpdate(
            { user: req.user.id },
            { $set: { items: [] } }
        );

        return success201({ order });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

async function getHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");

        const orders = await Order.find(
            {
                user: req.user.id,
                isDeleted: false,
            },
            "orderId status"
        );

        return success200({ orders: orders.reverse() || [] });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const POST = withDbConnectAndAppAuth(postHandler);
export const GET = withDbConnectAndAppAuth(getHandler);
