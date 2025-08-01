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
import { Button } from "../ui/button";
import LoadingButton from "../ui/loading-button";
import getQueryClient from "@/lib/query-utils/get-query-client";
import { Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { addDeliveryZoneAction } from "@/actions/delivery-zone/add-delivery-zone";
import { DeliveryZoneDocument } from "@/models/types/delivery-zone";

const AddDeliveryZoneDialog = ({
    deliveryZones,
}: {
    deliveryZones: DeliveryZoneDocument[];
}) => {
    const [loading, setLoading] = useState(false);
    const queryClient = getQueryClient();

    function handleSubmit(formData: FormData) {
        setLoading(true);

        const data = Object.fromEntries(formData);

        if (deliveryZones.find((zone) => zone.postcode === data.postcode)) {
            toast.error(
                "Delivery zone already exists! Please delete the existing one and try again."
            );
            setLoading(false);
            return;
        }

        if ((data.postcode as string)?.length !== 6) {
            toast.error("Invalid postcode.");
            setLoading(false);
            return;
        }

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await addDeliveryZoneAction(formData);
                setLoading(false);
                queryClient.invalidateQueries({
                    queryKey: ["delivery-zones"],
                });
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Adding delivery zone...",
            success: () => "Delivery zone added successfully!",
            error: ({ error }) =>
                error ? error : "Failed to add delivery zone!",
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={"sm"} className="flex gap-2 items-center">
                    <Plus />
                    Add delivery zone
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add new delivery zone</DialogTitle>
                </DialogHeader>
                <form
                    id="add-delivery-zone-form"
                    action={handleSubmit}
                    className="grid gap-4 py-4"
                >
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="postcode" className="text-right">
                            Postcode
                        </Label>
                        <Input
                            placeholder="Postcode / Zip code"
                            name="postcode"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="deliveryCharge" className="text-right">
                            Delivery charge
                        </Label>
                        <Input
                            placeholder="Delivery charge (optional)"
                            name="deliveryCharge"
                            className="col-span-3"
                            type="number"
                            min="0"
                        />
                    </div>
                </form>
                <DialogFooter className="flex justify-end">
                    <LoadingButton
                        isLoading={loading}
                        size={"sm"}
                        type="submit"
                        form="add-delivery-zone-form"
                    >
                        Add
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddDeliveryZoneDialog;
