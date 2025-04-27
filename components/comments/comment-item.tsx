import React, {useState} from 'react'
import {CommentsGetManyOutput} from '@/components/comments/types'
import Link from 'next/link'
import UserAvatar from '@/components/users/avatar'
import {formatDistanceToNow} from 'date-fns'
import {trpc} from '@/trpc/client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {Button} from '@/components/ui/button'
import {
    ChevronDownIcon,
    ChevronUpIcon,
    MoreVerticalIcon,
    ThumbsDownIcon,
    ThumbsUpIcon,
    Trash2Icon
} from 'lucide-react'
import {useAuth, useClerk} from '@clerk/nextjs'
import {toast} from 'sonner'
import {cn} from '@/lib/utils'
import CommentForm from '@/components/comments/comment-form'
import CommentReplies from '@/components/comments/comment-replies'
import {useTranslations} from 'next-intl'

interface CommentItem {
    comment: CommentsGetManyOutput["items"][number]
    variant?: "reply" | "comment"
}

export default function CommentItem({comment, variant = "comment"}: CommentItem) {
    const { userId } = useAuth()
    const clerk = useClerk();
    
    const t = useTranslations('comments')

    const [isReplyOpen, setIsReplyOpen] = useState(false)
    const [isRepliesOpen, setIsRepliesOpen] = useState(false)

    const utils = trpc.useUtils()

    const remove = trpc.comments.remove.useMutation({
        onSuccess(){
            toast.success("Comment removed")
            utils.comments.getMany.invalidate({ videoId: comment.videoId})
        },
        onError(e){
            toast.error("Something went wrong")
            console.error(e)
        }
    })
    const like = trpc.commentReactions.like.useMutation({
        onSuccess() {
            utils.comments.getMany.invalidate()
        },
        onError(e){
            toast.error("Something went wrong!")
            if(e.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn()
            }
        }
    })
    const dislike = trpc.commentReactions.dislike.useMutation({
        onSuccess() {
            utils.comments.getMany.invalidate({ videoId: comment.videoId})
        },
        onError(e){
            toast.error("Something went wrong!")
            if(e.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn()
            }
        }
    })
    return (
        <div>
            <div className="flex gap-4 ">
                <Link href={`/users/${comment.userId}`}>
                    <UserAvatar size={variant === "reply" ? "sm" :"lg"} imageUrl={comment.user.imageUrl} name={comment.user.name} />
                </Link>
                <div className="flex-1 min-w-0">
                    <Link href={`/users/${comment.userId}`}>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium text-sm pb-0.5">
                                {comment.user.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(comment.createdAt, { addSuffix: true})}
                            </span>
                        </div>
                    </Link>
                    <p className="text-sm">{comment.value}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                            <Button
                                className="size-8"
                                size="icon"
                                disabled={like.isPending}
                                variant="ghost"
                                onClick={() => like.mutate({ commentId: comment.id })}
                            >
                                <ThumbsUpIcon className={cn("", comment.viewerReactions === "like" && "fill-black dark:fill-white")}/>
                            </Button>
                            <span className="text-xs text-muted-foreground">{comment.likeCount}</span>
                            <Button
                                className="size-8"
                                size="icon"
                                disabled={dislike.isPending}
                                variant="ghost"
                                onClick={() => dislike.mutate({ commentId: comment.id })}
                            >
                                <ThumbsDownIcon className={cn("", comment.viewerReactions === "dislike" && "fill-black dark:fill-white")}/>
                            </Button>
                            <span className="text-xs text-muted-foreground">{comment.dislikeCount}</span>
                        </div>
                        {variant === "comment" && (
                            <Button variant="ghost" size="sm" className="h-8" onClick={() => setIsReplyOpen(true)}>{t('titleReply')}</Button>
                        )}
                    </div>
                </div>
                { comment.user.clerkId === userId && (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon" className="size-8">
                                <MoreVerticalIcon/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => remove.mutate({ id: comment.id })}>
                                <Trash2Icon className="size-4"/>
                                {t('delete')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
            {isReplyOpen && variant === "comment" && (
                <div className="mt-4 pl-14">
                    <CommentForm
                        videoId={comment.videoId}
                        onSuccess={() => {
                            setIsReplyOpen(false)
                            setIsRepliesOpen(true)
                        }}
                        parentId={comment.id}
                        variant="reply"
                        onCancel={() => {
                            setIsReplyOpen(false)
                        }}
                    />
                </div>
            )}
            {comment.replyCount > 0 && variant === "comment" && (
                        <div className="pl-14">
                            <Button
                                size="sm"
                                variant="tertiary"
                                onClick={() => setIsRepliesOpen(current => !current)}
                            >
                                {isReplyOpen ? <ChevronUpIcon/> : <ChevronDownIcon/>}
                                {comment.replyCount} {t('countReply')}
                            </Button>
                        </div>
                    )}
            {comment.replyCount > 0 && variant === "comment" && isRepliesOpen && (
                <CommentReplies
                    parentId={comment.id}
                    videoId={comment.videoId}
                />
            )}
        </div>
    )
}
