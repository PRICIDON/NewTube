import React from 'react'
import {HydrateClient, trpc} from "@/trpc/server";
import VideoSection from "@/components/videos/video-section";

export const dynamic = "force-dynamic"

interface PageProps {
    params: Promise<{ videoId: string}>
}

export default async function Page({ params }: PageProps) {
    const { videoId } = await params

    void trpc.videos.getOne.prefetch({ id: videoId })


    return (
        <HydrateClient>
            <div className="flex flex-col max-w-[1700px] mx-auto pt-2.5 px-4 mb-10">
                <div className="flex flex-col xl:flex-row gap-6">
                    <div className="flex-1 mix-w-0">
                        <VideoSection videoId={videoId} />
                    </div>
                </div>
            </div>
        </HydrateClient>
    )
}
