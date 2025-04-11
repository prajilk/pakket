import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const KPICardSkeleton = () => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle>
                    <Skeleton className="w-24 h-4" />
                </CardTitle>
                <Skeleton className="size-5" />
            </CardHeader>
            <CardContent className="mt-1 space-y-1.5">
                <Skeleton className="w-14 h-7" />
                <Skeleton className="w-16 h-4" />
            </CardContent>
        </Card>
    );
};

export default KPICardSkeleton;
