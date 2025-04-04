import React from 'react'
import Image from 'next/image'

interface VideoThumbnailProps {
    thumbnailUrl?: string

}

export default function VideoThumbnail({ thumbnailUrl } : VideoThumbnailProps) {
    return (
        <div className="relative">
            {/* Thumbnail Wrapper*/}
            <div className="relative w-full overflow-hidden rounded-xl aspect-video">
                <Image src={thumbnailUrl ?? "/placeholder.svg"} alt="Thumbnail" fill className="size-full object-cover"/>
            </div>
            {/*  Video duration box  */}
            {/* TODO: add video duration box */}
        </div>
    )
}
