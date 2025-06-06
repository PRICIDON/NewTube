import React from 'react'
import MuxUploader, {
    MuxUploaderDrop,
    MuxUploaderFileSelect,
    MuxUploaderProgress,
    MuxUploaderStatus
} from '@mux/mux-uploader-react'
import {UploadIcon} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {useTheme} from 'next-themes'
import {useTranslations} from 'next-intl'

interface StudioUploaderProps {
    endpoint?: string | null
    onSuccess: () => void
}

const UPLOADER_ID = "video-uploader"

export default function StudioUploader({ endpoint, onSuccess }: StudioUploaderProps) {
    const theme = useTheme()
    const t = useTranslations("studio.uploadModal.uploader")
    return (
        <div>
            <MuxUploader
                endpoint={endpoint}
                onSuccess={onSuccess}
                id={UPLOADER_ID}
                className="hidden group/uploader"
            />
            <MuxUploaderDrop muxUploader={UPLOADER_ID} className="group/drop" >
                <div slot="heading" className="flex flex-col items-center gap-6">
                    <div className="flex items-center justify-center gap-2 rounded-full bg-muted size-32">
                        <UploadIcon className="size-10 text-muted-foreground group/drop-[$[active]]:animate-bounce transition-all duration-300" />
                    </div>
                    <div className="flex flex-col gap-2 text-center">
                        <p className="text-sm">{t('title')}</p>
                        <p className="text-xs text-muted-foreground">{t('description')}</p>
                    </div>
                    <MuxUploaderFileSelect muxUploader={UPLOADER_ID}>
                        <Button type="button" className="rounded-full">{t('button')}</Button>
                    </MuxUploaderFileSelect>
                </div>
                <span slot="separator" className="hidden"/>
                <MuxUploaderStatus muxUploader={UPLOADER_ID} className="text-sm" />
                <MuxUploaderProgress muxUploader={UPLOADER_ID} type="percentage" className="text-sm"/>
                <MuxUploaderProgress muxUploader={UPLOADER_ID} type="bar" style={theme.theme === "dark" ? {"--progress-bar-fill-color": "white"} : {}}/>
            </MuxUploaderDrop>
        </div>
    )
}
