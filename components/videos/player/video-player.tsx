'use client'
import React from 'react'
import MuxPlayer from "@mux/mux-player-react";
import {THUMBNAIL_FALLBACK} from "@/lib/constants";

interface VideoPlayerProps {
    playbackId?: string
    thumbnailUrl?: string
    autoPlay?: boolean
    onPlay?: () => void
    onEnded?: () => void
}

export default function VideoPlayer({ playbackId, thumbnailUrl, onPlay, autoPlay, onEnded }: VideoPlayerProps) {
    if(!playbackId) return null

    return (
        <MuxPlayer
            playbackId={playbackId}
            poster={thumbnailUrl || THUMBNAIL_FALLBACK}
            playerInitTime={0}
            className="size-full object-contain"
            accentColor="#ff2056"
            onPlay={onPlay}
            autoPlay={autoPlay}
            onEnded={onEnded}
        />
    )
};

export const VideoPlayerSkeleton = () => {
    return <div className="aspect-video bg-black rounded-xl"/>
}
