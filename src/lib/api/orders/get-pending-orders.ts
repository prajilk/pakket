import axios from "@/config/axios.config";
import { PendingOrderTableDocument } from "@/lib/types/order";
import { headers } from "next/headers";

export async function getPendingOrdersServer(limit = 0) {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/orders/pending", {
        params: { limit },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    if (data && data.result)
        return data.result as PendingOrderTableDocument[] | null;
}
