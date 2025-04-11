"use client";

// import { HeroUIProvider } from "@heroui/system";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import queryConfig from "@/config/react-query.config";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ContextProvider } from "@/context/filter-context";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () => new QueryClient({ defaultOptions: queryConfig })
    );

    return (
        <SessionProvider>
            <ContextProvider>
                <QueryClientProvider client={queryClient}>
                    {/* <HeroUIProvider> */}
                    {children}
                    {/* </HeroUIProvider>; */}
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </ContextProvider>
        </SessionProvider>
    );
}
