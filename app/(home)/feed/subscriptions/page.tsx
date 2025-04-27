import {HydrateClient, trpc} from '@/trpc/server'
import React from 'react'
import {DEFAULT_LIMIT} from '@/lib/constants'
import SubscriptionsVideosSection from '@/components/home/subscriptions-videos'
import {getTranslations} from 'next-intl/server'

export const dynamic = "force-dynamic";


export default async function Trending() {
    const t = await getTranslations("feed.subscriptions")
    void trpc.videos.getSubscribed.prefetchInfinite({ limit: DEFAULT_LIMIT})

    return (
        <HydrateClient>
            <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
                <div>
                    <h1 className="text-2xl font-bold">{t('title')}</h1>
                    <p className="text-xs text-muted-foreground">{t('description')}</p>
                </div>
                <SubscriptionsVideosSection />
            </div>
        </HydrateClient>
    );
}
