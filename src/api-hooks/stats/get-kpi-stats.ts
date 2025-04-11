import axios from "@/config/axios.config";
import { KPIStatsProps } from "@/lib/types/stats";
import { useQuery } from "@tanstack/react-query";

async function getKpiStats(from: string, to: string, signal: AbortSignal) {
    const { data } = await axios.get("/api/stats/kpi", {
        params: {
            from,
            to,
        },
        signal,
    });
    if (data && data.result) return data.result as KPIStatsProps | null;
    return null;
}

export function useKpiStats(from: string, to: string) {
    return useQuery({
        queryKey: ["stats", "kpi", from, to],
        queryFn: ({ signal }) => getKpiStats(from, to, signal),
        staleTime: 1 * 60 * 1000, // Cache remains fresh for 1 minutes
    });
}
