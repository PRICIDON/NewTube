import React, {useMemo} from 'react'
import {VideoGetManyOutput} from "@/components/videos/types";
import Link from "next/link";
import VideoThumbnail, {VideoThumbnailSkeleton} from "@/components/videos/video-thumbnail";
import VideoInfo, {VideoInfoSkeleton} from "@/components/videos/video-info";


interface VideoGridCardProps{
    data: VideoGetManyOutput["items"][number];
    onRemove?: () => void;
}

export const VideoGridCardSkeleton = () => {
    return (
        <div className="flex flec-col gap-2 w-full">
            <VideoThumbnailSkeleton />
            <VideoInfoSkeleton />
        </div>
    )
}

export default function VideoGridCard({data, onRemove}: VideoGridCardProps) {
    return (
        <div className="flex flex-col gap-2 w-full group">
            <Link href={`/videos/${data.id}`}>
                <VideoThumbnail thumbnailUrl={data.thumbnailUrl!} previewUrl={data.previewUrl!} title={data.title} duration={data.duration!} />
            </Link>
            <VideoInfo data={data} onRemove={onRemove}/>
        </div>
    )
}
