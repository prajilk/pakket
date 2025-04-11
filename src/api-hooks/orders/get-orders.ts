import axios from "@/config/axios.config";
import { OrderTableDocument } from "@/lib/types/order";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

async function getOrders(
    page: number,
    statusFilter: string[],
    date: Date | "all",
    search: string,
    signal: AbortSignal
) {
    const dateParams =
        date === "all" ? {} : { date: format(date, "yyyy-MM-dd") };
    const { data } = await axios.get("/api/orders", {
        params: {
            page,
            statusFilter: statusFilter.join(","),
            search,
            ...dateParams,
        },
        signal,
    });
    if (data && data.result)
        return data.result as {
            orders: OrderTableDocument[];
            hasMore: boolean;
        } | null;
    return null;
}

export function useOrders(
    page = 1,
    statusFilter: string[] = [],
    date: Date | "all",
    search = ""
) {
    const dateKey = date === "all" ? [] : [format(date, "yyyy-MM-dd")];
    return useQuery({
        queryKey: ["orders", page, statusFilter, ...dateKey, search],
        queryFn: ({ signal }) =>
            getOrders(page, statusFilter, date, search, signal),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // Cache remains fresh for 5 minutes
    });
}
