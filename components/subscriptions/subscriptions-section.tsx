'use client'
import React, {Suspense} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {trpc} from '@/trpc/client'
import {DEFAULT_LIMIT} from '@/lib/constants'
import InfiniteScroll from '@/components/infinite-scroll'
import {toast} from 'sonner'
import Link from 'next/link'
import SubscriptionItem, {
  SubscriptionItemSkeleton
} from '@/components/subscriptions/subscription-item'
import {useTranslations} from 'next-intl'


export default function SubscriptionsSection() {
    return (
        <Suspense fallback={<SubscriptionsSectionSkeleton/>}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <SubscriptionsSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

function SubscriptionsSectionSuspense() {
    const t = useTranslations('subscriptions')
    const utils = trpc.useUtils()
    const [subscriptions, query] = trpc.subscriptions.getMany.useSuspenseInfiniteQuery({  limit: DEFAULT_LIMIT}, { getNextPageParam: lastPage => lastPage.nextCursor })
    const unsubscribe = trpc.subscriptions.remove.useMutation({
        onSuccess(data) {
            toast.success(t('success'))
            utils.videos.getSubscribed.invalidate()
            utils.users.getOne.invalidate({ id: data.creatorId })
            utils.subscriptions.getMany.invalidate()
        },
        onError() {
             toast.error(t('error'))
        }
    })
    return (
        <>
            <div
                className="gap-4 gap-y-10 flex flex-col"
            >
                {subscriptions.pages.flatMap(page => page.items).map(subscription => (
                  <Link href={`/users/${subscription.user.id}`} key={subscription.creatorId}>
                    <SubscriptionItem
                      name={subscription.user.name}
                      imageUrl={subscription.user.imageUrl}
                      subscriberCount={subscription.user.subscriberCount}
                      onUnsubscribe={() => unsubscribe.mutate({ userId: subscription.creatorId })}
                      disabled={unsubscribe.isPending}
                    />
                  </Link>
                ))}
            </div>
            <InfiniteScroll isManual hasNextPage={query.hasNextPage} isFetchingNextPage={query.isFetchingNextPage} fetchNextPage={query.fetchNextPage}/>
        </>
    )
}

function SubscriptionsSectionSkeleton() {
    return (
        <>
            <div
                className="gap-4 flex flex-col"
            >
                    {Array.from({length: 18}).map((_, i) => (
                        <SubscriptionItemSkeleton key={i}/>
                    ))}
            </div>
        </>
    )
}
