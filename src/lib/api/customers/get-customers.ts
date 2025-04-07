import axios from "@/config/axios.config";
import { UserDocument } from "@/models/types/user";
import { headers } from "next/headers";

export async function getCustomersServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/customers", {
        params: { page: 1, search: "" },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    if (data && data.result)
        return data.result as {
            customers: UserDocument[];
            hasMore: boolean;
        } | null;
}
