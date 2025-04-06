import React, {useMemo} from 'react'
import {VideoGetOneOutput} from "@/components/videos/types";
import VideoOwner from "@/components/videos/video-owner";
import VideoMenu from "@/components/videos/video-menu";
import VideoReactions from "@/components/videos/video-reactions";
import VideoDescription from "@/components/videos/video-description";
import {format, formatDistanceToNow} from "date-fns";

interface VideoTopRowProps {
    video: VideoGetOneOutput
}

export default function VideoTopRow({ video }: VideoTopRowProps) {
    const compactViews = useMemo(() => {
        return Intl.NumberFormat("en", {
            notation: 'compact'
        }).format(1000)
    }, [])
    const expandedViews = useMemo(() => {
        return Intl.NumberFormat("en", {
            notation: 'standard'
        }).format(1000)
    }, [])
    const compactData = useMemo(() => {
        return formatDistanceToNow(video.createdAt, { addSuffix: true })
    }, [video.createdAt])
    const expandedData = useMemo(() => {
        return format(video.createdAt, "d MMM yyyy")
    }, [video.createdAt])
    return (
        <div className="flex flex-col gap-4 mt-4">
            <h1 className="text-xl font-semibold">{video.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <VideoOwner user={video.user} videoId={video.id}/>
                <div className="flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible pb-2 -mb-2 sm:pb-0 sm:mb-0 gap-2">
                    <VideoReactions />
                    <VideoMenu videoId={video.id} variant="secondary"/>
                </div>
            </div>
            <VideoDescription description={video.description} compactViews={compactViews} expandedViews={expandedViews} compactData={compactData} expandedData={expandedData} />
        </div>
    )
}
