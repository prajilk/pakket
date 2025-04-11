"use client";

import React, { useMemo } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Selection,
} from "@heroui/table";
import { Input } from "@heroui/input";
import {
    Eye,
    ListFilter,
    Loader2,
    PlusCircle,
    RotateCw,
    X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Button as HeroButton } from "@heroui/button";
import {
    Dropdown,
    DropdownMenu,
    DropdownTrigger,
    DropdownItem,
} from "@heroui/dropdown";
import { useDebounce } from "@/hooks/use-debounce";
import DeleteDialog from "../dialog/delete-dialog";
import { format } from "date-fns";
import getQueryClient from "@/lib/query-utils/get-query-client";
import { Badge, badgeVariants } from "../ui/badge";
import { useOrders } from "@/api-hooks/orders/get-orders";
import { OrderTableDocument } from "@/lib/types/order";
import Link from "next/link";
import { VariantProps } from "class-variance-authority";
import { deleteOrderAction } from "@/actions/order/delete-order";
import UpdateStatus from "../order/update-status";
import DateFilter from "../date-filter";

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
    { name: "ADDRESS", uid: "address" },
    { name: "USER", uid: "user" },
    { name: "AMOUNT", uid: "totalPrice" },
    { name: "ORDER PLACED", uid: "createdAt" },
    { name: "DELIVERY DATE", uid: "deliveryDate" },
    { name: "STATUS", uid: "status" },
    { name: "ITEMS COUNT", uid: "items" },
    { name: "IS DELETED", uid: "isDeleted" },
    { name: "UPDATE STATUS", uid: "update_status" },
    { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
    "orderId",
    "userPhone",
    "userName",
    "createdAt",
    "status",
    "update_status",
    "actions",
];

const statusOptions = [
    { name: "Pending", uid: "pending" },
    { name: "Ongoing", uid: "ongoing" },
    { name: "Delivered", uid: "delivered" },
    { name: "Cancelled", uid: "cancelled" },
];

export default function OrdersTable() {
    const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
    const [filterValue, setFilterValue] = React.useState("");
    const [page, setPage] = React.useState(1);
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [selectedDate, setSelectedDate] = React.useState<Date | "all">("all");

    const queryClient = getQueryClient();

    const debounceSearch = useDebounce(filterValue, 500);

    const statusKey = useMemo(() => {
        return statusFilter === "all"
            ? ["all"]
            : Array.from(statusFilter).length === 3
            ? ["all"]
            : (Array.from(statusFilter).sort() as string[]);
    }, [statusFilter]);

    const { data, status, isFetching, isPlaceholderData } = useOrders(
        page,
        statusKey,
        selectedDate,
        debounceSearch
    );

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns]);

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
                    return order.deliveryDate
                        ? format(
                              new Date(order.deliveryDate),
                              "MMM d, yyyy hh:mm a"
                          )
                        : "--";
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

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-end gap-3">
                    <Input
                        isClearable
                        className="md:max-w-80"
                        classNames={{
                            inputWrapper: "rounded-md bg-white border h-9",
                        }}
                        size="sm"
                        placeholder="Search by order id, name or phone"
                        startContent={
                            <ListFilter
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                                className="text-muted-foreground"
                            />
                        }
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <Dropdown>
                        <DropdownTrigger className="hidden sm:flex">
                            <HeroButton
                                startContent={
                                    <PlusCircle className="w-4 h-4" />
                                }
                                size="sm"
                                variant="bordered"
                                className="bg-white border border-dashed rounded-md shadow-sm h-9"
                            >
                                Status Type
                            </HeroButton>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Status Type"
                            closeOnSelect={false}
                            selectedKeys={statusFilter}
                            selectionMode="multiple"
                            onSelectionChange={setStatusFilter}
                            className="overflow-y-scroll max-h-96 scrollbar-thin"
                        >
                            {statusOptions.map((column) => (
                                <DropdownItem
                                    key={column.uid}
                                    className="capitalize"
                                >
                                    {column.name}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown>
                        <DropdownTrigger>
                            <HeroButton
                                startContent={
                                    <PlusCircle className="w-4 h-4" />
                                }
                                size="sm"
                                variant="bordered"
                                className="bg-white border border-dashed rounded-md shadow-sm h-9"
                            >
                                Columns
                            </HeroButton>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={false}
                            selectedKeys={visibleColumns}
                            selectionMode="multiple"
                            onSelectionChange={setVisibleColumns}
                            className="overflow-y-scroll max-h-96 scrollbar-thin"
                        >
                            {columns.map((column) => (
                                <DropdownItem
                                    key={column.uid}
                                    className="capitalize"
                                >
                                    {column.name}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                    {/* Date Filter */}
                    <DateFilter
                        date={
                            selectedDate === "all" ? new Date() : selectedDate
                        }
                        onSelect={setSelectedDate}
                        footer="Orders placed on"
                    />
                    {selectedDate !== "all" && (
                        <Button
                            size={"icon"}
                            className="rounded-full"
                            variant={"outline"}
                            onClick={() => setSelectedDate("all")}
                        >
                            <X size={15} />
                        </Button>
                    )}
                    <div className="flex justify-end flex-1 gap-2">
                        {/* <Button
                            size={"sm"}
                            className="flex items-center gap-2"
                            asChild
                        >
                            <Link href={"/dashboard/products/add"}>
                                <Plus />
                                Add product
                            </Link>
                        </Button> */}
                        <HeroButton
                            startContent={<RotateCw className="size-4" />}
                            size="sm"
                            variant="bordered"
                            className="bg-white border border-dashed rounded-md shadow-sm h-9"
                            onPress={() =>
                                queryClient.invalidateQueries({
                                    queryKey: ["orders"],
                                })
                            }
                        >
                            Refresh data
                        </HeroButton>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-default-400 text-small">
                        Total {data?.orders.length} orders
                    </span>
                </div>
            </div>
        );
    }, [
        selectedDate,
        queryClient,
        statusFilter,
        filterValue,
        onSearchChange,
        data?.orders.length,
        onClear,
        visibleColumns,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="flex justify-end gap-2">
                <Button
                    disabled={page === 1}
                    size="sm"
                    variant="secondary"
                    onClick={() => setPage((old) => Math.max(old - 1, 0))}
                >
                    Previous
                </Button>
                <Button
                    disabled={isPlaceholderData || !data?.hasMore}
                    size="sm"
                    variant="secondary"
                    onClick={() => setPage((old) => old + 1)}
                >
                    Next
                </Button>
            </div>
        );
    }, [page, data?.hasMore, isPlaceholderData]);

    return (
        <Table
            isHeaderSticky
            aria-label="Example table with custom cells, pagination and sorting"
            classNames={{
                wrapper: "max-h-96 scrollbar-none border shadow-md px-3",
            }}
            topContent={topContent}
            topContentPlacement="outside"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
        >
            <TableHeader columns={headerColumns}>
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
                items={data?.orders || []}
                isLoading={isFetching || status === "pending"}
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
