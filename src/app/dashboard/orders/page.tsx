import OrdersTable from "@/components/data-table/order-table";
import ServerWrapper from "@/components/server-wrapper";
import { getOrdersServer } from "@/lib/api/orders/get-orders";
import { Suspense } from "react";

export default function OrdersPage() {
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-semibold">Orders</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <ServerWrapper
                    queryFn={getOrdersServer}
                    queryKey={["orders", 1, ["all"], ""]}
                >
                    <OrdersTable />
                </ServerWrapper>
            </Suspense>
        </div>
    );
}
