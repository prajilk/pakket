import axios from "@/config/axios.config";
import { ProductDocument } from "@/models/types/product";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

async function getProducts(page: number, search: string, signal: AbortSignal) {
    const { data } = await axios.get("/api/products", {
        params: { page, search },
        signal,
    });
    if (data && data.result)
        return data.result as {
            products: ProductDocument[];
            hasMore: boolean;
        } | null;
    return null;
}

export function useProducts(page = 1, search = "") {
    return useQuery({
        queryKey: ["products", page, search],
        queryFn: ({ signal }) => getProducts(page, search, signal),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000, // Cache remains fresh for 10 minutes
    });
}
