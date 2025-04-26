'use client'
import React from 'react'
import {Button} from '@/components/ui/button'
import {Loader2Icon, PlusIcon} from 'lucide-react'
import {trpc} from '@/trpc/client'
import {toast} from 'sonner'
import ResponsiveDialog from '@/components/responsive-dialog'
import StudioUploader from '@/components/studio/studio-uploader'
import {useRouter} from 'next/navigation'
import {useTranslations} from 'next-intl'


export default function StudioUploadModal() {
    const t = useTranslations("studio.uploadModal")
    const router = useRouter();
    const utils = trpc.useUtils();
    const create = trpc.videos.create.useMutation({
        onSuccess() {
            toast.success(t('success'))
            utils.studio.getMany.invalidate();
        },
        onError(){
            toast.error(t('error'))
        }
    })

    const onSuccess = () => {
        if(!create.data?.video.id) return;
        create.reset()
        router.push(`/studio/videos/${create.data.video.id}`)
    }
    return (
        <>
            <ResponsiveDialog title={t('title')} open={!!create.data?.url} onOpenChange={() => create.reset()}>
                {create.data?.url ? <StudioUploader endpoint={create.data.url} onSuccess={onSuccess}/> : <Loader2Icon/>}
            </ResponsiveDialog>
            <Button variant="secondary" onClick={() => create.mutate()} disabled={create.isPending}>
                {create.isPending ? <Loader2Icon className="animate-spin"/> : <PlusIcon/>}
                {t('button')}
            </Button>
        </>
    )
}
