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
import Image from "next/image";

export default async function Home() {
    const session = await getServerSession(authOptions);
    if (session?.user?.name) redirect("/dashboard");

    return (
        <div className="flex justify-center items-center py-10 min-h-screen bg-gray-100">
            <Card className="w-full max-w-md h-screen rounded-none md:h-auto md:rounded-2xl md:p-5">
                <CardHeader>
                    <div className="my-5">
                        <Image
                            src={"/logo.webp"}
                            alt="logo"
                            width={100}
                            height={100}
                        />
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
