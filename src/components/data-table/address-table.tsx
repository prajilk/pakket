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
                    return (
                        <Link
                            href={address.location}
                            target="_blank"
                            className="flex justify-center w-full"
                        >
                            <SquareArrowOutUpRight className="size-4" />
                        </Link>
                    );
                case "actions":
                    return (
                        <div className="flex gap-2.5 items-center justify-center">
                            {/* <Button
                                size="sm"
                                variant={"ghost"}
                                className="rounded-full size-8"
                                asChild
                            >
                                <Link
                                    href={`/dashboard/products/edit?id=${product._id}`}
                                >
                                    <Pencil />
                                </Link>
                            </Button> */}
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
                <div className="flex flex-wrap items-end gap-3">
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
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-default-400 text-small">
                        Total {data?.addresses.length} addresses
                    </span>
                </div>
            </div>
        );
    }, [
        filterValue,
        onSearchChange,
        data?.addresses.length,
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
