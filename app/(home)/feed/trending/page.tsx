import {HydrateClient, trpc} from "@/trpc/server";
import React from "react";
// import {getTranslations} from "next-intl/server";
import {DEFAULT_LIMIT} from "@/lib/constants";
import TrendingVideosSection from "@/components/home/trending-videos";

export const dynamic = "force-dynamic";


export default async function Trending() {
    // const t = await getTranslations("layouts.main")
    void trpc.videos.getTrending.prefetchInfinite({ limit: DEFAULT_LIMIT})

    return (
        <HydrateClient>
            <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
                <div className="">
                    <h1 className="text-2xl font-bold">Trending</h1>
                    <p className="text-xs text-muted-foreground">Most popular videos at the moment</p>
                </div>
                <TrendingVideosSection />
            </div>
        </HydrateClient>
    );
}
