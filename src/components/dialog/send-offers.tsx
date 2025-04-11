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
import { sendOfferAction } from "@/actions/offers/send-offer-notification";

const SendOffersDialog = ({
    offerId,
    children,
}: {
    offerId: string;
    children: React.ReactNode;
}) => {
    const [loading, setLoading] = useState(false);
    const queryClient = getQueryClient();

    function handleSubmit() {
        setLoading(true);

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await sendOfferAction(offerId);
                setLoading(false);
                queryClient.invalidateQueries({
                    queryKey: ["customers", "top-spenders"],
                });
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Sending offer notification...",
            success: () => "Offer notification sent successfully!",
            error: ({ error }) => (error ? error : "Failed to send offer!"),
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Send offer notification to customer?
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Do you want to send offer notification to customer through
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
                    <LoadingButton isLoading={loading} onClick={handleSubmit}>
                        Continue
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SendOffersDialog;
