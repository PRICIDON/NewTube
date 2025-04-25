'use client'
import React, {Suspense} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {trpc} from '@/trpc/client'
import UserPageBanner, {
	UserPageBannerSkeleton
} from '@/components/users/user-page-banner'
import UserPageInfo, {
	UserPageInfoSkeleton
} from '@/components/users/user-page-info'

interface UserSectionProps {
	userId: string
}

export default function UserSection({ userId }: UserSectionProps) {
	
	return (
		<Suspense fallback={<UserSectionSkeleton/>}>
			<ErrorBoundary fallback={<p>Error...</p>}>
				<UserSectionSuspense userId={userId}/>
			</ErrorBoundary>
		</Suspense>
	)
}

function UserSectionSuspense({ userId }: UserSectionProps) {
	const [user] = trpc.users.getOne.useSuspenseQuery({ id: userId})
	return (
		<div className="flex flex-col">
			<UserPageBanner user={user}/>
			<UserPageInfo user={user}/>
		</div>
	)
}

function UserSectionSkeleton() {
	return (
		<div className="flex flex-col">
			<UserPageBannerSkeleton />
			<UserPageInfoSkeleton />
		</div>
	)
}

