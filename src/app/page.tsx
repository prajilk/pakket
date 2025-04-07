import AuthForm from "@/components/forms/auth-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Dots from "@/components/icons/dots";

export default async function Home() {
    const session = await getServerSession(authOptions);
    if (session?.user?.name) redirect("/dashboard");

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
            <Card className="w-full max-w-md h-screen md:h-auto rounded-none md:rounded-2xl md:p-5">
                <CardHeader>
                    <div className="my-5">
                        <Dots />
                    </div>
                    <CardTitle className="text-lg">Welcome back!</CardTitle>
                    <CardDescription className="text-sm">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AuthForm />
                </CardContent>
            </Card>
        </div>
    );
}
