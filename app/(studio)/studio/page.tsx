import React from 'react'
import VideosSection from "@/components/studio/videos-section";
import {HydrateClient, trpc} from "@/trpc/server";
import {DEFAULT_LIMIT} from "@/lib/constants";

export const dynamic = "force-dynamic"

export default function Page() {
    void trpc.studio.getMany.prefetchInfinite(
        { limit: DEFAULT_LIMIT })
    return (
        <HydrateClient>
            <div className="flex flex-col gap-y-6 pt-2.5">
                <div className="px-4">
                    <h1 className="text-2xl font-bold">Channel content</h1>
                    <p className="text-muted-foreground text-xs">Manage your channel content and videos</p>
                </div>
                <VideosSection/>
            </div>
        </HydrateClient>
    )
}
