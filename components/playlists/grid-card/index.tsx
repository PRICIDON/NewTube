import {PlaylistGetManyOutput} from '@/components/playlists/types'
import React from 'react'
import Link from 'next/link'
import {THUMBNAIL_FALLBACK} from '@/lib/constants'
import PlaylistThumbnail
  from '@/components/playlists/grid-card/PlaylistThumbnail'
import PlaylistInfo, {
  PlaylistInfoSkeleton
} from '@/components/playlists/grid-card/PlaylistInfo'
import {VideoThumbnailSkeleton} from '@/components/videos/video-thumbnail'

export interface Props {
    data: PlaylistGetManyOutput["items"][number]
}


export default function PlaylistGridCard({ data }: Props) {
    return (
        <Link href={`/playlists/${data.id}`}>
            <div className="flex flex-col gap-2 w-full group">
                <PlaylistThumbnail thumbnailUrl={data.thumnailUrl || THUMBNAIL_FALLBACK} title={data.name} videoCount={data.videoCount} />
                <PlaylistInfo data={data}/>
            </div>
        </Link>
    )
}

export function PlaylistGridCardSkeleton() {
    return (
        <div className="flex flex-col gap-2 w-full">
            <VideoThumbnailSkeleton />
            <PlaylistInfoSkeleton />
        </div>
    )
}
