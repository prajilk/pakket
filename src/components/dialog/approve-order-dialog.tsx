"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "../ui/button";
import LoadingButton from "../ui/loading-button";
import getQueryClient from "@/lib/query-utils/get-query-client";
import { approveOrderAction } from "@/actions/order/approve-order";

const ApproveOrderDialog = ({
    id,
    children,
}: {
    id: string;
    children: React.ReactNode;
}) => {
    const [loading, setLoading] = useState(false);
    const queryClient = getQueryClient();

    function handleApprove() {
        setLoading(true);

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await approveOrderAction(id);
                setLoading(false);
                queryClient.invalidateQueries({
                    queryKey: ["orders"],
                });
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
        <Dialog>
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
                    <DialogClose asChild>
                        <Button
                            variant="ghost"
                            className="bg-destructive/10 text-destructive hover:bg-destructive/30 hover:text-destructive"
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <LoadingButton isLoading={loading} onClick={handleApprove}>
                        Approve
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ApproveOrderDialog;
