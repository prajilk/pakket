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
import { Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "@heroui/button";
import { addDeliveryBoyAction } from "@/actions/delivery-zone/add-delivery-boy";

const AddDeliveryBoyDialog = () => {
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
                const result = await addDeliveryBoyAction(formData);
                setLoading(false);
                queryClient.invalidateQueries({
                    queryKey: ["delivery-boy"],
                });
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Adding delivery boy...",
            success: () => "Delivery boy added successfully!",
            error: ({ error }) =>
                error ? error : "Failed to add delivery boy!",
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button isIconOnly radius="full" variant="flat">
                    <Plus />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add delivery boy</DialogTitle>
                </DialogHeader>
                <form
                    id="add-delivery-boy-form"
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
                        />
                    </div>
                </form>
                <DialogFooter className="flex justify-end">
                    <LoadingButton
                        isLoading={loading}
                        size={"sm"}
                        type="submit"
                        form="add-delivery-boy-form"
                    >
                        Add
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddDeliveryBoyDialog;
