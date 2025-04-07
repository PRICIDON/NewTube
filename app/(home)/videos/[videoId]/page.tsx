import React from 'react'
import {HydrateClient, trpc} from "@/trpc/server";
import VideoSection from "@/components/videos/sections/video-section";
import SuggestionsSection from "@/components/videos/sections/suggestions-section";
import CommentsSection from "@/components/videos/sections/comments-section";

export const dynamic = "force-dynamic"

interface PageProps {
    params: Promise<{ videoId: string}>
}

export default async function Page({ params }: PageProps) {
    const { videoId } = await params

    void trpc.videos.getOne.prefetch({ id: videoId })

    void trpc.comments.getMany.prefetch({ videoId })

    return (
        <HydrateClient>
            <div className="flex flex-col max-w-[1700px] mx-auto pt-2.5 px-4 mb-10">
                <div className="flex flex-col xl:flex-row gap-6">
                    <div className="flex-1 mix-w-0">
                        <VideoSection videoId={videoId} />
                        <div className="xl:hidden block mt-4">
                            <SuggestionsSection />
                        </div>
                        <CommentsSection videoId={videoId} />
                    </div>
                    <div className="hidden xl:block w-full xl:w-[380px] 2xl:w-[460px] shrink-1">
                         <SuggestionsSection />
                    </div>
                </div>
            </div>
        </HydrateClient>
    )
}
