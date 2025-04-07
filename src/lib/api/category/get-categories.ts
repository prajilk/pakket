import axios from "@/config/axios.config";
import { CategoryDocument } from "@/models/types/category";
import { headers } from "next/headers";

export async function getCategoriesServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/category", {
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.categories as CategoryDocument[] | null;
}
