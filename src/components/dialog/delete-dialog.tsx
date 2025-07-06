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
import { ReactNode, useState } from "react";
import { Button } from "../ui/button";
import LoadingButton from "../ui/loading-button";
import getQueryClient from "@/lib/query-utils/get-query-client";

const DeleteDialog = ({
    id,
    action,
    loadingMsg,
    successMsg,
    errorMsg,
    title,
    children,
    queryKey,
}: {
    id: string;
    action: (
        id: string,
        heroBanner?: boolean
    ) => Promise<
        | {
              success: boolean;
              error?: undefined;
          }
        | {
              error: unknown;
              success?: undefined;
          }
    >;
    loadingMsg: string;
    successMsg: string;
    errorMsg: string;
    title: string;
    children?: ReactNode;
    queryKey: (string | number)[];
}) => {
    const [loading, setLoading] = useState(false);
    const queryClient = getQueryClient();

    function handleSubmit() {
        setLoading(true);

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await action(id);
                setLoading(false);
                queryClient.invalidateQueries({ queryKey });
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: loadingMsg,
            success: () => successMsg,
            error: ({ error }) => (error ? error : errorMsg),
        });
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <button>
                        <Trash2 size={18} className="stroke-2 text-danger" />
                    </button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription className="text-sm">
                        This action cannot be undone. This will permanently
                        delete this {title} from the server.
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
                    <LoadingButton isLoading={loading} onClick={handleSubmit}>
                        Continue
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteDialog;
