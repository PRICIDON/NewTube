'use client'
import React from 'react'
import {Button} from "@/components/ui/button";
import {Loader2Icon, PlusIcon} from "lucide-react";
import {trpc} from "@/trpc/client";
import {toast} from "sonner";
import ResponsiveDialog from "@/components/responsive-dialog";
import StudioUploader from "@/components/studio/studio-uploader";


export default function StudioUploadModal() {
    const utils = trpc.useUtils();
    const create = trpc.videos.create.useMutation({
        onSuccess: () => {
            toast.success("Video created")
            utils.studio.getMany.invalidate();
        },
        onError: (e) => {
            toast.error(e.message)
        }
    })
    return (
        <>
            <ResponsiveDialog title="Upload a video" open={!!create.data?.url} onOpenChange={() => create.reset()}>
                {create.data?.url ? <StudioUploader endpoint={create.data.url} onSuccess={() => {}}/> : <Loader2Icon/>}
            </ResponsiveDialog>
            <Button variant="secondary" onClick={() => create.mutate()} disabled={create.isPending}>
                {create.isPending ? <Loader2Icon className="animate-spin"/> : <PlusIcon/>}
                Create
            </Button>
        </>
    )
}
