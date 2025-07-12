import axios from "@/config/axios.config";
import { DeliveryBoyDocument } from "@/models/types/delivery-zone";
import { useQuery } from "@tanstack/react-query";

async function getDeliveryBoy() {
    const { data } = await axios.get("/api/delivery-boy");
    if (data && data.result) return data.result as DeliveryBoyDocument[] | null;
    return null;
}

export function useDeliveryBoy() {
    return useQuery({
        queryKey: ["delivery-boy"],
        queryFn: getDeliveryBoy,
        staleTime: Infinity,
    });
}
