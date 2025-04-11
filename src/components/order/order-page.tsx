import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PopulatedOrderDocument } from "@/lib/types/order";
import OrderSummaryCard from "./order-summary-card";
import UserCard from "./user-card";
import AddressCard from "./address-card";
import ItemRow from "./item-row";
import { findOptionById } from "@/lib/utils";
import PaymentSummary from "./payment-summary";
import UpdateStatus from "./update-status";
import ApproveOrderDialog from "../dialog/approve-order-dialog";
import { BadgeCheck } from "lucide-react";

export default function OrderDetailsPage({
    order,
}: {
    order: PopulatedOrderDocument;
}) {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Order Details</h1>
                    <p className="text-muted-foreground">
                        Order ID: {order.orderId}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs whitespace-nowrap text-muted-foreground">
                        Update Status
                    </span>
                    <UpdateStatus
                        id={order._id.toString()}
                        status={order.status}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Order Summary Card */}
                <OrderSummaryCard
                    createdAt={order.createdAt}
                    orderId={order.orderId}
                    status={order.status}
                    deliveryDate={order.deliveryDate}
                />

                {/* User Information Card */}
                <UserCard
                    email={order.user.email}
                    name={order.userName}
                    phone={order.userPhone}
                    userId={order.user._id.toString()}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Address Information */}
                <AddressCard
                    address={order.address.address}
                    addressId={order.address._id.toString()}
                    floor={order.address.floor}
                    landmark={order.address.landmark}
                    lat={order.address.lat}
                    lng={order.address.lng}
                    locality={order.address.locality}
                    isDeleted={order.address.isDeleted}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Note</CardTitle>
                    </CardHeader>
                    <CardContent>{order.note}</CardContent>
                </Card>
            </div>

            {/* Order Items */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                    <CardDescription>
                        Items purchased in this order
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">
                                    Image
                                </TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead className="text-right">
                                    Price
                                </TableHead>
                                <TableHead className="text-right">
                                    Quantity
                                </TableHead>
                                <TableHead className="text-right">
                                    Total
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item) => (
                                <ItemRow
                                    key={item._id.toString()}
                                    itemId={item.item._id.toString()}
                                    priceAtOrder={item.priceAtOrder}
                                    quantity={item.quantity}
                                    totalPrice={(
                                        item.priceAtOrder * item.quantity
                                    ).toFixed(2)}
                                    title={item.item.title}
                                    unit={
                                        findOptionById(
                                            item.item.options,
                                            item.option
                                        )?.unit || ""
                                    }
                                    url={item.item.thumbnail.url}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter>
                    <PaymentSummary
                        deliveryCharge={order.deliveryCharge.toFixed(2)}
                        subtotal={(
                            order.totalPrice - order.deliveryCharge
                        ).toFixed(2)}
                        totalPrice={order.totalPrice.toFixed(2)}
                    />
                </CardFooter>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href="/dashboard/orders">Back to Orders</Link>
                </Button>
                <ApproveOrderDialog id={order._id.toString()}>
                    <Button variant={"outline"}>
                        <BadgeCheck className="text-green-500" /> Approve
                    </Button>
                </ApproveOrderDialog>
            </div>
        </div>
    );
}
