'use client'
import React, {Suspense} from 'react'
import {ErrorBoundary} from "react-error-boundary";
import {trpc} from "@/trpc/client";
import CommentForm from "@/components/comments/comment-form";
import CommentItem from "@/components/comments/comment-item";
import {DEFAULT_LIMIT} from "@/lib/constants";
import InfiniteScroll from "@/components/infinite-scroll";
import {Loader2Icon} from "lucide-react";

export default function CommentsSection({ videoId } : { videoId: string}) {
    return (
        <Suspense fallback={<CommentsSectionSkeleton/>}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <CommentsSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    )
}

function CommentsSectionSuspense({ videoId} : { videoId: string}) {
    const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery({ videoId, limit: DEFAULT_LIMIT }, { getNextPageParam: (lastPage) => lastPage.nextCursor})
    return (
        <div className="mt-6">
            <div className="flex flex-col gap-6">
                <h1 className="tex-xl font-bold">{comments.pages[0].totalCount} Comments</h1>
                <CommentForm videoId={videoId} />
            </div>
            <div className="flex flex-col gap-4 mt-2">
                {comments.pages.flatMap((page) => page.items).map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
                <InfiniteScroll
                    isManual hasNextPage={query.hasNextPage} isFetchingNextPage={query.isFetchingNextPage} fetchNextPage={query.fetchNextPage}
                />
            </div>
        </div>
    )
}

function CommentsSectionSkeleton() {
    return (
        <div className="mt-6 flex justify-center items-center">
            <Loader2Icon className="text-muted-foreground size-7 animate-spin"/>
        </div>
    )
}
