'use client'
import React, {Suspense} from 'react'
import {ErrorBoundary} from "react-error-boundary";
import {trpc} from "@/trpc/client";
import CommentForm from "@/components/comments/comment-form";
import CommentItem from "@/components/comments/comment-item";

export default function CommentsSection({ videoId } : { videoId: string}) {
    return (
        <Suspense>
            <ErrorBoundary fallback={<p>Error</p>}>
                <CommentsSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    )
}

function CommentsSectionSuspense({ videoId} : { videoId: string}) {
    const [comments] = trpc.comments.getMany.useSuspenseQuery({ videoId })
    return (
        <div className="mt-6">
            <div className="flex flex-col gap-6">
                <h1 className="">{comments.length} Comments</h1>
                <CommentForm videoId={videoId} />
            </div>
            <div className="flex flex-col gap-4 mt-2">
                {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    )
}
