import axios from "@/config/axios.config";
import { CategoryDocument } from "@/models/types/category";
import { useQuery } from "@tanstack/react-query";

async function getCategories() {
    const { data } = await axios.get("/api/category");
    if (data && data.categories)
        return data.categories as CategoryDocument[] | null;
    return null;
}

export function useCategories() {
    return useQuery({
        queryKey: ["category"],
        queryFn: getCategories,
        staleTime: 10 * 60 * 1000, // Cache remains fresh for 10 minutes
    });
}
