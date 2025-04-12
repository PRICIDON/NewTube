import React from 'react'
import {HydrateClient, trpc} from "@/trpc/server";
import {DEFAULT_LIMIT} from "@/lib/constants";
import HistoryVideosSection from "@/components/playlists/histore-videos-section";

export const dynamic = "force-dynamic"

export default async function Page() {
    void trpc.playlists.getHistory.prefetchInfinite({ limit: DEFAULT_LIMIT})
    return (
        <HydrateClient>
            <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
                <div className="">
                    <h1 className="text-2xl font-bold">History</h1>
                    <p className="text-xs text-muted-foreground">Videos you have wached</p>
                </div>
                <HistoryVideosSection />
            </div>
        </HydrateClient>
    )
}
