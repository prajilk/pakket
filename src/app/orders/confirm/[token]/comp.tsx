"use client";

import { confirmDeliveryAction } from "@/actions/delivery-zone/confirm-delivery";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const Component = ({ token }: { token: string }) => {
    const [loading, setLoading] = useState(false);

    function handleConfirmDelivery() {
        setLoading(true);
        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await confirmDeliveryAction(token);
                setLoading(false);
                if (result.success) resolve(result.message);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Confirming delivery...",
            success: (message) =>
                message
                    ? (message as string)
                    : "Delivery confirmed successfully!",
            error: ({ error }) =>
                error ? error : "Failed to confirm delivery!",
        });
    }
    return (
        <>
            <h1 className="text-xl font-semibold">Confirm Delivery</h1>
            <p className="max-w-sm text-center">
                Are you sure you want to mark this order as delivered?
            </p>
            <form action={handleConfirmDelivery}>
                <Button disabled={loading}>Mark as delivered</Button>
            </form>
        </>
    );
};

export default Component;
