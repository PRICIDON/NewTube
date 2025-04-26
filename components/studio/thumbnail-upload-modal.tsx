'use client'
import React from 'react'
import ResponsiveDialog from '@/components/responsive-dialog'
import {UploadDropzone} from '@/lib/uploadthing'
import {trpc} from '@/trpc/client'
import {useTranslations} from 'next-intl'

interface Props {
    videoId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ThumbnailUploadModal({ videoId, open, onOpenChange }: Props) {
    const t = useTranslations('studio.thumbnailUploadModal')
    const utils = trpc.useUtils();
    const onUploadComplete = () => {
        utils.studio.getMany.invalidate()
        utils.studio.getOne.invalidate({ id: videoId })
        onOpenChange(false);
    }
    return (
        <ResponsiveDialog onOpenChange={onOpenChange} open={open} title={t('title')}>
            <UploadDropzone endpoint="thumbnailUploader" input={{videoId}} onClientUploadComplete={onUploadComplete} />
        </ResponsiveDialog>
    )
}
