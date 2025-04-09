import {cva, VariantProps} from "class-variance-authority";
import React, {useMemo} from 'react'
import {VideoGetManyOutput} from "@/components/videos/types";
import Link from "next/link";
import VideoThumbnail from "@/components/videos/video-thumbnail";
import {cn} from "@/lib/utils";
import UserAvatar from "@/components/avatar";
import UserInfo from "@/components/users/user-info";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import VideoMenu from "@/components/videos/video-menu";
import VideoInfo from "@/components/videos/video-info";


interface VideoGridCardProps{
    data: VideoGetManyOutput["items"][number];
    onRemove?: () => void;
}

export const VideoGridCardSkeleton = () => {
    return (
        <div>
            Skeleton
        </div>
    )
}

export default function VideoGridCard({data, onRemove}: VideoGridCardProps) {
    const compactViews = useMemo(() => Intl.NumberFormat("en", { notation: "compact"}).format(data.viewCount), [data.viewCount]);
    const compactLikes = useMemo(() => Intl.NumberFormat("en", { notation: "compact"}).format(data.likeCount), [data.likeCount]);
    return (
        <div className="flex flex-col gap-2 w-full group">
            <Link href={`/videos/${data.id}`}>
                <VideoThumbnail thumbnailUrl={data.thumbnailUrl!} previewUrl={data.previewUrl!} title={data.title} duration={data.duration!} />
            </Link>
            <VideoInfo data={data} onRemove={onRemove}/>
        </div>
    )
}
