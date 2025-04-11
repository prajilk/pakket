import { error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Order from "@/models/orderModel";

const LIMIT = 20;

async function getHandler(req: AuthenticatedRequest) {
    try {
        const statusFilter = req.nextUrl.searchParams
            .get("statusFilter")
            ?.split(",") || ["all"];
        const search = req.nextUrl.searchParams.get("search") || "";
        const date = req.nextUrl.searchParams.get("date");

        // Escape special regex characters in search query
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        // Construct the search filter
        const searchFilter =
            escapedSearch.length > 0
                ? {
                      $or: [
                          {
                              userName: {
                                  $regex: escapedSearch,
                                  $options: "i",
                              },
                          },
                          {
                              userPhone: {
                                  $regex: escapedSearch,
                                  $options: "i",
                              },
                          },
                          { orderId: { $regex: escapedSearch, $options: "i" } },
                      ],
                  }
                : {};

        // Construct the status filter
        const statusCondition = statusFilter.includes("all")
            ? {}
            : { status: { $in: statusFilter } };

        let dateFilter = {};
        if (date) {
            const start = new Date(date);
            const end = new Date(start);
            end.setDate(start.getDate() + 1);

            dateFilter = {
                createdAt: {
                    $gte: start,
                    $lt: end,
                },
            };
        }

        // Combine both filters
        const filter = {
            ...searchFilter,
            ...statusCondition, // Add status filtering only if it's not "all"
            ...dateFilter,
        };

        // Pagination
        const page = Number(req.nextUrl.searchParams.get("page")) || 1;
        const skip = (page - 1) * LIMIT;

        // Fetch orders from the database
        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(LIMIT + 1); // Fetch one extra to check if more pages exist

        const hasMore = orders.length > LIMIT;

        // Remove the extra customer if exists
        if (hasMore) {
            orders.pop();
        }

        const formattedOrders = orders.map((order) => ({
            _id: order._id,
            orderId: order.orderId,
            user: order.user,
            address: order.address,
            items: order.items.length,
            userName: order.userName,
            userPhone: order.userPhone,
            totalPrice: order.totalPrice,
            deliveryDate: order.deliveryDate,
            status: order.status,
            note: order.note,
            isDeleted: order.isDeleted,
            createdAt: order.createdAt,
        }));

        return success200({
            result: {
                orders: formattedOrders,
                hasMore,
            },
        });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
