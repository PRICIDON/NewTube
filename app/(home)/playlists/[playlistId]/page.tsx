import React from 'react'
import {HydrateClient, trpc} from '@/trpc/server'
import {DEFAULT_LIMIT} from '@/lib/constants'
import PlaylistHeaderSection
	from '@/components/playlists/section/playlist-header-section'
import VideosSection from '@/components/playlists/section/videos-section'

export const dynamic = "force-dynamic"

interface PageProps {
	params: Promise<{ playlistId: string }>
}

export default async function Page({ params }: PageProps) {
		const { playlistId } = await params
    void trpc.playlists.getVideos.prefetchInfinite({ limit: DEFAULT_LIMIT, playlistId})
		void trpc.playlists.getOne.prefetch({ id: playlistId })
    return (
        <HydrateClient>
            <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
                <PlaylistHeaderSection playlistId={playlistId}/>
                <VideosSection playlistId={playlistId} />
            </div>
        </HydrateClient>
    )
}
