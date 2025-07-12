"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import LoadingButton from "../ui/loading-button";
import getQueryClient from "@/lib/query-utils/get-query-client";
import { approveOrderAction } from "@/actions/order/approve-order";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { useDeliveryBoy } from "@/api-hooks/delivery-zone/get-delivery-boy";

const ApproveOrderDialog = ({
    id,
    children,
}: {
    id: string;
    children: React.ReactNode;
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [boySelected, setBoySelected] = useState("");
    const queryClient = getQueryClient();

    const { data: boys, isPending } = useDeliveryBoy();

    function handleApprove() {
        setLoading(true);

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await approveOrderAction(id, boySelected);
                setLoading(false);
                queryClient.invalidateQueries({
                    queryKey: ["orders"],
                });
                setOpen(false);
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Approving orders...",
            success: () => "Orders approved successfully!",
            error: ({ error }) => (error ? error : "Failed to approve orders!"),
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Approve selected order?</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Do you want to approve this selected order for delivery. It
                    will send this order details to the delivery agent through
                    whatsapp.
                </DialogDescription>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Select
                        onValueChange={(value) => setBoySelected(value)}
                        value={boySelected}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {boys?.map((boy) => (
                                <SelectItem value={boy._id} key={boy._id}>
                                    {boy.name}{" "}
                                    <span className="text-xs text-muted-foreground">
                                        &#040;{boy.location}&#041;
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <LoadingButton
                        isLoading={loading}
                        onClick={handleApprove}
                        disabled={!boySelected || loading || isPending}
                    >
                        Approve
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ApproveOrderDialog;
