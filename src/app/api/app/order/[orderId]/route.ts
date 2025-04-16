import { error400, error401, error500, success200 } from "@/lib/response";
import { AuthenticatedAppRequest } from "@/lib/types/auth-request";
import { PopulatedItem } from "@/lib/types/order";
import { convertToIST } from "@/lib/utils";
import { withDbConnectAndAppAuth } from "@/lib/withDbConnectAndAppAuth";
import Address from "@/models/addressModel";
import Order from "@/models/orderModel";
import Product from "@/models/productModel";

async function getHandler(
    req: AuthenticatedAppRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        if (!req.user) return error401("Unauthorized");

        const { orderId } = await params;

        const order = await Order.findOne({ orderId })
            .populate({
                path: "address",
                model: Address,
                select: "_id address locality lat lng floor landmark",
            })
            // .populate({
            //     path: "user",
            //     model: User,
            //     select: "_id name phone email dob",
            // })
            .populate({
                path: "items.item",
                model: Product,
                select: "_id title thumbnail options",
            });

        if (!order) return error400("Order not found");

        const formattedOrder = {
            ...order._doc,
            items: order.items.map((item: PopulatedItem) => {
                const selectedOption = item.item.options.find(
                    (opt) => opt._id.toString() === item.option.toString()
                );

                if (!selectedOption) return {};
                return {
                    _id: item.item._id,
                    thumbnail: item.item.thumbnail,
                    title: item.item.title,
                    option: {
                        _id: selectedOption._id,
                        unit: selectedOption.unit,
                        basePrice: selectedOption.basePrice,
                        offerPrice: selectedOption.offerPrice,
                    },
                    quantity: item.quantity,
                    priceAtOrder: item.priceAtOrder,
                };
            }),
            deliveryDate: order.deliveryDate
                ? convertToIST(order.deliveryDate)
                : null,
            createdAt: convertToIST(order.createdAt),
            updatedAt: convertToIST(order.updatedAt),
        };

        delete formattedOrder.userName;
        delete formattedOrder.user;
        delete formattedOrder.userPhone;

        return success200({ order: formattedOrder });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        return error500({ error: "An unknown error occurred." });
    }
}

export const GET = withDbConnectAndAppAuth(getHandler);
