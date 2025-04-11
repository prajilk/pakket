import { error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Order from "@/models/orderModel";
import { endOfDay, parseISO } from "date-fns";

async function getHandler(req: AuthenticatedRequest) {
    try {
        const fromParam = req.nextUrl.searchParams.get("from");
        const toParam = req.nextUrl.searchParams.get("to");

        const from = fromParam ? parseISO(fromParam) : new Date();
        const to = toParam ? endOfDay(parseISO(toParam)) : endOfDay(new Date());

        const totalOrders = await Order.find(
            { createdAt: { $gte: from, $lte: to } },
            "totalPrice status"
        );

        const totalSales = totalOrders.filter(
            (order) => order.status === "delivered"
        );
        const ordersCancelled = totalOrders.filter(
            (order) => order.status === "cancelled"
        );
        const pendingOrders = totalOrders.filter(
            (order) => order.status === "pending"
        );
        const ongoingOrders = totalOrders.filter(
            (order) => order.status === "ongoing"
        );

        const totalRevenue = totalSales.reduce(
            (acc, order) => acc + Number(order.totalPrice),
            0
        );

        const avgOrderValue = totalOrders.length
            ? totalRevenue / totalOrders.length
            : 0;

        return success200({
            result: {
                totalOrders: totalOrders.length,
                totalSales: totalSales.length,
                ordersCancelled: ordersCancelled.length,
                pendingOrders: pendingOrders.length,
                ongoingOrders: ongoingOrders.length,
                totalRevenue: Number(totalRevenue.toFixed(2)),
                newCustomers: 0,
                avgOrderValue: Number(avgOrderValue.toFixed(2)),
            },
        });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
