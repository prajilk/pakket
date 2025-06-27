import DeliveryZoneTable from "@/components/data-table/delivery-zone-table";
import DeliveryBoy from "@/components/delivery-boy/delivery-boy";
import ServerWrapper from "@/components/server-wrapper";
import { getDeliveryBoyServer } from "@/lib/api/delivery-zones/get-delivery-boy";
import { getDeliveryZonesServer } from "@/lib/api/delivery-zones/get-delivery-zones";
import { Suspense } from "react";

const OffersPage = () => {
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-semibold">Delivery Zones</h1>
            <div className="grid grid-cols-5 gap-4">
                <Suspense fallback={<div>Loading...</div>}>
                    <ServerWrapper
                        queryFn={getDeliveryZonesServer}
                        queryKey={["delivery-zones"]}
                    >
                        <DeliveryZoneTable />
                    </ServerWrapper>
                </Suspense>
                <Suspense fallback={<div>Loading...</div>}>
                    <ServerWrapper
                        queryFn={getDeliveryBoyServer}
                        queryKey={["delivery-boy"]}
                    >
                        <DeliveryBoy />
                    </ServerWrapper>
                </Suspense>
            </div>
        </div>
    );
};

export default OffersPage;
