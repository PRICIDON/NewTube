'use client'
import React, {Suspense} from 'react'
import {trpc} from '@/trpc/client'
import {DEFAULT_LIMIT} from '@/lib/constants'
import InfiniteScroll from '@/components/infinite-scroll'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../ui/table'
import Link from 'next/link'
import VideoThumbnail from '@/components/videos/video-thumbnail'
import {format} from 'date-fns'
import {snakeCaseToTitle} from '@/lib/utils'
import {Globe2Icon, LockIcon} from 'lucide-react'
import {Skeleton} from '@/components/ui/skeleton'
import {ErrorBoundary} from 'react-error-boundary'
import {useLocale, useTranslations} from 'next-intl'
import {enUS, ru} from 'date-fns/locale'

function VideoSectionSkeleton() {
    const t = useTranslations('studio.table')
    return (
        <>
            <div>
                <div className="border-y">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-6 w-[510px]">{t("video")}</TableHead>
                                <TableHead>{t("visibility")}</TableHead>
                                <TableHead>{t("status")}</TableHead>
                                <TableHead>{t("date")}</TableHead>
                                <TableHead className="text-right">{t("views")}</TableHead>
                                <TableHead className="text-right">{t("comments")}</TableHead>
                                <TableHead className="text-right pr-6">{t("likes")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({length: 5}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell className="pl-6">
                                        <div className="flex items-center gap-4">
                                            <Skeleton className="h-20 w-36"/>
                                            <div className="flex flex-col gap-2">
                                                <Skeleton className="h-4 w-[100px]"/>
                                                <Skeleton className="h-3 w-[150px]"/>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-20"/>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-16"/>
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-24"/>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="h-4 w-12 ml-auto"/>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="h-4 w-12 ml-auto"/>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Skeleton className="h-4 w-12 ml-auto"/>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    )
}

export default function VideosSection() {
    return (
        <Suspense fallback={<VideoSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <VideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

function VideosSectionSuspense () {
    const locale = useLocale()
    const t = useTranslations('studio.table')
    const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery({
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
                            <TableHead className="pl-6 w-[510px]">{t("video")}</TableHead>
                                <TableHead>{t("visibility")}</TableHead>
                                <TableHead>{t("status")}</TableHead>
                                <TableHead>{t("date")}</TableHead>
                                <TableHead className="text-right">{t("views")}</TableHead>
                                <TableHead className="text-right">{t("comments")}</TableHead>
                                <TableHead className="text-right pr-6">{t("likes")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos?.pages.flatMap(page => page.items).map(video => (
                            <Link href={`/studio/videos/${video.id}`} key={video.id} legacyBehavior>
                                <TableRow className="cursor-pointer">
                                    <TableCell  className="pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative aspect-video w-36 shrink-0">
                                                <VideoThumbnail
                                                    thumbnailUrl={video.thumbnailUrl!}
                                                    previewUrl={video.previewUrl!}
                                                    title={video.title}
                                                    duration={video.duration!}
                                                />
                                            </div>
                                            <div className="flex flex-col overflow-hidden gap-y-1">
                                                <span className="text-sm line-clamp-1">{video.title}</span>
                                                <span className="text-xs text-muted-foreground line-clamp-1">{video.description || t('noDesc')}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {video.visibility === "private" ? <LockIcon className="size-4 mr-2"/> : <Globe2Icon className="size-4 mr-2"/>}
                                            {snakeCaseToTitle(video.visibility)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {snakeCaseToTitle(video.muxStatus!)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="truncate text-sm">{format(new Date(video.updatedAt), "d MMM yyyy", { locale: locale === "en" ? enUS : ru })}</TableCell>
                                    <TableCell className="text-right">{video.viewCount}</TableCell>
                                    <TableCell className="text-right">{video.commentCount}</TableCell>
                                    <TableCell className="text-right pr-6">{video.likeCount}</TableCell>
                                </TableRow>
                            </Link>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <InfiniteScroll isManual hasNextPage={query.hasNextPage} isFetchingNextPage={query.isFetchingNextPage} fetchNextPage={query.fetchNextPage}/>
        </div>
    )
}
