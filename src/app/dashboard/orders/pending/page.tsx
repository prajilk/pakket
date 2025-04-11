import PendingOrdersTable from "@/components/data-table/pending-order-table";
import ServerWrapper from "@/components/server-wrapper";
import { getPendingOrdersServer } from "@/lib/api/orders/get-pending-orders";
import { Suspense } from "react";

export default function PendingOrdersPage() {
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-semibold">Pending Orders</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <ServerWrapper
                    queryFn={() => getPendingOrdersServer()}
                    queryKey={["orders", "pending", 0]}
                >
                    <PendingOrdersTable showViewAll={false} />
                </ServerWrapper>
            </Suspense>
        </div>
    );
}
