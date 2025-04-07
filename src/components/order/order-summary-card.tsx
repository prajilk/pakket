import { format } from "date-fns";
import { Badge, badgeVariants } from "../ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { CalendarIcon, Clock } from "lucide-react";
import { VariantProps } from "class-variance-authority";

const statusColorMap: Record<
    string,
    VariantProps<typeof badgeVariants>["variant"]
> = {
    pending: "default",
    ongoing: "secondary",
    delivered: "success",
};

type OrderSummaryCardProps = {
    orderId: string;
    status: string;
    createdAt: Date;
    deliveryDate: Date | null;
};

const OrderSummaryCard = ({
    createdAt,
    deliveryDate,
    orderId,
    status,
}: OrderSummaryCardProps) => {
    return (
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Order Summary</span>
                    <Badge
                        variant={statusColorMap[status]}
                        className="capitalize"
                    >
                        {status}
                    </Badge>
                </CardTitle>
                <CardDescription>
                    Order #{orderId} was placed on{" "}
                    {format(createdAt, "MMMM dd, yyyy 'at' hh:mm a")}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-2">
                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="font-medium">Order Placed</p>
                            <p className="text-sm text-muted-foreground">
                                {format(
                                    createdAt,
                                    "MMMM dd, yyyy 'at' hh:mm a"
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="font-medium">Delivered On</p>
                            <p className="text-sm text-muted-foreground">
                                {deliveryDate
                                    ? format(
                                          deliveryDate,
                                          "MMMM dd, yyyy 'at' hh:mm a"
                                      )
                                    : "--"}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderSummaryCard;
