import { generateDeliveryToken } from "@/lib/jwt/create-token";
import { error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { findOptionById, formatAddress } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Address from "@/models/addressModel";
import Order from "@/models/orderModel";
import Product from "@/models/productModel";

async function getHandler(req: AuthenticatedRequest) {
    try {
        const limitParam = req.nextUrl.searchParams.get("limit");
        const limit = limitParam ? Number(limitParam) : 0;

        const orders = await Order.find({ status: "pending" })
            .limit(limit)
            .populate({ path: "address", model: Address })
            .populate({
                path: "items.item",
                model: Product,
                select: "title options",
            });

        const formattedOrders = orders.map((order) => {
            const deliveryToken = generateDeliveryToken(order.orderId);

            // @ts-expect-error: Nothing
            const items = order.items.map((item) => {
                const product = findOptionById(item.item.options, item.option);
                return {
                    title: item.item.title,
                    priceAtOrder: item.priceAtOrder,
                    quantity: item.quantity,
                    option: product?.unit,
                };
            });

            return {
                _id: order._id,
                orderId: order.orderId,
                items,
                userName: order.userName,
                userPhone: order.userPhone,
                note: order.note,
                address: formatAddress(order.address),
                location: `https://www.google.com/maps/dir/?api=1&destination=${order.address.lat},${order.address.lng}`,
                totalPrice: order.totalPrice,
                createdAt: order.createdAt,
                deliveryToken,
            };
        });

        return success200({ result: formattedOrders });
    } catch (error) {
        console.error(error);
        return error500({
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred.",
        });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
