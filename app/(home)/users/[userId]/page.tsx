import React from 'react'
import {HydrateClient, trpc} from '@/trpc/server'
import UserSection from '@/components/users/user-section'
import {DEFAULT_LIMIT} from '@/lib/constants'
import VideosSection from '@/components/users/videos-section'

export const dynamic = "force-dynamic"

interface PageProps {
	params: Promise<{ userId: string }>
}

export default async function Page({ params }: PageProps) {
	const { userId } = await params
	void trpc.users.getOne.prefetch({id:userId})
	void trpc.videos.getMany.prefetchInfinite({userId, limit: DEFAULT_LIMIT})
	
	return (
		<HydrateClient>
			<div className="flex flex-col max-w-[1300px] px-4 pt-2.5 mx-auto mb-10 gap-y-6">
				<UserSection userId={userId}/>
				<VideosSection userId={userId}/>
			</div>
		</HydrateClient>
	)
}
