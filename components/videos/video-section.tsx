'use client'

import React, {Suspense} from 'react'
import {ErrorBoundary} from "react-error-boundary";
import {trpc} from "@/trpc/client";
import {cn} from "@/lib/utils";
import VideoPlayer from "@/components/videos/video-player";
import VideoBanner from "@/components/videos/video-banner";
import VideoTopRow from "@/components/videos/video-top-row";

export default function VideoSection({ videoId }: { videoId: string }) {
    return (
       <Suspense>
            <ErrorBoundary fallback={<p className="">Error</p>}>
                <VideoSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    )
}

function VideoSectionSuspense({ videoId }: { videoId: string }) {
    const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId })
    return (
        <>
            <div className={cn("aspect-video bg-black rounded-xl overflow-hidden relative", video.muxStatus !== "ready" && "rounded-b-none")}>
                <VideoPlayer autoPlay playbackId={video.muxPlaybackId!} onPlay={() => {}} thumbnailUrl={video.thumbnailUrl!} />
            </div>
            <VideoBanner status={video.muxStatus}/>
            <VideoTopRow video={video}/>
        </>
    )
}
