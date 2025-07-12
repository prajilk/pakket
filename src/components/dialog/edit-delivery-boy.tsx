import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import LoadingButton from "../ui/loading-button";
import getQueryClient from "@/lib/query-utils/get-query-client";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { editDeliveryBoyAction } from "@/actions/delivery-zone/edit-delivery-boy";

const EditDeliveryBoyDialog = ({
    children,
    ...props
}: {
    children: React.ReactNode;
    id: string;
    name: string;
    phone: string;
    location: string;
}) => {
    const [loading, setLoading] = useState(false);
    const queryClient = getQueryClient();

    function handleSubmit(formData: FormData) {
        setLoading(true);

        const data = Object.fromEntries(formData);
        if (!data.name || (data.phone as string)?.length !== 10) {
            toast.error("Invalid data.");
            setLoading(false);
            return;
        }

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await editDeliveryBoyAction(props.id, formData);
                setLoading(false);
                queryClient.invalidateQueries({
                    queryKey: ["delivery-boy"],
                });
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Updating delivery boy...",
            success: () => "Delivery boy updated successfully!",
            error: ({ error }) =>
                error ? error : "Failed to updated delivery boy!",
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update delivery boy</DialogTitle>
                </DialogHeader>
                <form
                    id="edit-delivery-boy-form"
                    action={handleSubmit}
                    className="grid gap-4 py-4"
                >
                    <div className="flex flex-col gap-2 items-start">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            placeholder="Name"
                            name="name"
                            className="col-span-3"
                            defaultValue={props.name}
                        />
                    </div>
                    <div className="flex flex-col gap-2 items-start">
                        <Label htmlFor="phone" className="text-right">
                            WhatsApp Phone number
                        </Label>
                        <Input
                            placeholder="Don't include +91"
                            name="phone"
                            className="col-span-3"
                            defaultValue={props.phone}
                        />
                    </div>
                    <div className="flex flex-col gap-2 items-start">
                        <Label htmlFor="phone" className="text-right">
                            Location
                        </Label>
                        <Input
                            placeholder="Location"
                            name="location"
                            className="col-span-3"
                            defaultValue={props.location}
                        />
                    </div>
                </form>
                <DialogFooter className="flex justify-end">
                    <LoadingButton
                        isLoading={loading}
                        size={"sm"}
                        type="submit"
                        form="edit-delivery-boy-form"
                    >
                        Update
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditDeliveryBoyDialog;
