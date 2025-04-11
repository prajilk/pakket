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
import { CheckCircle, Copy, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useTopSpenders } from "@/api-hooks/customers/get-top-spenders";
import { TopSpender } from "@/lib/types/customer";
import { toast } from "sonner";
import Whatsapp from "../icons/whatsapp";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import DeleteExpiredSpendersDialog from "../dialog/delete-expired-spenders";
import SendOffersDialog from "../dialog/send-offers";

export const columns = [
    { name: "NAME", uid: "name" },
    { name: "TOTAL SPEND", uid: "totalSpend" },
    { name: "PHONE", uid: "phone" },
    { name: "ELIGIBLE ON", uid: "eligibleOn" },
    { name: "NOTIFICATION SENT", uid: "isSent" },
    { name: "COPY USER ID", uid: "_id" },
    { name: "SEND OFFER", uid: "sendOffer" },
];

export default function TopSpendersTable() {
    const [page, setPage] = React.useState(1);
    const { data, isFetching, status, isPlaceholderData } =
        useTopSpenders(page);

    const renderCell = React.useCallback(
        (customer: TopSpender, columnKey: React.Key) => {
            const cellValue = customer[columnKey as keyof TopSpender];

            switch (columnKey) {
                case "name":
                    return (
                        <span className="whitespace-nowrap">
                            {cellValue.toString()}
                        </span>
                    );
                case "totalSpend":
                    return "₹" + customer.totalSpend;
                case "_id":
                    return (
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    customer._id.toString()
                                );
                                toast.success("Copied to clipboard");
                            }}
                        >
                            <Copy size={18} className="text-muted-foreground" />
                        </button>
                    );
                case "eligibleOn":
                    return format(
                        new Date(customer.eligibleOn),
                        "MMM d, yyyy hh:mm a"
                    );
                case "isSent":
                    return (
                        <div className="flex justify-center">
                            {customer.isSent ? (
                                <Badge
                                    className="capitalize"
                                    variant={"secondary"}
                                >
                                    Yes
                                </Badge>
                            ) : (
                                <Badge className="capitalize">No</Badge>
                            )}
                        </div>
                    );
                case "sendOffer":
                    return customer.isSent ? (
                        <div className="flex items-center justify-center">
                            <CheckCircle className="text-green-500 size-5" />
                        </div>
                    ) : (
                        <SendOffersDialog offerId={customer.offerId}>
                            <Button variant={"outline"} size={"sm"}>
                                <Whatsapp /> Send Offer
                            </Button>
                        </SendOffersDialog>
                    );
                default:
                    return cellValue;
            }
        },
        []
    );

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
            bottomContentPlacement="outside"
            bottomContent={bottomContent}
            classNames={{
                wrapper: "max-h-[382px] scrollbar-none border shadow-md px-3",
            }}
            topContent={
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-medium">Top Spenders</h1>
                        <p className="text-sm text-muted-foreground">
                            Top customers who spent more than ₹20,000 in one
                            week
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <DeleteExpiredSpendersDialog />
                        <SendOffersDialog offerId={"all"}>
                            <Button size="sm" variant={"outline"}>
                                <Whatsapp />
                                Send Offers to all
                            </Button>
                        </SendOffersDialog>
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
                            column.uid === "_id" || column.uid === "sendOffer"
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
                emptyContent={"No data found"}
                items={data?.customers || []}
                isLoading={isFetching || status === "pending"}
                loadingContent={<Loader2 className="animate-spin" />}
            >
                {(item: TopSpender) => (
                    <TableRow key={item._id}>
                        {(columnKey) => (
                            <TableCell>
                                {/* @ts-expect-error: columnKey is of type keyof GroceryDocument */}
                                {renderCell(item, columnKey)}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
