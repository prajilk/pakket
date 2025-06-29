"use client";

import {
    Ban,
    Clock,
    DollarSign,
    HandCoins,
    ShoppingBag,
    Truck,
    Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useFilterContext } from "@/context/filter-context";
import { useKpiStats } from "@/api-hooks/stats/get-kpi-stats";
import { format } from "date-fns";
import { getDaysBetween } from "@/lib/utils";
import { useMemo } from "react";
import KPICardSkeleton from "../skeletons/kpi-card";

const KPICards = () => {
    const { filter } = useFilterContext();

    const { data, isPending } = useKpiStats(
        format(filter.from, "yyyy-MM-dd"),
        format(filter.to, "yyyy-MM-dd")
    );

    const days = useMemo(() => {
        return getDaysBetween(
            format(filter.from, "yyyy-MM-dd"),
            format(filter.to, "yyyy-MM-dd")
        );
    }, [filter]);

    if (isPending) {
        return (
            <>
                {Array.from({ length: 8 }).map((_, i) => (
                    <KPICardSkeleton key={i} />
                ))}
            </>
        );
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">
                        Total Orders
                    </CardTitle>
                    <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {data?.totalOrders || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        in {days} days
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">
                        Total Sales
                    </CardTitle>
                    <HandCoins className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {data?.totalSales || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        in {days} days
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">
                        Total Revenue
                    </CardTitle>
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ₹{data?.totalRevenue || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        in {days} days
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">
                        New Customers
                    </CardTitle>
                    <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {data?.newCustomers || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        in {days} days
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">
                        Avg. Order Value
                    </CardTitle>
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ₹{data?.avgOrderValue || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        in {days} days
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">
                        Pending Orders
                    </CardTitle>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {data?.pendingOrders || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        in {days} days
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">
                        Ongoing Orders
                    </CardTitle>
                    <Truck className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {data?.ongoingOrders || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        in {days} days
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">
                        Cancelled Orders
                    </CardTitle>
                    <Ban className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {data?.ordersCancelled || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        in {days} days
                    </p>
                </CardContent>
            </Card>
        </>
    );
};

export default KPICards;
