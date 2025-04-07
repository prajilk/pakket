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
import { Input } from "@heroui/input";
import { ListFilter, Loader2, Pencil, Plus } from "lucide-react";
import { useCategories } from "@/api-hooks/category/get-categories";
import { Button } from "../ui/button";
import { CategoryDocument } from "@/models/types/category";
import Link from "next/link";
import { Badge } from "../ui/badge";
import DeleteDialog from "../dialog/delete-dialog";
import { deleteCategoryAction } from "@/actions/category/delete-category";

export const columns = [
    { name: "NAME", uid: "name" },
    { name: "ICON", uid: "icon" },
    { name: "IMAGE", uid: "image" },
    { name: "DISABLED", uid: "disabled" },
    { name: "ACTIONS", uid: "actions" },
];

export default function CategoryTable() {
    const [filterValue, setFilterValue] = React.useState("");

    const { data: categories, isPending } = useCategories();

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredCategories = categories ? [...categories] : [];

        if (hasSearchFilter) {
            filteredCategories = filteredCategories.filter((category) =>
                category.name.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredCategories;
    }, [categories, filterValue, hasSearchFilter]);

    const renderCell = React.useCallback(
        (category: CategoryDocument, columnKey: React.Key) => {
            const cellValue = category[columnKey as keyof CategoryDocument];

            switch (columnKey) {
                case "icon":
                    return (
                        <img
                            src={category.icon.url}
                            alt={category.name}
                            width={50}
                            height={50}
                        />
                    );
                case "image":
                    return (
                        <img
                            src={category.image.url}
                            alt={category.name}
                            width={50}
                            height={50}
                        />
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
                                    href={`/dashboard/categories/edit?id=${category._id}`}
                                >
                                    <Pencil />
                                </Link>
                            </Button>
                            <DeleteDialog
                                id={category._id}
                                action={deleteCategoryAction}
                                errorMsg="Failed to delete category."
                                loadingMsg="Deleting category..."
                                successMsg="Category deleted successfully."
                                title="category"
                                queryKey={["category"]}
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
                        placeholder="Search by category"
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
                    <div className="flex justify-end flex-1 gap-2">
                        <Button
                            size={"sm"}
                            className="flex items-center gap-2"
                            asChild
                        >
                            <Link href={"/dashboard/categories/add"}>
                                <Plus />
                                Add category
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-default-400 text-small">
                        Total {categories?.length} categories
                    </span>
                </div>
            </div>
        );
    }, [filterValue, onSearchChange, categories?.length, onClear]);

    return (
        <Table
            isHeaderSticky
            aria-label="Example table with custom cells, pagination and sorting"
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[382px] scrollbar-none border shadow-md px-3",
            }}
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
                emptyContent={"No categories found"}
                items={filteredItems}
                isLoading={isPending}
                loadingContent={<Loader2 className="animate-spin" />}
            >
                {(item: CategoryDocument) => (
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
