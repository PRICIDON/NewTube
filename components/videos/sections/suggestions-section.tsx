'use client'

import React, {Suspense} from 'react'
import {trpc} from "@/trpc/client";
import {DEFAULT_LIMIT} from "@/lib/constants";
import VideoRowCard, {VideoRowCardSkeleton} from "@/components/suggestions/video-row-card";
import VideoGridCard, {VideoGridCardSkeleton} from "@/components/suggestions/video-grid-card";
import InfiniteScroll from "@/components/infinite-scroll";
import {ErrorBoundary} from "react-error-boundary";

interface Suggestions {
    videoId: string;
    isManual?: boolean;
}

export default function SuggestionsSection({ videoId, isManual }: Suggestions) {
    return (
        <Suspense fallback={<SuggestionsSectionSkeleton/>}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <SuggestionsSectionSuspense videoId={videoId} isManual={isManual} />
            </ErrorBoundary>
        </Suspense>
    )
}

function SuggestionsSectionSkeleton() {
    return (
        <>
            <div className="hidden md:block space-y-3">
                {Array.from({ length:6 }).map((_, i) => (
                    <VideoRowCardSkeleton key={i} size="compact"/>
                ))}
            </div>
            <div className="block md:hidden space-y-10">
                {Array.from({ length:6 }).map((_, i) => (
                    <VideoGridCardSkeleton key={i}/>
                ))}
            </div>
        </>
    )
}

function SuggestionsSectionSuspense({ videoId, isManual }: Suggestions) {
    const [suggestions, query] = trpc.suggestions.getMany.useSuspenseInfiniteQuery({ videoId, limit: DEFAULT_LIMIT }, { getNextPageParam: (lastPage) => lastPage.nextCursor });

    return (
        <>
            <div className="hidden md:block space-y-3">
                {suggestions.pages.flatMap(page => page.items).map(video => (
                    <VideoRowCard key={video.id} data={video}/>
                ))}
            </div>
            <div className="block md:hidden space-y-10">
                {suggestions.pages.flatMap(page => page.items).map(video => (
                    <VideoGridCard key={video.id} data={video}/>
                ))}
            </div>
            <InfiniteScroll isManual={isManual} hasNextPage={query.hasNextPage} isFetchingNextPage={query.isFetchingNextPage} fetchNextPage={query.fetchNextPage}/>
        </>
    )
}
