import React from 'react'
import {UserGetOneOutput} from '@/components/users/types'
import UserAvatar from '@/components/users/avatar'
import {useAuth, useClerk} from '@clerk/nextjs'
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import SubscriptionButton from '@/components/subscriptions/subscription-button'
import {useSubscriptions} from '@/hooks/use-subscription'
import {cn} from '@/lib/utils'
import {Skeleton} from '@/components/ui/skeleton'

interface Props {
	user: UserGetOneOutput
}

export default function UserPageInfo({ user }: Props) {
	const { userId, isLoaded } = useAuth()
	const clerk = useClerk()
	const {isPending, onClick} = useSubscriptions({ userId: user.id, isSubscribed: user.viewerSubscribed });
	return (
		<div className="py-6">
			{/*Mobile layout*/}
			<div className="flex flex-col md:hidden">
				<div className="flex items-center gap-3">
					<UserAvatar
						imageUrl={user.imageUrl}
						name={user.name}
						size="lg"
						className="size-[60px]"
						onClick={() => {
							if(user.clerkId === userId) {
								clerk.openUserProfile()
							}
						}}
					/>
					<div className="flex-1 min-w-0">
						<h1 className="text-xl font-bold">{user.name}</h1>
						<div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
							<span className="">{user.subscriberCount} subscribers &bull;</span>
							<span className="">{user.videoCount} videos</span>
						</div>
					</div>
				</div>
				{userId === user.clerkId ? (
					<Button asChild variant="secondary" className="w-full mt-3 rounded-full">
						<Link href={`/studio`}>Go to studio</Link>
					</Button>
				) : (
					<SubscriptionButton onClick={onClick} disabled={isPending || !isLoaded} isSubscribed={user.viewerSubscribed} className="w-full mt-3" />
				)}
			</div>
			{/*	Desktop layout */}
			<div className="hidden md:flex items-start gap-4">
				<UserAvatar
						imageUrl={user.imageUrl}
						name={user.name}
						size="xl"
						className={cn(userId === user.clerkId && "cursor-pointer hover:opacity-80 transition-opacity duration-300")}
						onClick={() => {
							if(user.clerkId === userId) {
								clerk.openUserProfile()
							}
						}}
					/>
					<div className="flex-1 min-w-0">
						<h1 className="text-4xl font-bold">{user.name}</h1>
						<div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
							<span className="">{user.subscriberCount} subscribers &bull;</span>
							<span className="">{user.videoCount} videos</span>
						</div>
						{userId === user.clerkId ? (
							<Button asChild variant="secondary" className="mt-3 rounded-full">
								<Link href={`/studio`}>Go to studio</Link>
							</Button>
						) : (
							<SubscriptionButton onClick={onClick} disabled={isPending || !isLoaded} isSubscribed={user.viewerSubscribed} className="mt-3" />
						)}
					</div>
			</div>
		</div>
	)
}

export function UserPageInfoSkeleton() {
	return (
		<div className="py-6">
			{/*Mobile layout*/}
			<div className="flex flex-col md:hidden">
				<div className="flex items-center gap-3">
					<Skeleton className="size-[60px] rounded-full"/>
					<div className="flex-1 min-w-0">
						<Skeleton className="h-6 w-32"/>
						<Skeleton className="h-4 w-48 mt-1"/>
					</div>
				</div>
				<Skeleton className="h-10 w-full mt-3 rounded-full"></Skeleton>
			</div>
			{/*	Desktop layout */}
			<div className="hidden md:flex items-start gap-4">
				<div className="flex items-center gap-3">
					<Skeleton className="size-[160px] rounded-full"/>
					<div className="flex-1 min-w-0">
						<Skeleton className="h-8 w-64"/>
						<Skeleton className="h-5 w-48 mt-4"/>
						<Skeleton className="h-10 w-32 mt-3 rounded-full"/>
					</div>
				</div>
			</div>
		</div>
	)
}
