import React from 'react'
import {VideoGetOneOutput} from '@/components/videos/types'
import Link from 'next/link'
import UserAvatar from '@/components/users/avatar'
import {useAuth} from '@clerk/nextjs'
import {Button} from '@/components/ui/button'
import SubscriptionButton from '@/components/subscriptions/subscription-button'
import UserInfo from '@/components/users/user-info'
import {useSubscriptions} from '@/hooks/use-subscription'
import {useTranslations} from 'next-intl'

interface VideoOwnerProps {
    user: VideoGetOneOutput["user"];
    videoId: string;
}

export default function VideoOwner({ user, videoId }: VideoOwnerProps) {
    const t = useTranslations('video')
    const { userId: clerkUserId, isLoaded } = useAuth()
    const {isPending, onClick} = useSubscriptions({ userId: user.id, isSubscribed: user.viewerSubscribed, fromVideoId: videoId });
    return (
        <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
            <Link href={`/users/${user.id}`}>
                <div className="flex items-center gap-3 min-w-0">
                    <UserAvatar size="lg" imageUrl={user.imageUrl} name={user.name} />
                    <div className="flex flex-col gap-1 min-w-0">
                        <UserInfo name={user.name} size='lg'  />
                        <span className="text-sm text-muted-foreground line-clamp-1">
                            {user.subscriberCount} {t('subscriberCount')}
                        </span>
                    </div>
                </div>
            </Link>
            {clerkUserId === user.clerkId ? (
                <Button className="rounded-full" asChild variant="secondary">
                    <Link href={`/studio/videos/${videoId}`}>{t('edit')}</Link>
                </Button>
            ): (
                <SubscriptionButton onClick={onClick} disabled={isPending || !isLoaded} isSubscribed={user.viewerSubscribed} className="flex-none" />
            )}
        </div>
    )
}
