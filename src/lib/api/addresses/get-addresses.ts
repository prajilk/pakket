import axios from "@/config/axios.config";
import { AddressDocumentExtended } from "@/lib/types/address";
import { headers } from "next/headers";

export async function getAddressesServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/addresses", {
        params: { page: 1, search: "" },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    if (data && data.result)
        return data.result as {
            addresses: AddressDocumentExtended[];
            hasMore: boolean;
        } | null;
}
