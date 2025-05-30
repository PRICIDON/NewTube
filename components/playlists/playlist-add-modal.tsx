'use client'
import React from 'react'
import ResponsiveDialog from '@/components/responsive-dialog'
import {trpc} from '@/trpc/client'
import {DEFAULT_LIMIT} from '@/lib/constants'
import {Button} from '@/components/ui/button'
import {Loader2Icon, SquareCheckIcon, SquareIcon} from 'lucide-react'
import InfiniteScroll from '@/components/infinite-scroll'
import {toast} from 'sonner'
import {useTranslations} from 'next-intl'

interface Props {
    videoId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function PlaylistAddModal({ open, onOpenChange, videoId }: Props) {
    const t = useTranslations('playlists.addModal')
    const utils = trpc.useUtils();
    const { data: playlists, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage} = trpc.playlists.getManyForVideo.useInfiniteQuery({ limit: DEFAULT_LIMIT, videoId }, { getNextPageParam: lastPage => lastPage.nextCursor, enabled: !!videoId && open})
    const addVideo = trpc.playlists.addVideo.useMutation({
        onSuccess(data) {
            toast.success(t('addSuccess'))
            utils.playlists.getMany.invalidate()
            utils.playlists.getManyForVideo.invalidate({ videoId})
            utils.playlists.getOne.invalidate({ id: data.playlistId})
            utils.playlists.getVideos.invalidate({ playlistId: data.playlistId })
        },
        onError(e) {
            toast.error(t('error'))
            console.log(e)
        }
    })
    const removeVideo = trpc.playlists.removeVideo.useMutation({
        onSuccess(data) {
            toast.success(t('removeSuccess'))
            utils.playlists.getMany.invalidate()
            utils.playlists.getManyForVideo.invalidate({ videoId})
            utils.playlists.getOne.invalidate({ id: data.playlistId})
            utils.playlists.getVideos.invalidate({ playlistId: data.playlistId })
        },
        onError(e) {
            toast.error(t('error'))
            console.log(e)
        }
    })
    return (
        <ResponsiveDialog onOpenChange={onOpenChange} open={open} title={t('title')}>
            <div className="flex flex-col gap-2">
                {isLoading ? (
                    <div className="flex justify-center p-4">
                        <Loader2Icon className="size-5 animate-spin text-muted-foreground"/>
                    </div>
                ) : (
                    <>
                        {playlists?.pages
                            .flatMap(page => page.items)
                            .map(playlist => (
                            <Button
                                variant="ghost"
                                className="w-full justify-start px-2 [$_svg]:size-5"
                                size="lg"
                                key={playlist.id}
                                onClick={() => {
                                    if (playlist.containsVideo) {
                                        removeVideo.mutate({
                                            playlistId: playlist.id,
                                            videoId
                                        })
                                    } else {
                                        addVideo.mutate({
                                            playlistId: playlist.id,
                                            videoId
                                        })
                                    }
                                }}
                                disabled={removeVideo.isPending || addVideo.isPending}
                            >
                                {playlist.containsVideo ? (
                                    <SquareCheckIcon className="mr-2"/>
                                ) : (
                                    <SquareIcon className="mr-2"/>
                                )}
                                {playlist.name}
                            </Button>
                        ))}
                        <InfiniteScroll hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} isManual/>
                    </>
                )}
            </div>
        </ResponsiveDialog>
    )
}
