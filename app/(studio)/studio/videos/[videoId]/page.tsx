import React from 'react'
import {HydrateClient, trpc} from "@/trpc/server";
import FormSection from "@/components/studio/form-section";

export const dynamic = "force-dynamic"

interface PageProps {
    params: Promise<{ videoId: string}>
}

export default async function Page({params}: PageProps) {
    const {videoId} = await params;
    void trpc.studio.getOne.prefetch({ id: videoId });
    void trpc.categories.getMany.prefetch();

    return (
        <HydrateClient>
            <div className="px-4 pt-2.5 max-w-screen-lg">
                <FormSection videoId={videoId} />
            </div>
        </HydrateClient>
    )
}
