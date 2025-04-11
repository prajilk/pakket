import axios from "@/config/axios.config";
import { OrderTableDocument } from "@/lib/types/order";
import { headers } from "next/headers";

export async function getRecentOrdersServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/orders/recent", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    if (data && data.result) return data.result as OrderTableDocument[] | null;
}
