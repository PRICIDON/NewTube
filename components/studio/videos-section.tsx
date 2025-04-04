'use client'
import React from 'react'
import {trpc} from "@/trpc/client";
import {DEFAULT_LIMIT} from "@/lib/constants";
import InfiniteScroll from "@/components/infinite-scroll";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '../ui/table';
import Link from "next/link";
import VideoThumbnail from "@/components/videos/video-thumbnail";

export default function VideosSection () {
    const { data: videos, hasNextPage, isFetchingNextPage, fetchNextPage } = trpc.studio.getMany.useInfiniteQuery({
        limit: DEFAULT_LIMIT
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })
    return (
        <div>
            <div className="border-y">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6 w-[510px]">Video</TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Views</TableHead>
                            <TableHead className="text-right">Comments</TableHead>
                            <TableHead className="text-right pr-6">Likes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos?.pages.flatMap(page => page.items).map(video => (
                            <Link href={`/studio/videos/${video.id}`} key={video.id} legacyBehavior>
                                <TableRow className="cursor-pointer">
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <div className="relative aspect-video w-36 shrink-0">
                                                <VideoThumbnail
                                                    thumbnailUrl={video.thumbnailUrl!}
                                                    previewUrl={video.previewUrl!}
                                                    title={video.title}
                                                    duration={video.duration!}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>visibility</TableCell>
                                    <TableCell>status</TableCell>
                                    <TableCell>date</TableCell>
                                    <TableCell className="text-right">views</TableCell>
                                    <TableCell className="text-right">comments</TableCell>
                                    <TableCell className="text-right pr-6">likes</TableCell>
                                </TableRow>
                            </Link>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <InfiniteScroll isManual hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage}/>
        </div>
    )
}
