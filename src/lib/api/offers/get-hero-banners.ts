import axios from "@/config/axios.config";
import { HeroBannerDocument } from "@/models/types/hero-banner";
import { headers } from "next/headers";

export async function getHeroBannersServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/offers/hero-banner", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    if (data && data.result) return data.result as HeroBannerDocument[] | null;
}
