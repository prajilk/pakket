import axios from "@/config/axios.config";
import { DeliveryBoyDocument } from "@/models/types/delivery-zone";
import { headers } from "next/headers";

export async function getDeliveryBoyServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/delivery-boy", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    if (data && data.result) return data.result as DeliveryBoyDocument[] | null;
}
