import React from 'react'
import { type LucideIcon } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupContent, SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import Link from "next/link";
import {useAuth, useClerk} from "@clerk/nextjs";

interface Item {
    title: string;
    url: string;
    icon: LucideIcon;
    auth?: boolean;
}

interface Props {
    items: Item[]
    label?: string
}

export default function Section({ items, label }: Props) {
    const clerk = useClerk()
    const { isSignedIn } = useAuth()
    return (
        <SidebarGroup>
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton tooltip={item.title} asChild isActive={false} onClick={(e) => {
                                if(!isSignedIn && item.auth) {
                                    e.preventDefault()
                                    return clerk.openSignIn()
                                }
                            }}>
                                <Link href={item.url} className="flex items-center gap-4">
                                    <item.icon />
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
