import axios from "@/config/axios.config";
import { BannerDocument } from "@/models/types/banner";
import { useQuery } from "@tanstack/react-query";

async function getBanners() {
    const { data } = await axios.get("/api/offers/banner");
    if (data && data.result) return data.result as BannerDocument[] | null;
    return null;
}

export function useBanners() {
    return useQuery({
        queryKey: ["banners"],
        queryFn: getBanners,
        staleTime: 5 * 60 * 1000,
    });
}
