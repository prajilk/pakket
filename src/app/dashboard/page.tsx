import FilterSelect from "@/components/dashboard/filter-select";
import KPICards from "@/components/dashboard/kpi-cards";
import PendingOrdersTable from "@/components/data-table/pending-order-table";
import RecentOrdersTable from "@/components/data-table/recent-order-table";
import TopSpendersTable from "@/components/data-table/top-spenders-table";
import ServerWrapper from "@/components/server-wrapper";
import KPICardSkeleton from "@/components/skeletons/kpi-card";
import { getTopSpendersServer } from "@/lib/api/customers/get-top-spenders";
import { getPendingOrdersServer } from "@/lib/api/orders/get-pending-orders";
import { getRecentOrdersServer } from "@/lib/api/orders/get-recent-orders";
import { getKPIStatsServer } from "@/lib/api/stats/get-kpi-stats";
import { format } from "date-fns";
import { Suspense } from "react";

export default function Page() {
    return (
        <div className="space-y-5">
            <div className="flex flex-wrap justify-between items-center">
                <h1 className="text-2xl font-semibold">Overview</h1>
                <FilterSelect />
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Suspense
                    fallback={
                        <>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <KPICardSkeleton key={i} />
                            ))}
                        </>
                    }
                >
                    <ServerWrapper
                        queryFn={getKPIStatsServer}
                        queryKey={[
                            "stats",
                            "kpi",
                            format(new Date(), "yyyy-MM-dd"),
                            format(new Date(), "yyyy-MM-dd"),
                        ]}
                    >
                        <KPICards />
                    </ServerWrapper>
                </Suspense>
            </div>

            {/* Pending orders */}
            <Suspense fallback={<div>Loading...</div>}>
                <ServerWrapper
                    queryFn={() => getPendingOrdersServer(10)}
                    queryKey={["orders", "pending", 10]}
                >
                    <PendingOrdersTable limit={10} />
                </ServerWrapper>
            </Suspense>

            {/* Recent order */}
            <Suspense fallback={<div>Loading...</div>}>
                <ServerWrapper
                    queryFn={getRecentOrdersServer}
                    queryKey={["orders", "recent"]}
                >
                    <RecentOrdersTable />
                </ServerWrapper>
            </Suspense>

            {/* Top Spenders */}
            <Suspense fallback={<div>Loading...</div>}>
                <ServerWrapper
                    queryFn={getTopSpendersServer}
                    queryKey={["customers", "top-spenders", 1]}
                >
                    <TopSpendersTable />
                </ServerWrapper>
            </Suspense>
        </div>
    );
}
