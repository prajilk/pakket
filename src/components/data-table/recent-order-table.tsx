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
import { ChevronRight, Eye, Loader2, RotateCw } from "lucide-react";
import DeleteDialog from "../dialog/delete-dialog";
import { format } from "date-fns";
import { Badge, badgeVariants } from "../ui/badge";
import { OrderTableDocument } from "@/lib/types/order";
import Link from "next/link";
import { VariantProps } from "class-variance-authority";
import { deleteOrderAction } from "@/actions/order/delete-order";
import UpdateStatus from "../order/update-status";
import { useRecentOrders } from "@/api-hooks/orders/get-recent-orders";
import { Button } from "../ui/button";
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
    { name: "PHONE", uid: "userPhone" },
    { name: "AMOUNT", uid: "totalPrice" },
    { name: "ORDER PLACED", uid: "createdAt" },
    { name: "STATUS", uid: "status" },
    { name: "ITEMS COUNT", uid: "items" },
    { name: "ACTIONS", uid: "actions" },
];

export default function RecentOrdersTable() {
    const { data: orders, isPending } = useRecentOrders();
    const queryClient = getQueryClient();

    const renderCell = React.useCallback(
        (order: OrderTableDocument, columnKey: React.Key) => {
            const cellValue = order[columnKey as keyof OrderTableDocument];

            switch (columnKey) {
                case "name":
                    return (
                        <span className="whitespace-nowrap">
                            {cellValue.toString()}
                        </span>
                    );
                case "total":
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
                case "isDeleted":
                    return cellValue === true ? (
                        <Badge className="capitalize">Yes</Badge>
                    ) : (
                        <Badge className="capitalize" variant={"secondary"}>
                            No
                        </Badge>
                    );
                case "items":
                    return (
                        <h1 className="text-center">{cellValue.toString()}</h1>
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
                case "deliveryDate":
                    return format(
                        new Date(order.deliveryDate),
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
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-medium">Recent Orders</h1>
                    <div className="flex gap-2 items-center">
                        <Link href="/dashboard/orders">
                            <Button size={"sm"} variant={"outline"}>
                                View all
                                <ChevronRight />
                            </Button>
                        </Link>
                        <HeroButton
                            startContent={<RotateCw className="size-4" />}
                            size="sm"
                            variant="bordered"
                            className="bg-white border border-dashed rounded-md shadow-sm h-9"
                            onPress={() =>
                                queryClient.invalidateQueries({
                                    queryKey: ["orders", "recent"],
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
                        align={column.uid === "actions" ? "center" : "start"}
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
                {(item: OrderTableDocument) => (
                    <TableRow key={item.orderId}>
                        {(columnKey) => (
                            // @ts-expect-error: columnKey is of type keyof GroceryDocument
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
