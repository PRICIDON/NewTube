import React from 'react'
import {useUser} from '@clerk/nextjs'
import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import Link from 'next/link'
import UserAvatar from '@/components/users/avatar'
import {Skeleton} from '@/components/ui/skeleton'
import {useTranslations} from 'next-intl'

export default function StudioSidebarHeader() {
    const { user, isLoaded } = useUser()
    const { state } = useSidebar()
    const t = useTranslations("studio")

    if (!isLoaded) return (
        <SidebarHeader className="flex items-center justify-center pb-4">
            <Skeleton className="size-[112px] rounded-full"/>
            <div className="flex flex-col items-center mt-2 gap-y-2">
                <Skeleton className="h-4 w-[80px]"/>
                <Skeleton className="h-4 w-[100px]"/>
            </div>
        </SidebarHeader>
    )

    if(state === "collapsed") {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton tooltip={t('header')} asChild>
                    <Link href="/users/current">
                        <UserAvatar imageUrl={user?.imageUrl!} name={user?.fullName ?? "User"} size="xs"/>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }

    return (
        <SidebarHeader className="flex items-center justify-center pb-4">
            <Link href="/users/current">
                <UserAvatar imageUrl={user?.imageUrl!} name={user?.fullName ?? "User"} className="size-[112px] hover:opacity-80 transition-opacity" />
            </Link>
            <div className="flex flex-col items-center mt-2 gap-y-1">
                <p className="text-sm font-medium">{t('header')}</p>
                <p className="text-xs text-muted-foreground">{user?.fullName}</p>
            </div>
        </SidebarHeader>
    )
}
