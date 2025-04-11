import axios from "@/config/axios.config";
import { OrderTableDocument } from "@/lib/types/order";
import { useQuery } from "@tanstack/react-query";

async function getOrders(signal: AbortSignal) {
    const { data } = await axios.get("/api/orders/recent", {
        signal,
    });
    if (data && data.result) return data.result as OrderTableDocument[] | null;
    return null;
}

export function useRecentOrders() {
    return useQuery({
        queryKey: ["orders", "recent"],
        queryFn: ({ signal }) => getOrders(signal),
        staleTime: 1 * 60 * 1000, // Cache remains fresh for 1 minutes
    });
}
