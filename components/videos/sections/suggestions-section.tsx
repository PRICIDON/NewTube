'use client'

import React from 'react'
import {trpc} from "@/trpc/client";
import {DEFAULT_LIMIT} from "@/lib/constants";
import VideoRowCard from "@/components/suggestions/video-row-card";
import VideoGridCard from "@/components/suggestions/video-grid-card";
import InfiniteScroll from "@/components/infinite-scroll";

interface Suggestions {
    videoId: string;
    isManual?: boolean;
}

export default function SuggestionsSection({ videoId, isManual }: Suggestions) {
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
