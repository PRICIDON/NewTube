'use client'
import React from 'react'
import ResponsiveDialog from "@/components/responsive-dialog";
import {UploadDropzone} from "@/lib/uploadthing";
import {trpc} from "@/trpc/client";

interface Props {
    videoId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ThumbnailUploadModal({ videoId, open, onOpenChange }: Props) {
    const utils = trpc.useUtils();
    const onUploadComplete = () => {
        utils.studio.getMany.invalidate()
        utils.studio.getOne.invalidate({ id: videoId })
        onOpenChange(false);
    }
    return (
        <ResponsiveDialog onOpenChange={onOpenChange} open={open} title="Upload a thumbnail">
            <UploadDropzone endpoint="thumbnailUploader" input={{videoId}} onClientUploadComplete={onUploadComplete} />
        </ResponsiveDialog>
    )
}
