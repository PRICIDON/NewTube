import React from 'react'
import {VideoGetOneOutput} from "@/components/videos/types";
import {AlertTriangleIcon} from "lucide-react";
import {useTranslations} from 'next-intl'

interface VideoBannerProps {
    status: VideoGetOneOutput["muxStatus"]
}

export default function VideoBanner({status}: VideoBannerProps) {
    if (status == 'ready') return null
    const t = useTranslations('video')
    return (
        <div className="bg-yellow-500 py-3 px-4 rounded-b-xl flex items-center gap-2">
            <AlertTriangleIcon className="size-4 text-black shrink-0"/>
            <p className="text-xs md:text-sm font-medium text-black line-clamp-1">
              {t('processed')}
            </p>
        </div>
    )
}
