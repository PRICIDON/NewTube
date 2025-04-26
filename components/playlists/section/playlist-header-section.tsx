'use client'
import React, {Suspense} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {Trash2Icon} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {trpc} from '@/trpc/client'
import {toast} from 'sonner'
import {useRouter} from 'next/navigation'
import {Skeleton} from '@/components/ui/skeleton'
import {useTranslations} from 'next-intl'

interface PlaylistHeaderSectionProps {
	playlistId: string;
}

export default function PlaylistHeaderSection({playlistId}: PlaylistHeaderSectionProps) {
	return (
		<Suspense fallback={<PlaylistHeaderSectionSkeleton/>}>
			<ErrorBoundary fallback={<p>Error...</p>}>
				<PlaylistHeaderSectionSuspense playlistId={playlistId}/>
			</ErrorBoundary>
		</Suspense>
	)
}

function PlaylistHeaderSectionSuspense({ playlistId }: PlaylistHeaderSectionProps) {
	const utils = trpc.useUtils()
	const router = useRouter()
	const t = useTranslations('playlists')
	const [playlist] = trpc.playlists.getOne.useSuspenseQuery({ id: playlistId })
	const remove = trpc.playlists.remove.useMutation({
		onSuccess(){
			toast.success(t('remove'))
			utils.playlists.getMany.invalidate()
			router.push("/playlists")
		},
		onError(err){
			toast.error(t('createModal.error'))
			console.error(err)
		}
	})
	return (
		<div className="flex justify-between items-center">
			<div className="">
				<h1 className="text-2xl font-bold">{playlist.name}</h1>
				<p className="text-xs text-muted-foreground">{t('header')}</p>
			</div>
			<Button variant="outline" size="icon" className="rounded-full" onClick={() => remove.mutate({ id: playlistId })} disabled={remove.isPending}>
				<Trash2Icon/>
			</Button>
		</div>
	)
}

function PlaylistHeaderSectionSkeleton() {
	return (
		<div className="flex flex-col gap-y-2">
			<Skeleton className="h-6 w-24" />
			<Skeleton className="h-6 w-32" />
		</div>
	)
}

