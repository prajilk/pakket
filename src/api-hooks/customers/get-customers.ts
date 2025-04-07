import axios from "@/config/axios.config";
import { UserDocument } from "@/models/types/user";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

async function getCustomers(page: number, search: string, signal: AbortSignal) {
    const { data } = await axios.get("/api/customers", {
        params: { page, search },
        signal,
    });
    if (data && data.result)
        return data.result as {
            customers: UserDocument[];
            hasMore: boolean;
        } | null;
    return null;
}

export function useCustomers(page = 1, search = "") {
    return useQuery({
        queryKey: ["customers", page, search],
        queryFn: ({ signal }) => getCustomers(page, search, signal),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // Cache remains fresh for 5 minutes
    });
}
