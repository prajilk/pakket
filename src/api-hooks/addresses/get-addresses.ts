import axios from "@/config/axios.config";
import { AddressDocumentExtended } from "@/lib/types/address";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

async function getAddresses(page: number, search: string, signal: AbortSignal) {
    const { data } = await axios.get("/api/addresses", {
        params: { page, search },
        signal,
    });
    if (data && data.result)
        return data.result as {
            addresses: AddressDocumentExtended[];
            hasMore: boolean;
        } | null;
    return null;
}

export function useAddresses(page = 1, search = "") {
    return useQuery({
        queryKey: ["addresses", page, search],
        queryFn: ({ signal }) => getAddresses(page, search, signal),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // Cache remains fresh for 5 minutes
    });
}
