import React from 'react'
import {VideoGetOneOutput} from "@/components/videos/types";
import VideoOwner from "@/components/videos/video-owner";

interface VideoTopRowProps {
    video: VideoGetOneOutput
}

export default function VideoTopRow({ video }: VideoTopRowProps) {

    return (
        <div className="flex flex-col gap-4 mt-4">
            <h1 className="text-xl font-semibold">{video.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <VideoOwner user={video.user} videoId={video.id}/>
            </div>
        </div>
    )
}
