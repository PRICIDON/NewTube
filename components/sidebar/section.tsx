'use client'
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
import {usePathname} from "next/navigation";
import StudioSidebarHeader from "@/components/studio/studio-sidebar-header";

interface Item {
    title: string;
    url: string;
    icon: LucideIcon;
    auth?: boolean;
}

interface Props {
    items: Item[]
    label?: string
    studio?: boolean
}

export default function Section({ items, label, studio }: Props) {
    const path = usePathname()
    const clerk = useClerk()
    const { isSignedIn } = useAuth()
    return (
        <SidebarGroup>
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            {studio && <StudioSidebarHeader/>}
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton tooltip={item.title} asChild isActive={path === item.url} onClick={(e) => {
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
