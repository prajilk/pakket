"use client";

import { deleteDeliveryBoyAction } from "@/actions/delivery-zone/delete-delivery-boy";
import DeleteDialog from "../dialog/delete-dialog";
import { Button } from "@heroui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useDeliveryBoy } from "@/api-hooks/delivery-zone/get-delivery-boy";
import AddDeliveryBoyDialog from "../dialog/add-delivery-boy";

const DeliveryBoy = () => {
    const { data: deliveryBoy, isPending } = useDeliveryBoy();
    if (isPending) {
        <div className="flex col-span-3 justify-center items-center p-6 bg-white rounded-xl border shadow-md md:col-span-2 h-fit">
            <div className="flex justify-center items-center">
                <Loader2 className="animate-spin" />
            </div>
        </div>;
    }
    return (
        <div className="flex col-span-3 justify-center items-center p-6 bg-white rounded-xl border shadow-md md:col-span-2 h-fit">
            {!deliveryBoy ? (
                <div className="flex flex-col gap-2 items-center my-6 text-lg">
                    Add delivery boy details
                    <AddDeliveryBoyDialog />
                </div>
            ) : (
                <div className="w-full">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">
                            Delivery boy details:
                        </span>
                        <DeleteDialog
                            id={deliveryBoy._id.toString()}
                            action={deleteDeliveryBoyAction}
                            errorMsg="Failed to delete delivery boy."
                            loadingMsg="Deleting delivery boy..."
                            successMsg="Delivery boy deleted successfully."
                            title="delivery boy"
                            queryKey={["delivery-boy"]}
                        >
                            <Button
                                isIconOnly
                                size="sm"
                                radius="full"
                                variant="light"
                                color="danger"
                            >
                                <Trash2 size={15} />
                            </Button>
                        </DeleteDialog>
                    </div>
                    <ul className="pt-3 space-y-2 text-sm">
                        <li>
                            Name: <b>{deliveryBoy.name}</b>
                        </li>
                        <li>
                            Phone: <b>{deliveryBoy.phone}</b>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DeliveryBoy;
