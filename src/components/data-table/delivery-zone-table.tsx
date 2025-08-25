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
import { Loader2 } from "lucide-react";
import DeleteDialog from "../dialog/delete-dialog";
import { DeliveryZoneDocument } from "@/models/types/delivery-zone";
import { useDeliveryZones } from "@/api-hooks/delivery-zone/get-delivery-zone";
import { deleteDeliveryZoneAction } from "@/actions/delivery-zone/delete-delivery-zone";
import AddDeliveryZoneDialog from "../dialog/add-delivery-zone-dialog";

export const columns = [
    { name: "POSTCODE", uid: "postcode" },
    { name: "CHARGE", uid: "deliveryCharge" },
    { name: "ACTIONS", uid: "actions" },
];

export default function DeliveryZoneTable() {
    const { data: deliveryZones, isPending } = useDeliveryZones();

    const renderCell = React.useCallback(
        (deliveryZone: DeliveryZoneDocument, columnKey: React.Key) => {
            const cellValue =
                deliveryZone[columnKey as keyof DeliveryZoneDocument];

            switch (columnKey) {
                case "deliveryCharge":
                    return (
                        <span className="text-right">
                            ₹{cellValue.toString()}
                        </span>
                    );
                case "actions":
                    return (
                        <div className="flex gap-2.5 items-center justify-center">
                            <DeleteDialog
                                id={deliveryZone._id}
                                action={deleteDeliveryZoneAction}
                                errorMsg="Failed to delete delivery zone."
                                loadingMsg="Deleting delivery zone..."
                                successMsg="Delivery zone deleted successfully."
                                title="delivery zone"
                                queryKey={["delivery-zones"]}
                            />
                        </div>
                    );
                default:
                    return cellValue;
            }
        },
        []
    );

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex flex-1 gap-2 justify-end">
                        <AddDeliveryZoneDialog
                            deliveryZones={deliveryZones || []}
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total {deliveryZones?.length} delivery zones
                    </span>
                </div>
            </div>
        );
    }, [deliveryZones]);

    return (
        <Table
            isHeaderSticky
            aria-label="Example table with custom cells, pagination and sorting"
            classNames={{
                wrapper: "max-h-[382px] scrollbar-none border shadow-md px-3",
            }}
            className="col-span-3"
            topContent={topContent}
            topContentPlacement="outside"
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
                emptyContent={"No delivery zones found"}
                items={deliveryZones || []}
                isLoading={isPending}
                loadingContent={<Loader2 className="animate-spin" />}
            >
                {(item: DeliveryZoneDocument) => (
                    <TableRow key={item._id}>
                        {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
