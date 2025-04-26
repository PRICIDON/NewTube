import React from 'react'
import {trpc} from '@/trpc/client'
import {DEFAULT_LIMIT} from '@/lib/constants'
import {CornerDownRightIcon, Loader2Icon} from 'lucide-react'
import CommentItem from '@/components/comments/comment-item'
import {Button} from '@/components/ui/button'
import {useTranslations} from 'next-intl'

interface CommentRepliesProps {
    parentId: string;
    videoId: string;
}

export default function CommentReplies({ parentId, videoId }: CommentRepliesProps) {
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage} = trpc.comments.getMany.useInfiniteQuery({
        limit: DEFAULT_LIMIT,
        videoId,
        parentId,
    },{
        getNextPageParam(lastPage) {
            return lastPage.nextCursor
        }
    })
    const t = useTranslations("comments")
    return (
        <div className="pl-14">
            <div className="flex flex-col gap-4 mt-2">
                {isLoading && (
                    <div className="flex items-center justify-center">
                        <Loader2Icon className="size-6 animate-spin text-muted-foreground"/>
                    </div>
                )}
                {!isLoading && data?.pages.flatMap(page => page.items).map(comment => (
                    <CommentItem key={comment.id} comment={comment} variant="reply"/>
                ))}

            </div>
            {hasNextPage && (
                <Button variant="tertiary" size="sm" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                    <CornerDownRightIcon />
                    {t('showMore')}
                </Button>
            )}
        </div>
    )
}
