"use client"

import React from 'react'
import {trpc} from "@/trpc/client";
import {DEFAULT_LIMIT} from "@/lib/constants";

interface ResultsSectionProps {
    query: string;
    categoryId: string | undefined;
}

export default function ResultsSection({ query, categoryId }: ResultsSectionProps) {
    const [results, resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery({ query, limit: DEFAULT_LIMIT, categoryId },
        { getNextPageParam: (lastPage) => lastPage.nextCursor });
    return (
        <div>{JSON.stringify(results)}</div>
    )
}
