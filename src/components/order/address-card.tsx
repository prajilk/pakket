import { MapPin } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";

type AddressCardProps = {
    address: string;
    addressId: string;
    floor?: string;
    landmark?: string;
    lat: number;
    lng: number;
    locality: string;
    isDeleted: boolean;
};

const AddressCard = ({
    address,
    addressId,
    floor,
    landmark,
    lat,
    lng,
    locality,
    isDeleted,
}: AddressCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
                <CardDescription>ID: {addressId}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <p className="font-medium">{address}</p>
                            {isDeleted && (
                                <Badge variant="destructive" className="mt-1">
                                    Address Deleted
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {locality}
                        </p>
                        {floor && (
                            <p className="text-sm text-muted-foreground">
                                Floor: {floor}
                            </p>
                        )}
                        {landmark && (
                            <p className="text-sm text-muted-foreground">
                                Landmark: {landmark}
                            </p>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            asChild
                        >
                            <Link
                                href={`https://www.google.com/maps?q=${lat},${lng}`}
                                target="_blank"
                            >
                                <MapPin className="w-4 h-4" />
                                View on Google Maps
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AddressCard;
