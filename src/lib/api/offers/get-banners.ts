import axios from "@/config/axios.config";
import { BannerDocument } from "@/models/types/banner";
import { headers } from "next/headers";

export async function getBannersServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/offers/banner", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    if (data && data.result) return data.result as BannerDocument[] | null;
}
