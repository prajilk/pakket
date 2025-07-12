"use client";

import { deleteDeliveryBoyAction } from "@/actions/delivery-zone/delete-delivery-boy";
import DeleteDialog from "../dialog/delete-dialog";
import { Button } from "@heroui/button";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useDeliveryBoy } from "@/api-hooks/delivery-zone/get-delivery-boy";
import AddDeliveryBoyDialog from "../dialog/add-delivery-boy";
import EditDeliveryBoyDialog from "../dialog/edit-delivery-boy";

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
            {deliveryBoy?.length === 0 ? (
                <div className="flex flex-col gap-2 items-center my-6 text-lg">
                    Add delivery boy details
                    <AddDeliveryBoyDialog>
                        <Button isIconOnly radius="full" variant="flat">
                            <Plus />
                        </Button>
                    </AddDeliveryBoyDialog>
                </div>
            ) : (
                <div className="w-full">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">
                            Delivery boy details:
                        </span>
                        <AddDeliveryBoyDialog>
                            <Button size="sm" className="text-white bg-black">
                                Add new
                            </Button>
                        </AddDeliveryBoyDialog>
                    </div>
                    <ul className="pt-3 space-y-2 text-sm">
                        {deliveryBoy?.map((boy) => (
                            <li
                                key={boy._id}
                                className="flex justify-between px-3 py-2 rounded-md border shadow"
                            >
                                <div className="flex flex-col gap-1">
                                    <span>
                                        Name:{" "}
                                        <span className="font-semibold">
                                            {boy?.name}
                                        </span>
                                    </span>
                                    <span className="text-xs">
                                        Phone: <span>{boy.phone}</span>
                                    </span>
                                    <span className="text-xs">
                                        Location:{" "}
                                        <span>{boy.location || "N/A"}</span>
                                    </span>
                                </div>
                                <div>
                                    <EditDeliveryBoyDialog
                                        id={boy._id.toString()}
                                        name={boy.name}
                                        phone={boy.phone}
                                        location={boy.location}
                                    >
                                        <button>
                                            <Pencil
                                                size={15}
                                                className="text-gray-500 stroke-2"
                                            />
                                        </button>
                                    </EditDeliveryBoyDialog>
                                    <DeleteDialog
                                        id={boy._id.toString()}
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
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DeliveryBoy;
