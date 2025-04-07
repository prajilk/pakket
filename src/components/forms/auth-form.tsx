"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { ZodAuthSchema } from "@/lib/zod-schema/schema";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../ui/form";
import { Label } from "../ui/label";
import LoadingButton from "../ui/loading-button";

const AuthForm = () => {
    const [error, setError] = useState<string | null>(null);
    const [signInLoading, setSignInIsLoading] = useState(false);
    const router = useRouter();
    const callback = useSearchParams();

    const form = useForm<z.infer<typeof ZodAuthSchema>>({
        resolver: zodResolver(ZodAuthSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    async function handleSignIn(data: z.infer<typeof ZodAuthSchema>) {
        setError(null);
        setSignInIsLoading(true);

        try {
            const signInResponse = await signIn("credentials", {
                username: data.username,
                password: data.password,
                redirect: false,
                callbackUrl: callback.get("callbackUrl") || undefined,
            });

            if (signInResponse?.error) {
                form.reset();
                throw new Error("Invalid credentials.");
            }

            toast.success("Signed in successfully. redirecting...");
            router.refresh();
            router.replace(signInResponse?.url ?? "/dashboard");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setSignInIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignIn)} method="post">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="mb-4 sm:mb-7">
                            <Label htmlFor="username" className="text-primary">
                                Username
                            </Label>
                            <FormControl className="space-y-2">
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    {...field}
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="password" className="text-primary">
                                Password
                            </Label>
                            <FormControl className="space-y-2">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    {...field}
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {error ? (
                    <span className="my-3 sm:my-5 block h-5 text-center text-xs font-medium text-destructive dark:text-red-500">
                        {error}
                    </span>
                ) : (
                    <span className="my-3 sm:my-5 block h-5" />
                )}
                <LoadingButton
                    isLoading={signInLoading}
                    disabled={!form.formState.isValid || signInLoading}
                    type="submit"
                    className="w-full mb-5 rounded-full py-5"
                >
                    Log in
                </LoadingButton>
            </form>
        </Form>
    );
};

export default AuthForm;
