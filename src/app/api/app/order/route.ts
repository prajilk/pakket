import {
    error400,
    error401,
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
import Product from "@/models/productModel";

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

        const user = await User.findOne({ _id: req.user.id });

        // Calculate total price
        const { totalPrice, items } = await calculateTotalPrice(
            result.data.items
        );

        const deliveryCharge = 0;

        const order = await Order.create({
            orderId: generateOrderId(),
            items,
            address: result.data.address,
            note: result.data.note,
            user: req.user.id,
            totalPrice: Number((totalPrice + deliveryCharge).toFixed(2)),
            userName: user.name,
            userPhone: user.phone,
            deliveryCharge,
        });

        return success201({ order });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

async function getHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");

        const orders = await Order.find({
            user: req.user.id,
            isDeleted: false,
        }).populate({
            path: "items.item",
            model: Product,
            select: "title thumbnail options",
        });

        const formattedOrders = orders.map((order) => {
            return {
                _id: order._id,
                orderId: order.orderId,
                status: order.status,
                totalPrice: order.totalPrice,
                deliveryDate: order.deliveryDate,
                orderedOn: order.createdAt,
                items: order.items.map(
                    (item: {
                        _id: string;
                        item: { options: { _id: string }[] };
                        option: string;
                        quantity: number;
                        priceAtOrder: number;
                    }) => {
                        return {
                            item: item._id,
                            option: item.item.options.find(
                                (opt) =>
                                    opt._id.toString() ===
                                    item.option.toString()
                            ),
                            quantity: item.quantity,
                            priceAtOrder: item.priceAtOrder,
                        };
                    }
                ),
            };
        });

        console.log(formattedOrders[0].items);

        // Continue after UI is done

        /*
        {
            _id: ObjectId,
            orderId: String,
            status: String,
            totalPrice: Number,
            deliveryDate: Date,
            orderOn: Date,
            items: [
                {
                    _id: ObjectId,
                    title: String,
                    thumbnail: String,
                    option: {
                        _id: ObjectId,
                        unit: String,
                        basePrice: Number,
                        offerPrice: Number,
                    },
                    quantity: Number,
                }
            ]
        }
        */

        return success200({ orders: orders || [] });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const POST = withDbConnectAndAppAuth(postHandler);
export const GET = withDbConnectAndAppAuth(getHandler);
