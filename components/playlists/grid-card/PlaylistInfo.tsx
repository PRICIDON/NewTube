import React from 'react'
import {Props} from '@/components/playlists/grid-card/index'
import {Skeleton} from '@/components/ui/skeleton'
import {useTranslations} from 'next-intl'

export default function PlaylistInfo({ data }: Props) {
    const t = useTranslations("playlists.info")
    return (
        <div className="flex gap-3">
            <div className="min-w-0 flex-1">
                <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-sm break-words">
                    {data.name}
                </h3>
                <p className="text-sm text-muted-foreground">{t('title')}</p>
                <p className="text-sm text-muted-foreground font-semibold hover:text-primary">{t('description')}</p>
            </div>
        </div>
    )
}

export function PlaylistInfoSkeleton() {
    return (
        <div className="flex gap-3">
            <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-[90%]"/>
                <Skeleton className="h-5 w-[70%]"/>
                <Skeleton className="h-5 w-[50%]"/>
            </div>
        </div>
    )
}
