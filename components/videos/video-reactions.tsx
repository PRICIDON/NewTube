import React from 'react'
import {Button} from "@/components/ui/button";
import {ThumbsDownIcon, ThumbsUpIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {Separator} from "@/components/ui/separator";

export default function VideoReactions() {
    const viewerReaction: "like" | "dislike" = "like"
    return (
        <div className="flex items-center flex-none">
            <Button variant="secondary" className="rounded-l-full rounded-r-none gap-2 pr-4">
                <ThumbsUpIcon className={cn("size-5", viewerReaction === 'like' && "fill-black")}/>
                {1}
            </Button>
            <Separator orientation="vertical" className="h-7" />
            <Button variant="secondary" className="rounded-r-full rounded-l-none pl-3">
                <ThumbsDownIcon className={cn("size-5", viewerReaction !== 'like' && "fill-black")}/>
                {1}
            </Button>
        </div>
    )
}
