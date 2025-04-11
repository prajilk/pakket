import axios from "@/config/axios.config";
import { PendingOrderTableDocument } from "@/lib/types/order";
import { useQuery } from "@tanstack/react-query";

async function getOrders(limit: number, signal: AbortSignal) {
    const { data } = await axios.get("/api/orders/pending", {
        params: { limit },
        signal,
    });
    if (data && data.result)
        return data.result as PendingOrderTableDocument[] | null;
    return null;
}

export function usePendingOrders(limit = 0) {
    return useQuery({
        queryKey: ["orders", "pending", limit],
        queryFn: ({ signal }) => getOrders(limit, signal),
        staleTime: 1 * 60 * 1000, // Cache remains fresh for 1 minutes
    });
}
