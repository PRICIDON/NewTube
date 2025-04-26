import React from 'react'
import {HydrateClient, trpc} from '@/trpc/server'
import {DEFAULT_LIMIT} from '@/lib/constants'
import LikedVideosSection
    from '@/components/playlists/section/liked-videos-section'
import {getTranslations} from 'next-intl/server'

export const dynamic = "force-dynamic"

export default async function Page() {
    void trpc.playlists.getLiked.prefetchInfinite({ limit: DEFAULT_LIMIT})
    const t = await getTranslations("playlists.liked")
    return (
        <HydrateClient>
            <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
                <div>
                    <h1 className="text-2xl font-bold">{t('title')}</h1>
                    <p className="text-xs text-muted-foreground">{t('description')}</p>
                </div>
                <LikedVideosSection />
            </div>
        </HydrateClient>
    )
}
