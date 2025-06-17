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
import { ListFilter, Loader2, PlusCircle, RotateCw } from "lucide-react";
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
import { UserDocument } from "@/models/types/user";
import { useCustomers } from "@/api-hooks/customers/get-customers";
import { format } from "date-fns";
import { deleteCustomerAction } from "@/actions/customer/delete-customer";
import getQueryClient from "@/lib/query-utils/get-query-client";

export const columns = [
    { name: "ID", uid: "_id" },
    { name: "NAME", uid: "name" },
    { name: "PHONE", uid: "phone" },
    { name: "EMAIL", uid: "email" },
    { name: "ACCOUNT CREATED", uid: "createdAt" },
    { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
    "name",
    "phone",
    "email",
    "createdAt",
    "actions",
];

export default function CustomersTable() {
    const [filterValue, setFilterValue] = React.useState("");
    const [page, setPage] = React.useState(1);
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );

    const queryClient = getQueryClient();

    const debounceSearch = useDebounce(filterValue, 500);

    const { data, status, isFetching, isPlaceholderData } = useCustomers(
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
        (user: UserDocument, columnKey: React.Key) => {
            const cellValue = user[columnKey as keyof UserDocument];

            switch (columnKey) {
                case "name":
                    return (
                        <span className="whitespace-nowrap">
                            {cellValue?.toString()}
                        </span>
                    );
                case "createdAt":
                    return format(new Date(cellValue || ""), "PPP");
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
                                id={user._id}
                                action={deleteCustomerAction}
                                errorMsg="Failed to remove customer."
                                loadingMsg="Removing customer..."
                                successMsg="Customer removed successfully."
                                title="customer"
                                queryKey={["customers"]}
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
                        placeholder="Search by name, phone or email"
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
                        <HeroButton
                            startContent={<RotateCw className="size-4" />}
                            size="sm"
                            variant="bordered"
                            className="bg-white border border-dashed rounded-md shadow-sm h-9"
                            onPress={() =>
                                queryClient.invalidateQueries({
                                    queryKey: ["customers"],
                                })
                            }
                        >
                            Refresh data
                        </HeroButton>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-default-400 text-small">
                        Total {data?.customers.length} customers
                    </span>
                </div>
            </div>
        );
    }, [
        filterValue,
        onSearchChange,
        data?.customers.length,
        onClear,
        visibleColumns,
        queryClient,
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
                emptyContent={"No customers found"}
                items={data?.customers || []}
                isLoading={isFetching || status === "pending"}
                loadingContent={<Loader2 className="animate-spin" />}
            >
                {(item: UserDocument) => (
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
