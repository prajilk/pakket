import { error500, success200 } from "@/lib/response";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Order from "@/models/orderModel";

async function getHandler() {
    try {
        // Fetch orders from the database
        const orders = await Order.find({}).sort({ createdAt: -1 }).limit(15);

        const formattedOrders = orders.map((order) => ({
            _id: order._id,
            orderId: order.orderId,
            items: order.items.length,
            userName: order.userName,
            userPhone: order.userPhone,
            totalPrice: order.totalPrice,
            status: order.status,
            createdAt: order.createdAt,
        }));

        return success200({
            result: formattedOrders,
        });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
