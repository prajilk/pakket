import axios from "@/config/axios.config";
import { KPIStatsProps } from "@/lib/types/stats";
import { format } from "date-fns";
import { headers } from "next/headers";

export async function getKPIStatsServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/stats/kpi", {
        params: {
            from: format(new Date(), "yyyy-MM-dd"),
            to: format(new Date(), "yyyy-MM-dd"),
        },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    if (data && data.result) return data.result as KPIStatsProps | null;
}
