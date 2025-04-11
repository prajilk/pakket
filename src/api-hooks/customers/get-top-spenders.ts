import axios from "@/config/axios.config";
import { TopSpender } from "@/lib/types/customer";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

async function getCustomers(page: number, signal: AbortSignal) {
    const { data } = await axios.get("/api/customers/top-spenders", {
        params: { page },
        signal,
    });
    if (data && data.result)
        return data.result as {
            customers: TopSpender[];
            hasMore: boolean;
        } | null;
    return null;
}

export function useTopSpenders(page = 1) {
    return useQuery({
        queryKey: ["customers", "top-spenders", page],
        queryFn: ({ signal }) => getCustomers(page, signal),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // Cache remains fresh for 5 minutes
    });
}
