'use client'
import React, {Suspense} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {trpc} from '@/trpc/client'
import {DEFAULT_LIMIT} from '@/lib/constants'
import VideoGridCard, {
  VideoGridCardSkeleton
} from '@/components/suggestions/video-grid-card'
import InfiniteScroll from '@/components/infinite-scroll'

interface HomeVideosSectionProps {
    categoryId?: string
}

export default function HomeVideosSection({ categoryId }: HomeVideosSectionProps) {
    return (
        <Suspense key={categoryId} fallback={<HomeVideosSectionSkeleton/>}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <HomeVideosSectionSuspense categoryId={categoryId} />
            </ErrorBoundary>
        </Suspense>
    )
}

function HomeVideosSectionSuspense({ categoryId }: HomeVideosSectionProps) {
    const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery({ categoryId, limit: DEFAULT_LIMIT}, { getNextPageParam: lastPage => lastPage.nextCursor })

    return (
        <div>
            <div
                className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px]:grid-cols-5 [@media(min-width:2200px]:grid-cols-6"
            >
                {videos.pages.flatMap(page => page.items).map(video => (
                    <VideoGridCard key={video.id} data={video}/>
                ))}
            </div>
            <InfiniteScroll isManual hasNextPage={query.hasNextPage} isFetchingNextPage={query.isFetchingNextPage} fetchNextPage={query.fetchNextPage}/>
        </div>
    )
}

function HomeVideosSectionSkeleton() {
    return (
        <div
            className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px]:grid-cols-5 [@media(min-width:2200px]:grid-cols-6"
        >
                {Array.from({length: 18}).map((_, i) => (
                    <VideoGridCardSkeleton key={i}/>
                ))}
        </div>
    )
}
