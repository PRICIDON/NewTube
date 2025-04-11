import React from 'react'
import {HydrateClient, trpc} from "@/trpc/server";
import CategoriesSection from "@/components/categories/category-section";
import {DEFAULT_LIMIT} from "@/lib/constants";
import ResultsSection from "@/components/search/results-section";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        query: string;
        categoryId: string | undefined;
    }>
}

export default async function Page({ searchParams }: PageProps) {
    const { query, categoryId } = await searchParams;
    void trpc.categories.getMany.prefetch()
    void trpc.search.getMany.prefetchInfinite({
        query,
        categoryId,
        limit: DEFAULT_LIMIT
        // @ts-ignore
    }, { getNextPageParam: (lastPage) => lastPage.nextCursor })
    return (
        <HydrateClient>
            <div className="max-w-[1300px] mx-auto mb-10 flex flex-col gap-y-6 px-4 pt-2.5">
                <CategoriesSection categoryId={categoryId} />
                <ResultsSection query={query} categoryId={categoryId} />
            </div>
        </HydrateClient>
    )
}
