import {HydrateClient, trpc} from '@/trpc/server'
import CategorySection from '@/components/categories/category-section'
import React from 'react'
import {DEFAULT_LIMIT} from '@/lib/constants'
import HomeVideosSection from '@/components/home/home-videos'

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{categoryId?: string}>
}

export default async function Home({searchParams}: PageProps) {
    const { categoryId } = await searchParams;
    void trpc.categories.getMany.prefetch()
    void trpc.videos.getMany.prefetchInfinite({ categoryId, limit: DEFAULT_LIMIT})

    return (
        <HydrateClient>
            <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
                <CategorySection categoryId={categoryId} />
                <HomeVideosSection categoryId={categoryId} />
            </div>
        </HydrateClient>
    );
}
