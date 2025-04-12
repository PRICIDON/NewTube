'use client'
import React, {Suspense} from 'react'
import {ErrorBoundary} from "react-error-boundary";
import {trpc} from "@/trpc/client";
import {DEFAULT_LIMIT} from "@/lib/constants";
import VideoGridCard, {VideoGridCardSkeleton} from "@/components/suggestions/video-grid-card";
import InfiniteScroll from "@/components/infinite-scroll";
import VideoRowCard, {VideoRowCardSkeleton} from "@/components/suggestions/video-row-card";


export default function LikedVideosSection() {
    return (
        <Suspense fallback={<LikedVideosSectionSkeleton/>}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <LikedVideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

function LikedVideosSectionSuspense() {
    const [videos, query] = trpc.playlists.getLiked.useSuspenseInfiniteQuery({  limit: DEFAULT_LIMIT}, { getNextPageParam: lastPage => lastPage.nextCursor })

    return (
        <>
            <div
                className="gap-4 gap-y-10 flex flex-col md:hidden"
            >
                {videos.pages.flatMap(page => page.items).map(video => (
                    <VideoGridCard key={video.id} data={video}/>
                ))}
            </div>
            <div
                className="gap-4 hidden flex-col md:flex"
            >
                {videos.pages.flatMap(page => page.items).map(video => (
                    <VideoRowCard key={video.id} data={video}/>
                ))}
            </div>
            <InfiniteScroll isManual hasNextPage={query.hasNextPage} isFetchingNextPage={query.isFetchingNextPage} fetchNextPage={query.fetchNextPage}/>
        </>
    )
}

function LikedVideosSectionSkeleton() {
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
