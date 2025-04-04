'use client'
import React from 'react'
import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerProps {
    playbackId?: string
    thumbnailUrl?: string
    autoPlay?: boolean
    onPlay?: () => void
}

export default function VideoPlayer({ playbackId, thumbnailUrl, onPlay, autoPlay }: VideoPlayerProps) {
    if(!playbackId) return null

    return (
        <MuxPlayer
            playbackId={playbackId}
            poster={thumbnailUrl || "/placeholder.svg"}
            playerInitTime={0}
            className="size-full object-contain"
            accentColor="#ff2056"
            onPlay={onPlay}
            autoPlay={autoPlay}
        />
    )
};// @ts-ignore
// @ts-ignore
