import axios from "@/config/axios.config";
import { ProductDocument } from "@/models/types/product";
import { headers } from "next/headers";

export async function getProductsServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/products", {
        params: { page: 1 },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    if (data && data.result)
        return data.result as {
            products: ProductDocument[];
            hasMore: boolean;
        } | null;
}
