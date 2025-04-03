import React from 'react'
import MuxUploader from "@mux/mux-uploader-react";

interface StudioUploaderProps {
    endpoint?: string | null
    onSuccess: () => void
}

export default function StudioUploader({ endpoint, onSuccess }: StudioUploaderProps) {
    return (
        <div>
            <MuxUploader endpoint={endpoint} onSuccess={onSuccess} />
        </div>
    )
}
