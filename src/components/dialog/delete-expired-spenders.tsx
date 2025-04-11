import { Trash2 } from "lucide-react";
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
import { deleteExpiredOfferAction } from "@/actions/offers/delete-expired-offer";

const DeleteExpiredSpendersDialog = () => {
    const [loading, setLoading] = useState(false);
    const queryClient = getQueryClient();

    function handleDeleteExpired() {
        setLoading(true);

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await deleteExpiredOfferAction();
                setLoading(false);
                queryClient.invalidateQueries({
                    queryKey: ["customers", "top-spenders"],
                });
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Deleting offers...",
            success: () => "Offers deleted successfully!",
            error: ({ error }) => (error ? error : "Failed to delete offers!"),
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant={"outline"} disabled={loading}>
                    <Trash2 className="text-red-500" />
                    Delete expired
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription className="text-sm">
                        This action cannot be undone. This will permanently
                        delete all expired offers from the server.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button
                            variant="ghost"
                            className="bg-destructive/10 text-destructive hover:bg-destructive/30 hover:text-destructive"
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <LoadingButton
                        isLoading={loading}
                        onClick={handleDeleteExpired}
                    >
                        Continue
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteExpiredSpendersDialog;
