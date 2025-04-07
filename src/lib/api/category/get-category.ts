import axios from "@/config/axios.config";
import { CategoryDocument } from "@/models/types/category";
import { headers } from "next/headers";

export async function getCategoryServer(id: string) {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get(`/api/category/${id}`, {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.category as CategoryDocument | null;
}
