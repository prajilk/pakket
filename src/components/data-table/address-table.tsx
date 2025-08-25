"use client";

import React from "react";
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
    ListFilter,
    Loader2,
    PlusCircle,
    SquareArrowOutUpRight,
    Trash2,
    TriangleAlert,
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
import { Badge } from "../ui/badge";
import Link from "next/link";
import { useAddresses } from "@/api-hooks/addresses/get-addresses";
import { AddressDocumentExtended } from "@/lib/types/address";
import DeleteDialog from "../dialog/delete-dialog";
import { deleteAddressAction } from "@/actions/address/delete-address";
import { deleteAllDeletedAddressesAction } from "@/actions/address/delete-all-deleted-address";
import { toast } from "sonner";
import getQueryClient from "@/lib/query-utils/get-query-client";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const columns = [
    { name: "ID", uid: "_id" },
    { name: "CUSTOMER", uid: "user" },
    { name: "ADDRESS", uid: "address" },
    { name: "PHONE", uid: "phone" },
    { name: "LOCALITY", uid: "locality" },
    { name: "FLOOR", uid: "floor" },
    { name: "LANDMARK", uid: "landmark" },
    { name: "IS DELETED", uid: "isDeleted" },
    { name: "LOCATION", uid: "location" },
    { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
    "user",
    "address",
    "phone",
    "locality",
    "isDeleted",
    "location",
    "actions",
];

export default function AddressesTable() {
    const [filterValue, setFilterValue] = React.useState("");
    const [page, setPage] = React.useState(1);
    const [loading, setLoading] = React.useState(false);
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );

    const debounceSearch = useDebounce(filterValue, 500);

    const { data, status, isFetching, isPlaceholderData } = useAddresses(
        page,
        debounceSearch
    );

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns]);

    const queryClient = getQueryClient();

    const handleDeleteAll = React.useCallback(() => {
        setLoading(true);

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await deleteAllDeletedAddressesAction();
                setLoading(false);
                queryClient.invalidateQueries({
                    queryKey: ["addresses"],
                });
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Deleting all deleted addresses...",
            success: () => "Deleted all deleted addresses",
            error: ({ error }) =>
                error ? error : "Failed to delete addresses",
        });
    }, [queryClient]);

    const renderCell = React.useCallback(
        (address: AddressDocumentExtended, columnKey: React.Key) => {
            const cellValue =
                address[columnKey as keyof AddressDocumentExtended];

            switch (columnKey) {
                case "user":
                    return (
                        <span className="whitespace-nowrap">
                            {cellValue?.toString()}
                        </span>
                    );
                case "isDeleted":
                    return cellValue ? (
                        <Badge className="rounded-full" variant={"destructive"}>
                            Yes
                        </Badge>
                    ) : (
                        <Badge className="rounded-full">No</Badge>
                    );
                case "location":
                    return address.location ? (
                        <Link
                            href={address.location}
                            target="_blank"
                            className="flex justify-center w-full"
                        >
                            <SquareArrowOutUpRight className="size-4" />
                        </Link>
                    ) : (
                        <Tooltip>
                            <TooltipTrigger>
                                <TriangleAlert className="size-5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                Pin location is not available!
                            </TooltipContent>
                        </Tooltip>
                    );
                case "actions":
                    return (
                        <div className="flex gap-2.5 items-center justify-center">
                            <DeleteDialog
                                id={address._id}
                                action={deleteAddressAction}
                                errorMsg="Failed to delete address."
                                loadingMsg="Deleting address..."
                                successMsg="Address deleted successfully."
                                title="address"
                                queryKey={["addresses"]}
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
                <div className="flex flex-wrap gap-3 items-end">
                    <Input
                        isClearable
                        className="md:max-w-80"
                        classNames={{
                            inputWrapper: "rounded-md bg-white border h-9",
                        }}
                        size="sm"
                        placeholder="Search by customer or phone"
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
                        <DropdownTrigger>
                            <HeroButton
                                startContent={
                                    <PlusCircle className="w-4 h-4" />
                                }
                                size="sm"
                                variant="bordered"
                                className="h-9 bg-white rounded-md border border-dashed shadow-sm"
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
                    <div className="flex flex-1 gap-2 justify-end">
                        <Button
                            size={"sm"}
                            className="flex gap-2 items-center"
                            onClick={handleDeleteAll}
                            disabled={loading}
                        >
                            <Trash2 />
                            Delete all deleted addresses
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total {data?.addresses.length} addresses
                    </span>
                </div>
            </div>
        );
    }, [
        filterValue,
        onSearchChange,
        handleDeleteAll,
        loading,
        data?.addresses.length,
        onClear,
        visibleColumns,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="flex gap-2 justify-end">
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
                wrapper: "max-h-[382px] scrollbar-none border shadow-md px-3",
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
                emptyContent={"No addresses found"}
                items={data?.addresses || []}
                isLoading={isFetching || status === "pending"}
                loadingContent={<Loader2 className="animate-spin" />}
            >
                {(item: AddressDocumentExtended) => (
                    <TableRow key={item._id}>
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
