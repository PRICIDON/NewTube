'use client'

import React, {Suspense} from 'react'
import {ErrorBoundary} from "react-error-boundary";
import {trpc} from "@/trpc/client";

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
        <div className="">
            {JSON.stringify(video)}
        </div>
    )
}
