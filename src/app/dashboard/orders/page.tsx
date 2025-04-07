import OrdersTable from "@/components/data-table/order-table";
import ServerWrapper from "@/components/server-wrapper";

export default function OrdersPage() {
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-semibold">Orders</h1>
            {/* <ServerWrapper
                queryFn={getOrdersServer}
                queryKey={["orders", 1, ""]}
            >
            </ServerWrapper> */}
            <OrdersTable />
        </div>
    );
}
