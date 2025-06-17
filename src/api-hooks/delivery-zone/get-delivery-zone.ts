import axios from "@/config/axios.config";
import { DeliveryZoneDocument } from "@/models/types/delivery-zone";
import { useQuery } from "@tanstack/react-query";

async function getDeliveryZones() {
    const { data } = await axios.get("/api/delivery-zones");
    if (data && data.result)
        return data.result as DeliveryZoneDocument[] | null;
    return null;
}

export function useDeliveryZones() {
    return useQuery({
        queryKey: ["delivery-zones"],
        queryFn: getDeliveryZones,
        staleTime: 5 * 60 * 1000,
    });
}
