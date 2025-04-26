import React from 'react'
import {HydrateClient, trpc} from '@/trpc/server'
import {DEFAULT_LIMIT} from '@/lib/constants'
import SubscriptionsSection
	from '@/components/subscriptions/subscriptions-section'

export default async function Page() {
	void trpc.subscriptions.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT})
	return (
		<HydrateClient>
			<div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
				<div className="">
					<h1 className="text-2xl font-bold">All subscriptions </h1>
					<p className="text-xs text-muted-foreground">View and manage your subscriptions</p>
				</div>
				<SubscriptionsSection />
			</div>
		</HydrateClient>
	)
}
