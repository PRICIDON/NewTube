import React, {useMemo} from 'react'
import {cn} from '@/lib/utils'
import Image from 'next/image'
import {THUMBNAIL_FALLBACK} from '@/lib/constants'
import {ListVideoIcon, PlayIcon} from 'lucide-react'
import {useTranslations} from 'next-intl'


interface PlaylistThumbnailProps {
    thumbnailUrl?: string;
    className?: string;
    videoCount: number;
    title: string;
}

export default function PlaylistThumbnail({ thumbnailUrl, className, title, videoCount}: PlaylistThumbnailProps) {
    const compactViews = useMemo(() => {
        return Intl.NumberFormat("en", {
            notation: 'compact'
        }).format(videoCount)
    }, [videoCount])
    const t = useTranslations('playlists')
    return (
        <div className={cn("relative pt-3",className)}>
            {/* Stack effect layers*/}
            <div className="relative">
                {/* Background layers*/}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[97%] overflow-hidden rounded-xl bg-black/20 dark:bg-white/15 aspect-video"/>
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[98.5%] overflow-hidden rounded-xl bg-black/25 dark:bg-white/5 aspect-video"/>
            </div>
            {/* Main image */}
            <div className="relative overflow-hidden aspect-video w-full rounded-xl">
                <Image src={thumbnailUrl || THUMBNAIL_FALLBACK} alt={title} className="w-full h-full object-cover" fill />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-x-2">
                        <PlayIcon className="size-4 text-white fill-white"/>
                        <span className="text-white font-medium">{t('play')}</span>
                    </div>
                </div>
            </div>
            {/* Video count indicator */}
            <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium flex items-center gap-x-1">
                <ListVideoIcon className="size-4"/>
                {compactViews} {t('countVideo')}
            </div>
        </div>
    )
}

