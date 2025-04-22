import React from 'react'
import Image from 'next/image'
import {formatDuration} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";
import {THUMBNAIL_FALLBACK} from "@/lib/constants";

interface VideoThumbnailProps {
    thumbnailUrl?: string
    previewUrl?: string
    title: string
    duration: number
}

export function VideoThumbnailSkeleton() {
    return (
        <div className="relative w-full overflow-hidden transition-all rounded-xl aspect-video">
            <Skeleton className="size-full" />
        </div>
    )
}

export default function VideoThumbnail({ thumbnailUrl, previewUrl, title, duration } : VideoThumbnailProps) {
    return (
        <div className="relative group ">
            {/* Thumbnail Wrapper*/}
            <div className="relative w-full overflow-hidden rounded-xl aspect-video">
                <Image
                    src={thumbnailUrl ?? THUMBNAIL_FALLBACK}
                    alt={title}
                    fill
                    className="size-full object-cover group-hover:opacity-0"
                />
                <Image
                    unoptimized={!!previewUrl}
                    src={previewUrl ?? THUMBNAIL_FALLBACK}
                    alt={title}
                    fill
                    className="size-full object-cover opacity-0 group-hover:opacity-100"
                />
                <p className="">{title}</p>
            </div>
            {/*  Video duration box  */}
            <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
                {formatDuration(duration)}
            </div>
        </div>
    )
}
