"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { updateStatusAction } from "@/actions/order/update-status";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

const UpdateStatus = ({ status, id }: { status: string; id: string }) => {
    const [loading, setLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(status);

    // Sync prop with local state if it changes externally
    useEffect(() => {
        setCurrentStatus(status);
    }, [status]);

    const queryClient = useQueryClient();

    async function updateStatus(
        id: string,
        newStatus: "pending" | "ongoing" | "delivered" | "cancelled"
    ) {
        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await updateStatusAction(id, newStatus);
                setLoading(false);
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Updating order status...",
            success: () => {
                queryClient.invalidateQueries({ queryKey: ["orders"] });
                return "Order status updated successfully.";
            },
            error: () => "Failed to update order status.",
        });
    }
    return (
        <Select
            value={currentStatus}
            onValueChange={(value) =>
                updateStatus(id, value as "pending" | "ongoing" | "delivered")
            }
        >
            <SelectTrigger
                className="h-8 w-32 text-[0.8rem] capitalize"
                disabled={loading}
            >
                <SelectValue placeholder="Update status" />
            </SelectTrigger>
            <SelectContent>
                {["pending", "ongoing", "delivered", "cancelled"].map(
                    (value) => (
                        <SelectItem
                            key={value}
                            value={value}
                            className={`capitalize ${
                                value === "cancelled" && "text-red-500"
                            }`}
                        >
                            {value}
                        </SelectItem>
                    )
                )}
            </SelectContent>
        </Select>
    );
};

export default UpdateStatus;
