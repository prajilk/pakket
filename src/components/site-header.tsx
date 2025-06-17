"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "./ui/breadcrumb";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function SiteHeader() {
    const pathname = usePathname();
    const paths = pathname.split("/").filter(Boolean);

    return (
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex items-center w-full gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                    <BreadcrumbList>
                        {paths.slice(0, paths.length - 1).map((path, i) => (
                            <React.Fragment key={i}>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink
                                        className="capitalize"
                                        asChild
                                    >
                                        <Link
                                            href={`/${paths
                                                .slice(0, i + 1)
                                                .join("/")}`}
                                        >
                                            {path}
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                            </React.Fragment>
                        ))}
                        <BreadcrumbItem>
                            <BreadcrumbPage className="capitalize">
                                {paths[paths.length - 1].split("-").join(" ")}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
}
