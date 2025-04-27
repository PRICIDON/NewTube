import React, {useMemo} from 'react'
import {VideoGetOneOutput} from '@/components/videos/types'
import VideoOwner from '@/components/videos/video-owner'
import VideoMenu from '@/components/videos/video-menu'
import VideoReactions from '@/components/videos/video-reactions'
import VideoDescription from '@/components/videos/video-description'
import {format, formatDistanceToNow} from 'date-fns'
import {Skeleton} from '@/components/ui/skeleton'
import {useLocale} from 'next-intl'
import {enUS, ru} from 'date-fns/locale'

interface VideoTopRowProps {
    video: VideoGetOneOutput
}

export default function VideoTopRow({ video }: VideoTopRowProps) {
    const locale = useLocale()
    const compactViews = useMemo(() => {
        return Intl.NumberFormat("en", {
            notation: 'compact'
        }).format(video.viewCount)
    }, [video.viewCount])
    const expandedViews = useMemo(() => {
        return Intl.NumberFormat("en", {
            notation: 'standard'
        }).format(video.viewCount)
    }, [video.viewCount])
    const compactData = useMemo(() => {
        return formatDistanceToNow(video.createdAt, { addSuffix: true, locale: locale === "en" ? enUS : ru })
    }, [video.createdAt])
    const expandedData = useMemo(() => {
        return format(video.createdAt, "d MMM yyyy", { locale: locale === "en" ? enUS : ru })
    }, [video.createdAt])
    return (
        <div className="flex flex-col gap-4 mt-4">
            <h1 className="text-xl font-semibold">{video.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <VideoOwner user={video.user} videoId={video.id}/>
                <div className="flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible pb-2 -mb-2 sm:pb-0 sm:mb-0 gap-2">
                    <VideoReactions videoId={video.id} likes={video.likeCount} dislikes={video.dislikeCount} viewerReaction={video.viewerReactions} />
                    <VideoMenu videoId={video.id} variant="secondary"/>
                </div>
            </div>
            <VideoDescription description={video.description} compactViews={compactViews} expandedViews={expandedViews} compactData={compactData} expandedData={expandedData} />
        </div>
    )
}


export function VideoTopRowSkeleton() {
    return (
        <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-4/5 md:w-2/5"/>
            </div>
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3 w-[70%]">
                    <Skeleton className="size-10 rounded-full shrink-0"/>
                    <div className="flex flex-col gap-2 w-full">
                        <Skeleton className="h-5 w-4/5 md:w-2/6"/>
                        <Skeleton className="h-5 w-3/5 md:w-1/5"/>
                    </div>
                </div>
                <Skeleton className="h-9 w-2/6 md:w-1/6 rounded-full"/>
            </div>
            <div className="h-[120px] w-full"/>
        </div>
    )
}
