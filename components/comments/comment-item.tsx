import React from 'react'
import {CommentsGetManyOutput} from "@/components/comments/types";
import Link from "next/link";
import UserAvatar from "@/components/avatar";
import {formatDistanceToNow} from "date-fns";
import {trpc} from "@/trpc/client";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MessageSquareIcon, MoreVerticalIcon, Trash2Icon} from "lucide-react";
import {useAuth} from "@clerk/nextjs";
import {toast} from "sonner";

interface CommentItem {
    comment: CommentsGetManyOutput["items"][number]
}

export default function CommentItem({comment}: CommentItem) {
    const { userId } = useAuth()
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
    return (
        <div className="">
            <div className="flex gap-4 ">
                <Link href={`/users/${comment.userId}`}>
                    <UserAvatar size="lg" imageUrl={comment.user.imageUrl} name={comment.user.name} />
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
                {/*    TODO: Reactions*/}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreVerticalIcon className=""/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {}}>
                            <MessageSquareIcon className="size-4"/>
                            Reply
                        </DropdownMenuItem>
                        {comment.user.clerkId === userId && (
                            <DropdownMenuItem onClick={() => remove.mutate({ id: comment.id })}>
                                <Trash2Icon className="size-4"/>
                                Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
