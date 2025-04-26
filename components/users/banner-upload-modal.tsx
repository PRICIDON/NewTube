'use client'
import React from 'react'
import ResponsiveDialog from '@/components/responsive-dialog'
import {UploadDropzone} from '@/lib/uploadthing'
import {trpc} from '@/trpc/client'
import {useTranslations} from 'next-intl'

interface Props {
    userId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function BannerUploadModal({ userId, open, onOpenChange }: Props) {
    const t = useTranslations('user')
    const utils = trpc.useUtils();
    const onUploadComplete = () => {
        utils.users.getOne.invalidate({ id: userId })
        onOpenChange(false);
    }
    return (
        <ResponsiveDialog onOpenChange={onOpenChange} open={open} title={t('bannerUpload')}>
            <UploadDropzone endpoint="bannerUploader" onClientUploadComplete={onUploadComplete} />
        </ResponsiveDialog>
    )
}
