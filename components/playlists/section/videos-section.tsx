'use client'
import React, {Suspense} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {trpc} from '@/trpc/client'
import {DEFAULT_LIMIT} from '@/lib/constants'
import VideoGridCard, {
  VideoGridCardSkeleton
} from '@/components/suggestions/video-grid-card'
import InfiniteScroll from '@/components/infinite-scroll'
import VideoRowCard, {
  VideoRowCardSkeleton
} from '@/components/suggestions/video-row-card'
import {toast} from 'sonner'

interface Props {
	playlistId: string;
}

export default function VideosSection({ playlistId }: Props) {
    return (
        <Suspense fallback={<VideosSectionSkeleton/>}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <VideosSectionSuspense playlistId={playlistId} />
            </ErrorBoundary>
        </Suspense>
    )
}

function VideosSectionSuspense({ playlistId }: Props) {
    const [videos, query] = trpc.playlists.getVideos.useSuspenseInfiniteQuery({  limit: DEFAULT_LIMIT, playlistId}, { getNextPageParam: lastPage => lastPage.nextCursor })
    const utils = trpc.useUtils();
    const removeVideo = trpc.playlists.removeVideo.useMutation({
      onSuccess(data) {
        toast.success("Video remove from playlist")
        utils.playlists.getMany.invalidate()
        utils.playlists.getManyForVideo.invalidate({ videoId})
        utils.playlists.getOne.invalidate({ id: data.playlistId})
        utils.playlists.getVideos.invalidate({ playlistId: data.playlistId })
      },
      onError(e) {
        toast.error("Something went wrong")
        console.log(e)
      }
    })
    return (
        <>
            <div
                className="gap-4 gap-y-10 flex flex-col md:hidden"
            >
                {videos.pages.flatMap(page => page.items).map(video => (
                    <VideoGridCard key={video.id} data={video} onRemove={() => removeVideo.mutate({ playlistId, videoId: video.id})}/>
                ))}
            </div>
            <div
                className="gap-4 hidden flex-col md:flex"
            >
                {videos.pages.flatMap(page => page.items).map(video => (
                    <VideoRowCard key={video.id} data={video} onRemove={() => removeVideo.mutate({ playlistId, videoId: video.id})}/>
                ))}
            </div>
            <InfiniteScroll isManual hasNextPage={query.hasNextPage} isFetchingNextPage={query.isFetchingNextPage} fetchNextPage={query.fetchNextPage}/>
        </>
    )
}

function VideosSectionSkeleton() {
    return (
        <>
            <div
                className="gap-4 gap-y-10 flex flex-col md:hidden"
            >
                    {Array.from({length: 18}).map((_, i) => (
                        <VideoGridCardSkeleton key={i}/>
                    ))}
            </div>
            <div
                className="gap-4 hidden flex-col md:flex"
            >
                {Array.from({length: 18}).map((_, i) => (
                    <VideoRowCardSkeleton key={i}/>
                ))}
            </div>
        </>
    )
}
