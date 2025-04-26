'use client'
import React from 'react'
import {ListIcon, type LucideIcon} from 'lucide-react'
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar'
import Link from 'next/link'
import {useAuth, useClerk} from '@clerk/nextjs'
import {usePathname} from 'next/navigation'
import StudioSidebarHeader from '@/components/studio/studio-sidebar-header'
import {trpc} from '@/trpc/client'
import {DEFAULT_LIMIT} from '@/lib/constants'
import UserAvatar from '@/components/users/avatar'
import {Skeleton} from '@/components/ui/skeleton'

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

export function SubscriptionSection() {
    const path = usePathname()
    const { data, isLoading } = trpc.subscriptions.getMany.useInfiniteQuery({ limit: DEFAULT_LIMIT}, { getNextPageParam: (lastPage) => lastPage.nextCursor})
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {isLoading ? <LoadingSkeleton/> : (
                      <>
                        {data?.pages.flatMap(page => page.items).map((subscription) => (
                                <SidebarMenuItem key={`${subscription.creatorId}-${subscription.viewerId}`}>
                                    <SidebarMenuButton tooltip={subscription.user.name} asChild isActive={path === `/users/${subscription.user.id}`}>
                                        <Link href={`/users/${subscription.user.id}`} className="flex items-center gap-4">
                                            <UserAvatar size="xs" name={subscription.user.name} imageUrl={subscription.user.imageUrl} />
                                            <span className="text-sm">{subscription.user.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                        ))}
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={path === `/subscriptions`}>
                                <Link href={`/subscriptions`} className="flex items-center gap-4">
                                    <ListIcon className="size-4"/>
                                    <span className="text-sm">All subscriptions</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                      </>
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

export function LoadingSkeleton() {
    return (
      <>
          {Array.from({ length: 4}).map((_,i) => (
            <SidebarMenuItem key={i}>
                <SidebarMenuButton disabled>
                    <Skeleton className="size-6 rounded-full shrink-0"/>
                    <Skeleton  className="h-4 w-full"/>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
      </>
    )
}
