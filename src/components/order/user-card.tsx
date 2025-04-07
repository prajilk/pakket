import { Phone, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type UserCardProps = {
    name: string;
    userId: string;
    email: string;
    phone: string;
};

const UserCard = ({ name, userId, email, phone }: UserCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                        <p className="font-medium">{name}</p>
                        <p className="text-sm text-muted-foreground">
                            ID: {userId}
                        </p>
                        <p className="text-sm text-muted-foreground">{email}</p>
                    </div>
                </div>
                <div className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                        <p className="font-medium">Contact</p>
                        <p className="text-sm text-muted-foreground">{phone}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserCard;
