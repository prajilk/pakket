import axios from "@/config/axios.config";
import { HeroBannerDocument } from "@/models/types/hero-banner";
import { useQuery } from "@tanstack/react-query";

async function getHeroBanners() {
    const { data } = await axios.get("/api/offers/hero-banner");
    if (data && data.result) return data.result as HeroBannerDocument[] | null;
    return null;
}

export function useHeroBanners() {
    return useQuery({
        queryKey: ["hero-banners"],
        queryFn: getHeroBanners,
        staleTime: 5 * 60 * 1000,
    });
}
