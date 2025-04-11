import axios from "@/config/axios.config";
import { TopSpender } from "@/lib/types/customer";
import { headers } from "next/headers";

export async function getTopSpendersServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/customers/top-spenders", {
        params: { page: 1 },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    if (data && data.result)
        return data.result as {
            customers: TopSpender[];
            hasMore: boolean;
        } | null;
}
