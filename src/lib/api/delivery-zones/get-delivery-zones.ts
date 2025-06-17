import axios from "@/config/axios.config";
import { DeliveryZoneDocument } from "@/models/types/delivery-zone";
import { headers } from "next/headers";

export async function getDeliveryZonesServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/delivery-zones", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    if (data && data.result)
        return data.result as DeliveryZoneDocument[] | null;
}
