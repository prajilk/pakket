"use client";

import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import {
    BadgeCheck,
    ChevronRight,
    Copy,
    Eye,
    Loader2,
    RotateCw,
} from "lucide-react";
import DeleteDialog from "../dialog/delete-dialog";
import { format } from "date-fns";
import { Badge, badgeVariants } from "../ui/badge";
import { PendingOrderTableDocument } from "@/lib/types/order";
import Link from "next/link";
import { VariantProps } from "class-variance-authority";
import { deleteOrderAction } from "@/actions/order/delete-order";
import UpdateStatus from "../order/update-status";
import { Button } from "../ui/button";
import { usePendingOrders } from "@/api-hooks/orders/get-pending-orders";
import { Show } from "../show";
import ApproveOrderDialog from "../dialog/approve-order-dialog";
import { toast } from "sonner";
import { Button as HeroButton } from "@heroui/button";
import getQueryClient from "@/lib/query-utils/get-query-client";

const statusColorMap: Record<
    string,
    VariantProps<typeof badgeVariants>["variant"]
> = {
    pending: "default",
    ongoing: "secondary",
    delivered: "success",
    cancelled: "destructive",
};

export const columns = [
    { name: "ORDER ID", uid: "orderId" },
    { name: "NAME", uid: "userName" },
    { name: "AMOUNT", uid: "totalPrice" },
    { name: "ORDER PLACED", uid: "createdAt" },
    { name: "NOTE", uid: "note" },
    { name: "APPROVE", uid: "approve" },
    { name: "COPY ORDER", uid: "copyOrder" },
    { name: "ACTIONS", uid: "actions" },
];

export default function PendingOrdersTable({ limit = 0, showViewAll = true }) {
    const { data: orders, isPending } = usePendingOrders(limit);
    const queryClient = getQueryClient();

    function handleCopyOrder(order: PendingOrderTableDocument) {
        toast.success(order.userPhone);
        navigator.clipboard.writeText(`
📦 *New Delivery Assigned*

🧾 *Order ID:* #${order.orderId}
👤 *Customer:* ${order.userName}
📞 *Phone:* ${order.userPhone}
📍 *Delivery Address:* 
 ${order.address}

🗓️ *Order placed:* ${format(order.createdAt, "dd MMM yyyy hh:mm a")}
⏰ *Order received:* ${format(new Date(), "dd MMM yyyy hh:mm a")}
💰 *Total Amount:* ₹${order.totalPrice}

🍱 *Items:*
${order.items
    .map((item) => `- ${item.title} (${item.option}) x${item.quantity}`)
    .join("\n")}

🗺️ *Directions:* ${order.location}

📌 *Notes:* ${order.note}

Please confirm once delivered ✅
`);
        toast.success("Order copied to clipboard");
    }

    const renderCell = React.useCallback(
        (order: PendingOrderTableDocument, columnKey: React.Key) => {
            const cellValue =
                order[columnKey as keyof PendingOrderTableDocument];

            switch (columnKey) {
                case "name":
                    return (
                        <span className="whitespace-nowrap">
                            {cellValue.toString()}
                        </span>
                    );
                case "totalPrice":
                    return "₹" + order.totalPrice;
                case "status":
                    return (
                        <Badge
                            className="capitalize"
                            variant={statusColorMap[order.status]}
                        >
                            {cellValue.toString()}
                        </Badge>
                    );
                case "approve":
                    return (
                        <ApproveOrderDialog id={order._id}>
                            <Button size={"sm"} variant={"outline"}>
                                <BadgeCheck className="text-green-500" />{" "}
                                Approve
                            </Button>
                        </ApproveOrderDialog>
                    );
                case "copyOrder":
                    return (
                        <button onClick={() => handleCopyOrder(order)}>
                            <Copy size={18} className="text-muted-foreground" />
                        </button>
                    );
                case "update_status":
                    return (
                        <UpdateStatus id={order._id} status={order.status} />
                    );
                case "createdAt":
                    return format(
                        new Date(order.createdAt),
                        "MMM d, yyyy hh:mm a"
                    );
                case "actions":
                    return (
                        <div className="flex items-center justify-center gap-2.5">
                            <button>
                                <Link
                                    href={`/dashboard/orders/${order.orderId}`}
                                >
                                    <Eye
                                        size={18}
                                        className="text-muted-foreground"
                                    />
                                </Link>
                            </button>
                            <DeleteDialog
                                id={order._id}
                                action={deleteOrderAction}
                                errorMsg="Failed to delete order."
                                loadingMsg="Deleting order..."
                                successMsg="Order deleted successfully."
                                title="order"
                                queryKey={["orders"]}
                            />
                        </div>
                    );
                default:
                    return cellValue;
            }
        },
        []
    );

    return (
        <Table
            isHeaderSticky
            aria-label="Example table with custom cells, pagination and sorting"
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[382px] scrollbar-none border shadow-md px-3",
            }}
            topContent={
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-medium">Pending Orders</h1>
                    <div className="flex gap-2 items-center">
                        <Show>
                            <Show.When isTrue={showViewAll}>
                                <Link href="/dashboard/orders/pending">
                                    <Button size={"sm"} variant={"outline"}>
                                        View all
                                        <ChevronRight />
                                    </Button>
                                </Link>
                            </Show.When>
                        </Show>
                        <HeroButton
                            startContent={<RotateCw className="size-4" />}
                            size="sm"
                            variant="bordered"
                            className="bg-white border border-dashed rounded-md shadow-sm h-9"
                            onPress={() =>
                                queryClient.invalidateQueries({
                                    queryKey: ["orders", "pending"],
                                })
                            }
                        >
                            Refresh data
                        </HeroButton>
                    </div>
                </div>
            }
            topContentPlacement="inside"
        >
            <TableHeader columns={columns}>
                {(column: {
                    uid: string;
                    sortable?: boolean;
                    name: string;
                }) => (
                    <TableColumn
                        key={column.uid}
                        align={
                            column.uid === "actions" ||
                            column.uid === "copyOrder"
                                ? "center"
                                : "start"
                        }
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                emptyContent={"No orders found"}
                items={orders || []}
                isLoading={isPending}
                loadingContent={<Loader2 className="animate-spin" />}
            >
                {(item: PendingOrderTableDocument) => (
                    <TableRow key={item.orderId}>
                        {(columnKey) => (
                            // @ts-expect-error: columnKey is of type keyof PendingOrderTableDocument
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
