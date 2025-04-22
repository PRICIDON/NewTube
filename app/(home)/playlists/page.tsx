import React from 'react'
import {HydrateClient, trpc} from "@/trpc/server";
import PlaylistsView from "@/components/playlists/playlists-view";
import {DEFAULT_LIMIT} from "@/lib/constants";

export default async function Page() {
    void trpc.playlists.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT})

    return (
        <HydrateClient>
            <PlaylistsView/>
        </HydrateClient>
    )
}
