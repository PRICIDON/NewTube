import React from 'react'
import {HydrateClient, trpc} from "@/trpc/server"
import StudioView from "@/components/views/studio-view";
import {DEFAULT_LIMIT} from "@/lib/constants";

export default async function Page() {
    void trpc.studio.getMany.prefetchInfinite({
        limit: DEFAULT_LIMIT
    });

    return (
        <HydrateClient>
            <StudioView />
        </HydrateClient>
    )
}
