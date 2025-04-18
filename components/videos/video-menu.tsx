import React from 'react'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ListPlusIcon, MoreVerticalIcon, ShareIcon, Trash2Icon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {APP_URL} from "@/lib/constants";

interface VideoMenuProps {
    videoId: string;
    variant?: 'ghost' | 'secondary'
    onRemove?: () => void;
}

export default function VideoMenu({ videoId, variant = "ghost", onRemove }: VideoMenuProps) {
    const onShare = () => {
        const fullUrl = `${APP_URL}/videos/${videoId}`
        navigator.clipboard.writeText(fullUrl)
        toast.success("Link copied to clipboard")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={variant} size="icon" className="rounded-full">
                    <MoreVerticalIcon className=""/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={e=>e.stopPropagation()}>
                <DropdownMenuItem onClick={() => {}}>
                    <ShareIcon className="mr-2 size-4" />
                    Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                    <ListPlusIcon className="mr-2 size-4" />
                    Add to playlist
                </DropdownMenuItem>
                {onRemove && (
                <DropdownMenuItem onClick={() => {}}>
                    <Trash2Icon className="mr-2 size-4" />
                    Remove
                </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
