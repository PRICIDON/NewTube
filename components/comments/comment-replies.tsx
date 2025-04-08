import React from 'react'

interface CommentRepliesProps {
    parentId: string;
    videoId: string;
}

export default function CommentReplies({ parentId, videoId }: CommentRepliesProps) {
    return (
        <div>
            Replies!
        </div>
    )
}
