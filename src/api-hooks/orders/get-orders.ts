import axios from "@/config/axios.config";
import { OrderTableDocument } from "@/lib/types/order";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

async function getOrders(
    page: number,
    statusFilter: string[],
    search: string,
    signal: AbortSignal
) {
    const { data } = await axios.get("/api/orders", {
        params: { page, statusFilter: statusFilter.join(","), search },
        signal,
    });
    if (data && data.result)
        return data.result as {
            orders: OrderTableDocument[];
            hasMore: boolean;
        } | null;
    return null;
}

export function useOrders(page = 1, statusFilter: string[] = [], search = "") {
    return useQuery({
        queryKey: ["orders", page, statusFilter, search],
        queryFn: ({ signal }) => getOrders(page, statusFilter, search, signal),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // Cache remains fresh for 5 minutes
    });
}
