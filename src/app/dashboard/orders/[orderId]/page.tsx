import OrderDetailsPage from "@/components/order/order-page";
import connectDB from "@/config/mongodb";
import { PopulatedOrderDocument } from "@/lib/types/order";
import Address from "@/models/addressModel";
import Order from "@/models/orderModel";
import Product from "@/models/productModel";
import User from "@/models/userModel";
import { notFound } from "next/navigation";

const OrderPage = async ({
    params,
}: {
    params: Promise<{ orderId: string }>;
}) => {
    const { orderId } = await params;
    await connectDB();
    const order = await Order.findOne<PopulatedOrderDocument | null>({
        orderId,
    })
        .populate({ path: "user", model: User, select: "name phone email" })
        .populate({ path: "address", model: Address })
        .populate({ path: "items.item", model: Product });

    if (!order) return notFound();

    return <OrderDetailsPage order={order} />;
};

export default OrderPage;
