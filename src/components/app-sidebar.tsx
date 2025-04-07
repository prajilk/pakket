"use client";

import * as React from "react";
import {
    ArrowUpCircleIcon,
    BadgePercent,
    BarChartIcon,
    BookText,
    CameraIcon,
    ChevronRight,
    ClipboardListIcon,
    DatabaseIcon,
    FileCodeIcon,
    FileIcon,
    FileTextIcon,
    FolderIcon,
    HelpCircleIcon,
    Home,
    LayoutDashboardIcon,
    ListIcon,
    Package,
    SearchIcon,
    SettingsIcon,
    Users,
    UsersIcon,
} from "lucide-react";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Show } from "./show";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "./ui/collapsible";
import Link from "next/link";
import Image from "next/image";

const data = {
    menu: [
        {
            link: "/dashboard",
            icon: <Home size={17} />,
            label: "Dashboard",
        },
        {
            link: "/dashboard/orders",
            icon: <Package size={17} />,
            label: "Orders",
        },
        {
            link: "/",
            icon: <BookText size={17} />,
            label: "Catalog",
            subMenus: [
                {
                    link: "/dashboard/products",
                    label: "Products",
                },
                {
                    link: "/dashboard/categories",
                    label: "Categories",
                },
            ],
        },
        {
            link: "/",
            icon: <Users size={17} />,
            label: "Customer Details",
            subMenus: [
                {
                    link: "/dashboard/customers",
                    label: "Customers",
                },
                {
                    link: "/dashboard/addresses",
                    label: "Addresses",
                },
            ],
        },
        {
            link: "/dashboard/offers",
            icon: <BadgePercent size={17} />,
            label: "Best Deals & Offers",
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <Image src={"/logo.webp"} alt="logo" width={100} height={100} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {data.menu.map((item) => (
                            <Show key={item.label}>
                                <Show.When isTrue={item.subMenus !== undefined}>
                                    <Collapsible
                                        asChild
                                        defaultOpen={false}
                                        className="group/collapsible"
                                    >
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton
                                                    tooltip={item.label}
                                                    className="font-medium"
                                                >
                                                    {item.icon}
                                                    <span>{item.label}</span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.subMenus?.map(
                                                        (subItem) => (
                                                            <SidebarMenuSubItem
                                                                key={
                                                                    subItem.label
                                                                }
                                                            >
                                                                <SidebarMenuSubButton
                                                                    asChild
                                                                    className="hover:bg-zinc-200"
                                                                >
                                                                    <Link
                                                                        href={
                                                                            subItem.link
                                                                        }
                                                                    >
                                                                        <span>
                                                                            {
                                                                                subItem.label
                                                                            }
                                                                        </span>
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        )
                                                    )}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                </Show.When>
                                <Show.Else>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            tooltip={item.label}
                                            className="hover:bg-zinc-200"
                                            asChild
                                        >
                                            <Link
                                                href={item.link}
                                                className="flex items-center w-full gap-2"
                                            >
                                                {item.icon}
                                                <span className="text-sm font-medium">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </Show.Else>
                            </Show>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={"Prajil"} />
            </SidebarFooter>
        </Sidebar>
    );
}
