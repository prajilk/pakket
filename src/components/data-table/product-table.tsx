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
import { ListFilter, Loader2, Pencil, Plus, PlusCircle, X } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { useProducts } from "@/api-hooks/products/get-products";
import { ProductDocument } from "@/models/types/product";
import { Button as HeroButton } from "@heroui/button";
import {
    Dropdown,
    DropdownMenu,
    DropdownTrigger,
    DropdownItem,
} from "@heroui/dropdown";
import { useDebounce } from "@/hooks/use-debounce";
import DeleteDialog from "../dialog/delete-dialog";
import { deleteProductAction } from "@/actions/product/delete-product";

export const columns = [
    { name: "ID", uid: "_id" },
    { name: "THUMBNAIL", uid: "thumbnail" },
    { name: "TITLE", uid: "title" },
    { name: "CATEGORY", uid: "category" },
    { name: "DESCRIPTION", uid: "description" },
    { name: "IMAGES", uid: "images" },
    { name: "OPTIONS", uid: "options" },
    { name: "DISABLED", uid: "disabled" },
    { name: "ACTIONS", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
    "thumbnail",
    "title",
    "category",
    "options",
    "disabled",
    "actions",
];

export default function ProductsTable() {
    const [filterValue, setFilterValue] = React.useState("");
    const [page, setPage] = React.useState(1);
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const debounceSearch = useDebounce(filterValue, 500);

    const { data, status, isFetching, isPlaceholderData } = useProducts(
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
        (product: ProductDocument, columnKey: React.Key) => {
            const cellValue = product[columnKey as keyof ProductDocument];

            switch (columnKey) {
                case "thumbnail":
                    return (
                        <img
                            src={product.thumbnail.url}
                            alt={product.title}
                            width={50}
                            height={50}
                        />
                    );
                case "options":
                    return (
                        <div>
                            <ul className="grid grid-cols-4 gap-1 bg-gray-100 border">
                                <li className="border-r p-0.5">Unit</li>
                                <li className="border-r p-0.5">Base Price</li>
                                <li className="border-r p-0.5">Offer Price</li>
                                <li className="p-0.5">In Stock</li>
                            </ul>
                            {product.options.map((option, i) => (
                                <ul
                                    key={i}
                                    className="grid grid-cols-4 gap-1 border"
                                >
                                    <li className="border-r p-0.5">
                                        {option.unit}
                                    </li>
                                    <li className="border-r p-0.5">
                                        ₹{option.basePrice}
                                    </li>
                                    <li className="border-r p-0.5">
                                        ₹{option.offerPrice}
                                    </li>
                                    <li className="p-0.5">
                                        {option.inStock ? "Yes" : "No"}
                                    </li>
                                </ul>
                            ))}
                        </div>
                    );
                // case "basePrice":
                //     return `₹${cellValue}`;
                // case "offerPrice":
                //     return `₹${cellValue}`;
                // case "inStock":
                //     return cellValue ? (
                //         <Badge className="rounded-full">Yes</Badge>
                //     ) : (
                //         <Badge className="rounded-full" variant={"destructive"}>
                //             No
                //         </Badge>
                //     );
                case "images":
                    return (
                        <div className="flex flex-wrap gap-1">
                            {product.images.map((image) => (
                                <Link
                                    href={image.url}
                                    key={image.url}
                                    target="_blank"
                                >
                                    <img
                                        src={image.url}
                                        alt={product.title}
                                        width={30}
                                        height={30}
                                    />
                                </Link>
                            ))}
                        </div>
                    );
                case "disabled":
                    return cellValue ? (
                        <Badge className="rounded-full">Yes</Badge>
                    ) : (
                        <Badge className="rounded-full" variant={"secondary"}>
                            No
                        </Badge>
                    );
                case "actions":
                    return (
                        <div className="flex gap-2.5 items-center justify-center">
                            <Button
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
                            </Button>
                            <DeleteDialog
                                id={product._id}
                                action={deleteProductAction}
                                errorMsg="Failed to delete product."
                                loadingMsg="Deleting product..."
                                successMsg="Product deleted successfully."
                                title="product"
                                queryKey={["products"]}
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
                        placeholder="Search by product"
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
                        <Button
                            size={"sm"}
                            className="flex items-center gap-2"
                            asChild
                        >
                            <Link href={"/dashboard/products/add"}>
                                <Plus />
                                Add product
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-default-400 text-small">
                        Total {data?.products.length} products
                    </span>
                </div>
            </div>
        );
    }, [
        filterValue,
        onSearchChange,
        data?.products.length,
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
    }, [page, data?.hasMore]);

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
                emptyContent={"No products found"}
                items={data?.products || []}
                isLoading={isFetching || status === "pending"}
                loadingContent={<Loader2 className="animate-spin" />}
            >
                {(item: ProductDocument) => (
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
