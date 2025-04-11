import axios from "@/config/axios.config";
import { OrderTableDocument } from "@/lib/types/order";
import { headers } from "next/headers";

export async function getOrdersServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/orders", {
        params: {
            page: 1,
            statusFilter: ["all"],
            search: "",
        },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    if (data && data.result)
        return data.result as {
            orders: OrderTableDocument[];
            hasMore: boolean;
        } | null;
}
