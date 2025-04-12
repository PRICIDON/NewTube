import {VideoGetManyOutput} from "@/components/videos/types";
import React, {useMemo} from 'react'
import {formatDistanceToNow} from "date-fns";
import Link from "next/link";
import UserAvatar from "@/components/users/avatar";
import UserInfo from "@/components/users/user-info";
import VideoMenu from "@/components/videos/video-menu";
import {Skeleton} from "@/components/ui/skeleton";

interface VideoInfo {
    data: VideoGetManyOutput["items"][number]
    onRemove?: () => void
}

export function VideoInfoSkeleton() {
    return (
        <div className="flex gap-3">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="min-w-0 flex space-y-2">
                <Skeleton className="h-5 w-[90%]"/>
                <Skeleton className="h-5 w-[70%]"/>
            </div>
        </div>
    )
}

export default function VideoInfo({ data, onRemove }: VideoInfo) {
    const compactDate = useMemo(() => {
        return formatDistanceToNow(data.createdAt, { addSuffix: true })
    }, [data.createdAt]);
    const compactViews = useMemo(() => Intl.NumberFormat("en", { notation: "compact"}).format(data.viewCount), [data.viewCount]);
    return (
        <div className="flex gap-3">
            <Link href={`/users/${data.user.id}`}>
                <UserAvatar imageUrl={data.user.imageUrl!} name={data.user.name} />
            </Link>
            <div className="min-w-0 flex-1">
                <Link href={`/videos/${data.id}`}>
                    <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">{data.title}</h3>
                </Link>
                <Link href={`/users/${data.user.id}`}>
                    <UserInfo name={data.user.name} />
                </Link>
                <Link href={`/videos/${data.id}`}>
                    <p className="line-clamp-1 text-sm text-gray-600">{compactViews} views • {compactDate}</p>
                </Link>
            </div>
            <div className="shrink-0">
                <VideoMenu videoId={data.id} onRemove={onRemove} />
            </div>
        </div>
    )
}
