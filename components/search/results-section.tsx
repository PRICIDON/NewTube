"use client"

import React, {Suspense} from 'react'
import {trpc} from "@/trpc/client";
import {DEFAULT_LIMIT} from "@/lib/constants";
import {useIsMobile} from "@/hooks/use-mobile";
import VideoGridCard, {VideoGridCardSkeleton} from "@/components/suggestions/video-grid-card";
import VideoRowCard, {VideoRowCardSkeleton} from "@/components/suggestions/video-row-card";
import InfiniteScroll from "@/components/infinite-scroll";
import {ErrorBoundary} from "react-error-boundary";

interface ResultsSectionProps {
    query: string;
    categoryId: string | undefined;
}

export default function ResultsSection({query, categoryId}: ResultsSectionProps) {
    return (
        <Suspense fallback={<ResultsSectionSkeleton/>}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <ResultsSectionSuspense query={query} categoryId={categoryId} />
            </ErrorBoundary>
        </Suspense>
    )
}

function ResultsSectionSkeleton(){
    return (
        <div>
            <div className="hidden flex-col gap-4 md:flex">
                {Array.from({ length: 5}).map((_, i) => (
                    <VideoRowCardSkeleton key={i}/>
                ))}
            </div>
            <div className="flex flex-col gap-4 p-4 gap-y-10 pt- 6 md:hidden">
                {Array.from({ length: 5}).map((_, i) => (
                    <VideoGridCardSkeleton key={i}/>
                ))}
            </div>
        </div>
    )
}

function ResultsSectionSuspense({ query, categoryId }: ResultsSectionProps) {
    const isMobile = useIsMobile()
    const [results, resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery({ query, limit: DEFAULT_LIMIT, categoryId },
        { getNextPageParam: (lastPage) => lastPage.nextCursor });
    return (
        <>
            {isMobile ? (
                <div className="flex flex-col gap-4 gap-y-10">
                    {results.pages.flatMap(page => page.items).map(video => (
                        <VideoGridCard key={video.id} data={video}  />
                    ))}
                </div>
            ): (
                <div className="flex flex-col gap-4">
                    {results.pages.flatMap(page => page.items).map(video => (
                        <VideoRowCard key={video.id} data={video}  />
                    ))}
                </div>
            )}
            <InfiniteScroll fetchNextPage={resultQuery.fetchNextPage} hasNextPage={resultQuery.hasNextPage} isFetchingNextPage={resultQuery.isFetchingNextPage}/>
        </>
    )
}
