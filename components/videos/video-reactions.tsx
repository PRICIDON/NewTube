import React from 'react'
import {Button} from "@/components/ui/button";
import {ThumbsDownIcon, ThumbsUpIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {Separator} from "@/components/ui/separator";
import {VideoGetOneOutput} from "@/components/videos/types";
import {useClerk} from "@clerk/nextjs";
import {trpc} from "@/trpc/client";
import {toast} from "sonner";

interface VideoReactions {
    videoId:string
    likes:number
    dislikes:number
    viewerReaction: VideoGetOneOutput["viewerReactions"];
}

export default function VideoReactions({ videoId, viewerReaction, likes, dislikes }: VideoReactions) {
    const clerk = useClerk();
    const utils = trpc.useUtils();
    const like = trpc.videoReactions.like.useMutation({
        onSuccess() {
            utils.videos.getOne.invalidate({ id: videoId})
        //     TODO: Invalidate "liked" playlist
        },
        onError(e){
            toast.error("Something went wrong!")
            if(e.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn()
            }
        }
    })
    const dislike = trpc.videoReactions.dislike.useMutation({
        onSuccess() {
            utils.videos.getOne.invalidate({ id: videoId})
        },
        onError(e){
            toast.error("Something went wrong!")
            if(e.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn()
            }
        }
    })
    return (
        <div className="flex items-center flex-none">
            <Button
                variant="secondary"
                className="rounded-l-full rounded-r-none gap-2 pr-4"
                onClick={() => like.mutate({ videoId })}
                disabled={like.isPending || dislike.isPending}
            >
                <ThumbsUpIcon className={cn("size-5", viewerReaction === 'like' && "fill-black")}/>
                {likes}
            </Button>
            <Separator orientation="vertical" className="h-7" />
            <Button
                variant="secondary"
                className="rounded-r-full rounded-l-none pl-3"
                onClick={() => dislike.mutate({ videoId })}
                disabled={dislike.isPending || like.isPending}
            >
                <ThumbsDownIcon className={cn("size-5", viewerReaction === 'dislike' && "fill-black")}/>
                {dislikes}
            </Button>
        </div>
    )
}
