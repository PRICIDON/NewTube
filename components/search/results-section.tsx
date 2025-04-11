"use client"

import React from 'react'
import {trpc} from "@/trpc/client";
import {DEFAULT_LIMIT} from "@/lib/constants";
import {useIsMobile} from "@/hooks/use-mobile";
import VideoGridCard from "@/components/suggestions/video-grid-card";
import VideoRowCard from "@/components/suggestions/video-row-card";

interface ResultsSectionProps {
    query: string;
    categoryId: string | undefined;
}

export default function ResultsSection({ query, categoryId }: ResultsSectionProps) {
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
        </>
    )
}
