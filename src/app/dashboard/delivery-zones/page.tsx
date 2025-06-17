import DeliveryZoneTable from "@/components/data-table/delivery-zone-table";
import ServerWrapper from "@/components/server-wrapper";
import { getDeliveryZonesServer } from "@/lib/api/delivery-zones/get-delivery-zones";
import { Suspense } from "react";

const OffersPage = () => {
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-semibold">Delivery Zones</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <ServerWrapper
                    queryFn={getDeliveryZonesServer}
                    queryKey={["delivery-zones"]}
                >
                    <DeliveryZoneTable />
                </ServerWrapper>
            </Suspense>
        </div>
    );
};

export default OffersPage;
