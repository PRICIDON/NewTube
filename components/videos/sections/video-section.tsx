'use client'

import React, {Suspense} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {trpc} from '@/trpc/client'
import {cn} from '@/lib/utils'
import VideoPlayer, {
  VideoPlayerSkeleton
} from '@/components/videos/player/video-player'
import VideoBanner from '@/components/videos/video-banner'
import VideoTopRow, {
  VideoTopRowSkeleton
} from '@/components/videos/video-top-row'
import {useAuth} from '@clerk/nextjs'

export default function VideoSection({ videoId }: { videoId: string }) {
    return (
       <Suspense fallback={<VideoSectionSkeleton/>}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <VideoSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    )
}

function VideoSectionSuspense({ videoId }: { videoId: string }) {
    const utils = trpc.useUtils()
    const { isSignedIn } = useAuth()
    const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId })
    const createView = trpc.videoViews.create.useMutation({
        onSuccess() {
            utils.videos.getOne.invalidate({ id: videoId})
        }
    })
    const handlePlay = () => {
        if(!isSignedIn) return;
        createView.mutate({videoId})
    }
    return (
        <>
            <div className={cn("aspect-video bg-black rounded-xl overflow-hidden relative", video.muxStatus !== "ready" && "rounded-b-none")}>
                <VideoPlayer autoPlay playbackId={video.muxPlaybackId!} onEnded={handlePlay} thumbnailUrl={video.thumbnailUrl!} />
            </div>
            <VideoBanner status={video.muxStatus}/>
            <VideoTopRow video={video}/>
        </>
    )
}

function VideoSectionSkeleton(){
    return (
        <>
            <VideoPlayerSkeleton/>
            <VideoTopRowSkeleton />
        </>
    )
}

