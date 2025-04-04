import React from 'react'
import Image from 'next/image'
import {formatDuration} from "@/lib/utils";

interface VideoThumbnailProps {
    thumbnailUrl?: string
    previewUrl?: string
    title: string
    duration: number
}

export default function VideoThumbnail({ thumbnailUrl, previewUrl, title, duration } : VideoThumbnailProps) {
    return (
        <div className="relative group ">
            {/* Thumbnail Wrapper*/}
            <div className="relative w-full overflow-hidden rounded-xl aspect-video">
                <Image
                    src={thumbnailUrl ?? "/placeholder.svg"}
                    alt={title}
                    fill
                    className="size-full object-cover group-hover:opacity-0"
                />
                <Image
                    src={previewUrl ?? "/placeholder.svg"}
                    alt={title}
                    fill
                    className="size-full object-cover opacity-0 group-hover:opacity-100"
                />
                <p className="">{title}</p>
            </div>
            {/*  Video duration box  */}
            <div className="absolute bottom-2 right-2 px-1 py-.5 rounded bg-black/80 text-white text-xs font-medium">
                {formatDuration(duration)}
            </div>
        </div>
    )
}
