"use client";

import React, { useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { Loader2, Plus } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import DeleteDialog from "../dialog/delete-dialog";
import { HeroBannerDocument } from "@/models/types/hero-banner";
import { useHeroBanners } from "@/api-hooks/offers/get-hero-banner";
import { Switch } from "../ui/switch";
import { deleteHeroBannerAction } from "@/actions/offers/delete-hero-banner";
import { toast } from "sonner";
import { disableHeroBannerAction } from "@/actions/offers/disable-hero-banner";
import getQueryClient from "@/lib/query-utils/get-query-client";

export const columns = [
    { name: "BANNER", uid: "banner" },
    { name: "CATEGORY", uid: "category" },
    { name: "DISABLED", uid: "disabled" },
    { name: "ACTIONS", uid: "actions" },
];

export default function HeroBannersTable() {
    const { data: banners, isPending } = useHeroBanners();
    const [statusLoading, setStatusLoading] = useState(false);

    const queryClient = getQueryClient();

    const handleChecked = React.useCallback(
        async (value: boolean, id: string) => {
            const promise = () =>
                new Promise(async (resolve, reject) => {
                    const result = await disableHeroBannerAction(id, value);
                    setStatusLoading(false);
                    if (result.success) resolve(result);
                    else reject(result);
                });

            toast.promise(promise, {
                loading: "Updating banner...",
                success: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["hero-banners"],
                    });
                    return `Successfully ${
                        value ? "disabled" : "enabled"
                    } banner`;
                },
                error: () => "Failed to update banner",
            });
        },
        [queryClient]
    );

    const renderCell = React.useCallback(
        (banner: HeroBannerDocument, columnKey: React.Key) => {
            const cellValue = banner[columnKey as keyof HeroBannerDocument];

            switch (columnKey) {
                case "category":
                    return (
                        <div className="flex gap-1 items-center">
                            <span>{banner.categoryName}</span>
                        </div>
                    );
                case "banner":
                    return (
                        <img
                            src={banner.banner.url}
                            alt={banner.name}
                            width={50}
                            height={50}
                        />
                    );
                case "disabled":
                    return (
                        <div className="flex gap-1 items-center">
                            {cellValue ? (
                                <Badge className="rounded-full">Yes</Badge>
                            ) : (
                                <Badge
                                    className="rounded-full"
                                    variant={"secondary"}
                                >
                                    No
                                </Badge>
                            )}
                            <Switch
                                onCheckedChange={(value) =>
                                    handleChecked(value, banner._id)
                                }
                                defaultChecked={banner.disabled || false}
                                disabled={statusLoading}
                            />
                        </div>
                    );
                case "actions":
                    return (
                        <div className="flex gap-2.5 items-center justify-center">
                            <DeleteDialog
                                id={banner._id}
                                action={deleteHeroBannerAction}
                                errorMsg="Failed to delete banner."
                                loadingMsg="Deleting banner..."
                                successMsg="Banner deleted successfully."
                                title="banner"
                                queryKey={["hero-banners"]}
                            />
                        </div>
                    );
                default:
                    return cellValue;
            }
        },
        [handleChecked, statusLoading]
    );

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-3 items-center">
                    <h1 className="text-xl font-medium">Hero Banners</h1>
                    <div className="flex flex-1 gap-2 justify-end">
                        <Button
                            size={"sm"}
                            className="flex gap-2 items-center"
                            asChild
                        >
                            <Link href={"/dashboard/offers/create-hero-banner"}>
                                <Plus />
                                Add banner
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total {banners?.length} banners
                    </span>
                </div>
            </div>
        );
    }, [banners?.length]);

    return (
        <Table
            isHeaderSticky
            aria-label="Example table with custom cells, pagination and sorting"
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
                emptyContent={"No banners found"}
                items={banners || []}
                isLoading={isPending}
                loadingContent={<Loader2 className="animate-spin" />}
            >
                {(item: HeroBannerDocument) => (
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
